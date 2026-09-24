import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Animal } from './entities/animal.entity';
import { AnimalImage } from './entities/animal-image.entity';
import { CreateAnimalInputDTO } from './dto/create-animal.input';
import { UpdateAnimalInputDTO } from './dto/update-animal.input';
import { AnimalStatus } from './enums/animal-status.enum';
import { AnimalsFilterInputDTO } from './dto/animals-filter.input';

import { FilesService } from '../files/files.service';
import { LOCATIONS_PROVIDER } from '../locations/providers/locations.providers';
import type { LocationsProvider } from '../locations/providers/locations.providers';
import { AdoptionRequestStatus } from '../adoption-requests/enums/adoption-request-status.enum';
import { AnimalsListResult } from './dto/animals-list-result';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalsRepository: Repository<Animal>,
    private readonly filesService: FilesService,
    @Inject(LOCATIONS_PROVIDER)
    private readonly locationsProvider: LocationsProvider,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateAnimalInputDTO, userId: string): Promise<Animal> {
    if (input.images.length === 0) {
      throw new BadRequestException('Animal must have at least one image');
    }

    const cityIsValid = await this.locationsProvider.validateCity(
      input.state,
      input.city,
    );

    if (!cityIsValid) {
      throw new BadRequestException(
        'City does not belong to the selected state',
      );
    }

    const files = await Promise.all(
      input.images.map((image) => this.filesService.findById(image.fileId)),
    );

    return this.dataSource.transaction(async (manager) => {
      const animal = manager.create(Animal, {
        name: input.name,
        description: input.description,
        species: input.species,
        breed: input.breed,
        sex: input.sex,
        size: input.size,
        color: input.color,
        state: input.state,
        city: input.city,
        ageInMonths: input.ageInMonths,
        vaccinated: input.vaccinated,
        neutered: input.neutered,
        status: AnimalStatus.AVAILABLE,
        createdByUserId: userId,
      });

      const savedAnimal = await manager.save(Animal, animal);

      const animalImages = input.images.map((image, index) =>
        manager.create(AnimalImage, {
          animalId: savedAnimal.id,
          fileId: files[index].id,
          isPrimary: index === 0,
        }),
      );

      await manager.save(AnimalImage, animalImages);

      const animalWithImages = await manager.findOneOrFail(Animal, {
        where: { id: savedAnimal.id },
        relations: {
          images: {
            file: true,
          },
        },
      });

      return animalWithImages;
    });
  }

  async findAll(
    filter: AnimalsFilterInputDTO = new AnimalsFilterInputDTO(),
  ): Promise<AnimalsListResult> {
    const {
      page,
      limit,
      search,
      species,
      size,
      sex,
      state,
      city,
      minAgeInMonths,
      maxAgeInMonths,
    } = filter;

    const query = this.animalsRepository
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.images', 'image')
      .leftJoinAndSelect('image.file', 'file')
      .where('animal.status = :status', {
        status: AnimalStatus.AVAILABLE,
      });

    if (search) {
      query.andWhere(
        '(animal.name ILIKE :search OR animal.breed ILIKE :search OR animal.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (species) {
      query.andWhere('animal.species = :species', {
        species,
      });
    }

    if (size) {
      query.andWhere('animal.size = :size', {
        size,
      });
    }

    if (sex) {
      query.andWhere('animal.sex = :sex', {
        sex,
      });
    }

    if (state) {
      query.andWhere('animal.state = :state', {
        state,
      });
    }

    if (city) {
      query.andWhere('animal.city ILIKE :city', {
        city,
      });
    }

    if (minAgeInMonths !== undefined) {
      query.andWhere('animal.ageInMonths >= :minAgeInMonths', {
        minAgeInMonths,
      });
    }

    if (maxAgeInMonths !== undefined) {
      query.andWhere('animal.ageInMonths <= :maxAgeInMonths', {
        maxAgeInMonths,
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

  async findById(id: string): Promise<Animal> {
    const animal = await this.animalsRepository.findOne({
      where: { id },
      relations: {
        images: {
          file: true,
        },
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal not found');
    }

    return animal;
  }

  async update(id: string, input: UpdateAnimalInputDTO): Promise<Animal> {
    const animal = await this.animalsRepository.findOne({
      where: { id },
    });

    if (!animal) {
      throw new NotFoundException('Animal not found');
    }

    if (input.state || input.city) {
      const state = input.state ?? animal.state;
      const city = input.city ?? animal.city;

      const cityIsValid = await this.locationsProvider.validateCity(
        state,
        city,
      );

      if (!cityIsValid) {
        throw new BadRequestException(
          'City does not belong to the selected state',
        );
      }
    }

    const files = input.images
      ? await Promise.all(
          input.images.map((image) => this.filesService.findById(image.fileId)),
        )
      : [];

    return this.dataSource.transaction(async (manager) => {
      const { images, ...animalData } = input;

      Object.assign(animal, animalData);

      const savedAnimal = await manager.save(Animal, animal);

      if (images) {
        await manager.delete(AnimalImage, {
          animalId: savedAnimal.id,
        });

        const animalImages = images.map((image, index) =>
          manager.create(AnimalImage, {
            animalId: savedAnimal.id,
            fileId: files[index].id,
            isPrimary: index === 0,
          }),
        );

        await manager.save(AnimalImage, animalImages);
      }

      return manager.findOneOrFail(Animal, {
        where: { id: savedAnimal.id },
        relations: {
          images: {
            file: true,
          },
        },
      });
    });
  }

  async remove(id: string): Promise<string> {
    const animal = await this.animalsRepository.findOne({
      where: { id },
      relations: {
        adoptionRequests: true,
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal not found');
    }

    const hasActiveRequests = animal.adoptionRequests.some(
      (request) =>
        request.status === AdoptionRequestStatus.PENDING ||
        request.status === AdoptionRequestStatus.IN_ANALYSIS,
    );

    if (hasActiveRequests) {
      throw new BadRequestException(
        'Animal cannot be removed while it has active adoption requests',
      );
    }

    await this.animalsRepository.softRemove(animal);

    return 'Animal removed successfully';
  }
}
