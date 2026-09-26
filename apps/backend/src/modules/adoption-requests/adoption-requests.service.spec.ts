import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, FindOperator, UpdateResult } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm';

import { AdoptionRequestsService } from './adoption-requests.service';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';

import { AnimalsService } from '../animals/animals.service';
import { Animal } from '../animals/entities/animal.entity';
import { AnimalStatus } from '../animals/enums/animal-status.enum';
import { LocationsService } from '../locations/locations.service';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

// O service cancela as solicitacoes de um animal pelo par animalId + status
// aceitos, o que o EntityManager.update tipa como "any". O mock declara os
// argumentos reais para que as asserções nao dependam de any.

type UpdateCriteria = {
  animalId: string;
  status: FindOperator<AdoptionRequestStatus>;
};

describe('AdoptionRequestsService', () => {
  let service: AdoptionRequestsService;

  const queryBuilderMock = {
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const adoptionRequestsRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const animalsServiceMock = {
    findById: jest.fn(),
  };

  const locationsServiceMock = {
    validateCity: jest.fn(),
  };

  const transactionManagerMock = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn<
      Promise<UpdateResult>,
      [
        typeof AdoptionRequest,
        UpdateCriteria,
        QueryDeepPartialEntity<AdoptionRequest>,
      ]
    >(),
  };

  const dataSourceMock = {
    transaction: jest.fn(
      async (
        callback: (manager: typeof transactionManagerMock) => Promise<unknown>,
      ) => callback(transactionManagerMock),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    queryBuilderMock.leftJoinAndSelect.mockReturnValue(queryBuilderMock);
    queryBuilderMock.where.mockReturnValue(queryBuilderMock);
    queryBuilderMock.andWhere.mockReturnValue(queryBuilderMock);
    queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
    queryBuilderMock.take.mockReturnValue(queryBuilderMock);

    adoptionRequestsRepositoryMock.createQueryBuilder.mockReturnValue(
      queryBuilderMock,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptionRequestsService,
        {
          provide: getRepositoryToken(AdoptionRequest),
          useValue: adoptionRequestsRepositoryMock,
        },
        {
          provide: AnimalsService,
          useValue: animalsServiceMock,
        },
        {
          provide: LocationsService,
          useValue: locationsServiceMock,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<AdoptionRequestsService>(AdoptionRequestsService);
  });

  describe('create', () => {
    it('should create an adoption request successfully', async () => {
      const input = {
        animalId: 'animal-id',
        applicantName: 'João',
        applicantEmail: 'joao@example.com',
        applicantPhone: '+5554999999999',
        state: BrazilianState.RS,
        city: 'Pelotas',
        message: 'Tenho interesse na adoção.',
      };

      const animal = {
        id: 'animal-id',
        status: AnimalStatus.AVAILABLE,
      };

      const adoptionRequest = {
        id: 'request-id',
        ...input,
        status: AdoptionRequestStatus.PENDING,
      };

      animalsServiceMock.findById.mockResolvedValue(animal);
      locationsServiceMock.validateCity.mockResolvedValue(true);
      adoptionRequestsRepositoryMock.create.mockReturnValue(adoptionRequest);
      adoptionRequestsRepositoryMock.save.mockResolvedValue(adoptionRequest);

      const result = await service.create(input);

      expect(result).toEqual(adoptionRequest);

      expect(animalsServiceMock.findById).toHaveBeenCalledWith(input.animalId);

      expect(locationsServiceMock.validateCity).toHaveBeenCalledWith(
        input.state,
        input.city,
      );

      expect(adoptionRequestsRepositoryMock.create).toHaveBeenCalledWith({
        ...input,
        status: AdoptionRequestStatus.PENDING,
      });

      expect(adoptionRequestsRepositoryMock.save).toHaveBeenCalledWith(
        adoptionRequest,
      );
    });

    it('should throw when the animal is not available', async () => {
      const input = {
        animalId: 'animal-id',
        applicantName: 'João',
        applicantEmail: 'joao@example.com',
        applicantPhone: '+5554999999999',
        state: BrazilianState.RS,
        city: 'Pelotas',
        message: 'Tenho interesse na adoção.',
      };

      animalsServiceMock.findById.mockResolvedValue({
        id: 'animal-id',
        status: AnimalStatus.ADOPTED,
      });

      await expect(service.create(input)).rejects.toThrow(
        new BadRequestException('This animal is not available for adoption'),
      );

      expect(locationsServiceMock.validateCity).not.toHaveBeenCalled();
      expect(adoptionRequestsRepositoryMock.create).not.toHaveBeenCalled();
      expect(adoptionRequestsRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw when the city does not belong to the state', async () => {
      const input = {
        animalId: 'animal-id',
        applicantName: 'João',
        applicantEmail: 'joao@example.com',
        applicantPhone: '+5554999999999',
        state: BrazilianState.RS,
        city: 'São Paulo',
        message: 'Tenho interesse na adoção.',
      };

      animalsServiceMock.findById.mockResolvedValue({
        id: 'animal-id',
        status: AnimalStatus.AVAILABLE,
      });

      locationsServiceMock.validateCity.mockResolvedValue(false);

      await expect(service.create(input)).rejects.toThrow(
        new BadRequestException('City does not belong to the selected state'),
      );

      expect(locationsServiceMock.validateCity).toHaveBeenCalledWith(
        input.state,
        input.city,
      );

      expect(adoptionRequestsRepositoryMock.create).not.toHaveBeenCalled();
      expect(adoptionRequestsRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should propagate the error when the animal does not exist', async () => {
      animalsServiceMock.findById.mockRejectedValue(
        new NotFoundException('Animal not found'),
      );

      const input = {
        animalId: 'invalid-id',
        applicantName: 'João',
        applicantEmail: 'joao@example.com',
        applicantPhone: '+5554999999999',
        state: BrazilianState.RS,
        city: 'Pelotas',
        message: 'Teste.',
      };

      await expect(service.create(input)).rejects.toThrow(
        new NotFoundException('Animal not found'),
      );

      expect(locationsServiceMock.validateCity).not.toHaveBeenCalled();
      expect(adoptionRequestsRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return adoption requests with pagination', async () => {
      const adoptionRequests = [
        {
          id: 'request-1',
          applicantName: 'João',
          status: AdoptionRequestStatus.PENDING,
        },
        {
          id: 'request-2',
          applicantName: 'Maria',
          status: AdoptionRequestStatus.IN_ANALYSIS,
        },
      ];

      queryBuilderMock.getManyAndCount.mockResolvedValue([
        adoptionRequests,
        10,
      ]);

      const result = await service.findAll();

      expect(result).toEqual({
        items: adoptionRequests,
        total: 10,
        page: 1,
        totalPages: 1,
      });

      expect(
        adoptionRequestsRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalledWith('adoptionRequest');

      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
        'adoptionRequest.animal',
        'animal',
      );

      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
    });

    it('should apply the provided filters', async () => {
      const filter = {
        page: 2,
        limit: 4,
        search: 'Rex',
        status: AdoptionRequestStatus.IN_ANALYSIS,
        animalId: 'animal-id',
        state: BrazilianState.RS,
        city: 'Pelotas',
      };

      queryBuilderMock.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(filter);

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        '(adoptionRequest.applicantName ILIKE :search OR animal.name ILIKE :search)',
        {
          search: '%Rex%',
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'adoptionRequest.status = :status',
        {
          status: AdoptionRequestStatus.IN_ANALYSIS,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'adoptionRequest.animalId = :animalId',
        {
          animalId: 'animal-id',
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'adoptionRequest.state = :state',
        {
          state: BrazilianState.RS,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'adoptionRequest.city ILIKE :city',
        {
          city: '%Pelotas%',
        },
      );

      expect(queryBuilderMock.skip).toHaveBeenCalledWith(4);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(4);
    });

    it('should calculate total pages', async () => {
      queryBuilderMock.getManyAndCount.mockResolvedValue([[], 9]);

      const result = await service.findAll({
        page: 2,
        limit: 4,
      });

      expect(result.totalPages).toBe(3);
    });
  });

  describe('findById', () => {
    it('should return the adoption request when it exists', async () => {
      const adoptionRequest = {
        id: 'request-id',
        applicantName: 'João',
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);

      const result = await service.findById('request-id');

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'request-id' },
        relations: {
          animal: {
            images: {
              file: true,
            },
          },
        },
      });
    });

    it('should throw when the adoption request does not exist', async () => {
      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        new NotFoundException('Adoption request not found'),
      );

      expect(adoptionRequestsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: {
          animal: {
            images: {
              file: true,
            },
          },
        },
      });
    });
  });

  describe('startAnalysis', () => {
    it('should move a pending request to analysis', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.PENDING,
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);
      adoptionRequestsRepositoryMock.save.mockResolvedValue(adoptionRequest);

      const result = await service.startAnalysis('request-id');

      expect(result.status).toBe(AdoptionRequestStatus.IN_ANALYSIS);

      expect(adoptionRequestsRepositoryMock.save).toHaveBeenCalledWith(
        adoptionRequest,
      );
    });

    it('should throw when the request is not pending', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.IN_ANALYSIS,
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);

      await expect(service.startAnalysis('request-id')).rejects.toThrow(
        new BadRequestException(
          'Only pending adoption requests can be moved to analysis',
        ),
      );

      expect(adoptionRequestsRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('reject', () => {
    it('should reject a pending request', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.PENDING,
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);
      adoptionRequestsRepositoryMock.save.mockResolvedValue(adoptionRequest);

      const result = await service.reject('request-id');

      expect(result.status).toBe(AdoptionRequestStatus.REJECTED);

      expect(adoptionRequestsRepositoryMock.save).toHaveBeenCalledWith(
        adoptionRequest,
      );
    });

    it('should reject a request in analysis', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.IN_ANALYSIS,
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);
      adoptionRequestsRepositoryMock.save.mockResolvedValue(adoptionRequest);

      const result = await service.reject('request-id');

      expect(result.status).toBe(AdoptionRequestStatus.REJECTED);

      expect(adoptionRequestsRepositoryMock.save).toHaveBeenCalledWith(
        adoptionRequest,
      );
    });

    it('should throw when the request cannot be rejected', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.APPROVED,
      };

      adoptionRequestsRepositoryMock.findOne.mockResolvedValue(adoptionRequest);

      await expect(service.reject('request-id')).rejects.toThrow(
        new BadRequestException(
          'Only pending or adoption requests in analysis can be rejected',
        ),
      );

      expect(adoptionRequestsRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('approve', () => {
    it('should approve a pending request', async () => {
      const adoptionRequest = {
        id: 'request-id',
        animalId: 'animal-id',
        status: AdoptionRequestStatus.PENDING,
      };

      const animal = {
        id: 'animal-id',
        status: AnimalStatus.AVAILABLE,
      };

      transactionManagerMock.findOne
        .mockResolvedValueOnce(adoptionRequest)
        .mockResolvedValueOnce(animal);

      transactionManagerMock.save
        .mockResolvedValueOnce(adoptionRequest)
        .mockResolvedValueOnce(animal);

      const result = await service.approve('request-id');

      expect(result.status).toBe(AdoptionRequestStatus.APPROVED);
      expect(animal.status).toBe(AnimalStatus.ADOPTED);

      expect(transactionManagerMock.findOne).toHaveBeenNthCalledWith(
        1,
        AdoptionRequest,
        {
          where: { id: 'request-id' },
        },
      );

      expect(transactionManagerMock.findOne).toHaveBeenNthCalledWith(
        2,
        Animal,
        {
          where: { id: 'animal-id' },
          lock: {
            mode: 'pessimistic_write',
          },
        },
      );

      expect(transactionManagerMock.save).toHaveBeenNthCalledWith(
        1,
        AdoptionRequest,
        adoptionRequest,
      );

      expect(transactionManagerMock.save).toHaveBeenNthCalledWith(
        2,
        Animal,
        animal,
      );

      expect(transactionManagerMock.update).toHaveBeenCalledTimes(1);

      const updateCall = transactionManagerMock.update.mock.calls[0];

      expect(updateCall[0]).toBe(AdoptionRequest);
      expect(updateCall[1].animalId).toBe('animal-id');
      expect(updateCall[1].status.value).toEqual([
        AdoptionRequestStatus.PENDING,
        AdoptionRequestStatus.IN_ANALYSIS,
      ]);
      expect(updateCall[2]).toEqual({
        status: AdoptionRequestStatus.CANCELED,
      });
    });

    it('should approve a request in analysis', async () => {
      const adoptionRequest = {
        id: 'request-id',
        animalId: 'animal-id',
        status: AdoptionRequestStatus.IN_ANALYSIS,
      };

      const animal = {
        id: 'animal-id',
        status: AnimalStatus.AVAILABLE,
      };

      transactionManagerMock.findOne
        .mockResolvedValueOnce(adoptionRequest)
        .mockResolvedValueOnce(animal);

      await service.approve('request-id');

      expect(adoptionRequest.status).toBe(AdoptionRequestStatus.APPROVED);

      expect(animal.status).toBe(AnimalStatus.ADOPTED);
    });

    it('should throw when the request does not exist', async () => {
      transactionManagerMock.findOne.mockResolvedValue(null);

      await expect(service.approve('invalid-id')).rejects.toThrow(
        new NotFoundException('Adoption request not found'),
      );

      expect(transactionManagerMock.findOne).toHaveBeenCalledWith(
        AdoptionRequest,
        {
          where: { id: 'invalid-id' },
        },
      );
    });

    it('should throw when the request cannot be approved', async () => {
      const adoptionRequest = {
        id: 'request-id',
        animalId: 'animal-id',
        status: AdoptionRequestStatus.REJECTED,
      };

      transactionManagerMock.findOne.mockResolvedValue(adoptionRequest);

      await expect(service.approve('request-id')).rejects.toThrow(
        new BadRequestException(
          'Only pending or adoption requests in analysis can be approved',
        ),
      );

      expect(transactionManagerMock.findOne).toHaveBeenCalledTimes(1);
      expect(transactionManagerMock.save).not.toHaveBeenCalled();
    });

    it('should throw when the animal does not exist', async () => {
      const adoptionRequest = {
        id: 'request-id',
        animalId: 'animal-id',
        status: AdoptionRequestStatus.PENDING,
      };

      transactionManagerMock.findOne
        .mockResolvedValueOnce(adoptionRequest)
        .mockResolvedValueOnce(null);

      await expect(service.approve('request-id')).rejects.toThrow(
        new NotFoundException('Animal not found'),
      );

      expect(transactionManagerMock.save).not.toHaveBeenCalled();
    });

    it('should throw when the animal is not available', async () => {
      const adoptionRequest = {
        id: 'request-id',
        animalId: 'animal-id',
        status: AdoptionRequestStatus.PENDING,
      };

      const animal = {
        id: 'animal-id',
        status: AnimalStatus.ADOPTED,
      };

      transactionManagerMock.findOne
        .mockResolvedValueOnce(adoptionRequest)
        .mockResolvedValueOnce(animal);

      await expect(service.approve('request-id')).rejects.toThrow(
        new BadRequestException('This animal is not available for adoption'),
      );

      expect(transactionManagerMock.save).not.toHaveBeenCalled();
    });
  });
});
