import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { DataSource, In, Repository } from 'typeorm';
import { AnimalsService } from '../animals/animals.service';
import { LocationsService } from '../locations/locations.service';
import { CreateAdoptionRequestInputDTO } from './dto/create-adoption-request.input';
import { AnimalStatus } from '../animals/enums/animal-status.enum';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionRequestOrderBy } from './enums/adoption-request-order-by.enum';
import { Animal } from '../animals/entities/animal.entity';
import { AdoptionRequestsFilterInputDTO } from './dto/adoption-requests-filter.input';
import { AdoptionRequestsListResult } from './dto/adoption-requests-list-result';

@Injectable()
export class AdoptionRequestsService {
  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly adoptionRequestsRepository: Repository<AdoptionRequest>,
    private readonly animalsService: AnimalsService,
    private readonly locationsService: LocationsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateAdoptionRequestInputDTO): Promise<AdoptionRequest> {
    const animal = await this.animalsService.findById(input.animalId);

    if (animal.status !== AnimalStatus.AVAILABLE) {
      throw new BadRequestException(
        'This animal is not available for adoption',
      );
    }

    const cityIsValid = await this.locationsService.validateCity(
      input.state,
      input.city,
    );

    if (!cityIsValid) {
      throw new BadRequestException(
        'City does not belong to the selected state',
      );
    }

    const adoptionRequest = this.adoptionRequestsRepository.create({
      ...input,
      status: AdoptionRequestStatus.PENDING,
    });

    return this.adoptionRequestsRepository.save(adoptionRequest);
  }

  async findAll(
    filter: AdoptionRequestsFilterInputDTO = new AdoptionRequestsFilterInputDTO(),
  ): Promise<AdoptionRequestsListResult> {
    const { page, limit, search, status, animalId, state, city, orderBy } =
      filter;

    const query = this.adoptionRequestsRepository
      .createQueryBuilder('adoptionRequest')
      .leftJoinAndSelect('adoptionRequest.animal', 'animal');

    if (orderBy === AdoptionRequestOrderBy.CREATED_AT_DESC) {
      query.orderBy('adoptionRequest.createdAt', 'DESC');
    }

    if (orderBy === AdoptionRequestOrderBy.CREATED_AT_ASC) {
      query.orderBy('adoptionRequest.createdAt', 'ASC');
    }

    if (search) {
      query.andWhere(
        '(adoptionRequest.applicantName ILIKE :search OR animal.name ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      query.andWhere('adoptionRequest.status = :status', {
        status,
      });
    }

    if (animalId) {
      query.andWhere('adoptionRequest.animalId = :animalId', {
        animalId,
      });
    }

    if (state) {
      query.andWhere('adoptionRequest.state = :state', {
        state,
      });
    }

    if (city) {
      query.andWhere('adoptionRequest.city ILIKE :city', {
        city: `%${city}%`,
      });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<AdoptionRequest> {
    const adoptionRequest = await this.adoptionRequestsRepository.findOne({
      where: { id },
      relations: {
        animal: {
          images: {
            file: true,
          },
        },
      },
    });

    if (!adoptionRequest) {
      throw new NotFoundException('Adoption request not found');
    }

    return adoptionRequest;
  }

  async startAnalysis(id: string): Promise<AdoptionRequest> {
    const adoptionRequest = await this.findById(id);

    if (adoptionRequest.status !== AdoptionRequestStatus.PENDING) {
      throw new BadRequestException(
        'Only pending adoption requests can be moved to analysis',
      );
    }

    adoptionRequest.status = AdoptionRequestStatus.IN_ANALYSIS;

    return this.adoptionRequestsRepository.save(adoptionRequest);
  }

  async reject(id: string): Promise<AdoptionRequest> {
    const adoptionRequest = await this.findById(id);

    if (
      adoptionRequest.status !== AdoptionRequestStatus.PENDING &&
      adoptionRequest.status !== AdoptionRequestStatus.IN_ANALYSIS
    ) {
      throw new BadRequestException(
        'Only pending or adoption requests in analysis can be rejected',
      );
    }

    adoptionRequest.status = AdoptionRequestStatus.REJECTED;

    return this.adoptionRequestsRepository.save(adoptionRequest);
  }

  async approve(id: string): Promise<AdoptionRequest> {
    return this.dataSource.transaction(async (manager) => {
      const adoptionRequest = await manager.findOne(AdoptionRequest, {
        where: { id },
      });

      if (!adoptionRequest) {
        throw new NotFoundException('Adoption request not found');
      }

      if (
        adoptionRequest.status !== AdoptionRequestStatus.PENDING &&
        adoptionRequest.status !== AdoptionRequestStatus.IN_ANALYSIS
      ) {
        throw new BadRequestException(
          'Only pending or adoption requests in analysis can be approved',
        );
      }

      const animal = await manager.findOne(Animal, {
        where: { id: adoptionRequest.animalId },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!animal) {
        throw new NotFoundException('Animal not found');
      }

      if (animal.status !== AnimalStatus.AVAILABLE) {
        throw new BadRequestException(
          'This animal is not available for adoption',
        );
      }

      adoptionRequest.status = AdoptionRequestStatus.APPROVED;
      animal.status = AnimalStatus.ADOPTED;

      await manager.save(AdoptionRequest, adoptionRequest);
      await manager.save(Animal, animal);

      await manager.update(
        AdoptionRequest,
        {
          animalId: animal.id,
          status: In([
            AdoptionRequestStatus.PENDING,
            AdoptionRequestStatus.IN_ANALYSIS,
          ]),
        },
        {
          status: AdoptionRequestStatus.CANCELED,
        },
      );

      return adoptionRequest;
    });
  }
}
