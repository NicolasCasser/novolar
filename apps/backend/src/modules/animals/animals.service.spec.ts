import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { AnimalImage } from './entities/animal-image.entity';
import { FilesService } from '../files/files.service';
import { LOCATIONS_PROVIDER } from '../locations/providers/locations.providers';

import { AnimalSpecies } from './enums/animal-species.enum';
import { AnimalSex } from './enums/animal-sex.enum';
import { AnimalSize } from './enums/animal-size.enum';
import { AnimalStatus } from './enums/animal-status.enum';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

describe('AnimalsService', () => {
  let service: AnimalsService;

  const queryBuilderMock = {
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const animalsRepositoryMock = {
    findOne: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const filesServiceMock = {
    findById: jest.fn(),
  };

  const locationsProviderMock = {
    validateCity: jest.fn(),
  };

  const transactionManagerMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
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

    animalsRepositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getRepositoryToken(Animal),
          useValue: animalsRepositoryMock,
        },
        {
          provide: FilesService,
          useValue: filesServiceMock,
        },
        {
          provide: LOCATIONS_PROVIDER,
          useValue: locationsProviderMock,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  describe('create', () => {
    it('should create an animal successfully', async () => {
      const input = {
        name: 'Rex',
        description: 'Cão dócil',
        species: AnimalSpecies.DOG,
        breed: 'SRD',
        sex: AnimalSex.MALE,
        size: AnimalSize.MEDIUM,
        color: 'Caramelo',
        state: BrazilianState.RS,
        city: 'Pelotas',
        ageInMonths: 24,
        vaccinated: true,
        neutered: true,
        images: [{ fileId: 'file-id' }],
      };

      const file = {
        id: 'file-id',
      };

      const animal = {
        id: 'animal-id',
      };

      const animalImage = {
        id: 'animal-image-id',
        file,
        isPrimary: true,
      };

      const animalWithImages = {
        ...animal,
        images: [animalImage],
      };

      locationsProviderMock.validateCity.mockResolvedValue(true);
      filesServiceMock.findById.mockResolvedValue(file);

      transactionManagerMock.create
        .mockReturnValueOnce(animal)
        .mockReturnValueOnce(animalImage);

      transactionManagerMock.save
        .mockResolvedValueOnce(animal)
        .mockResolvedValueOnce([animalImage]);

      transactionManagerMock.findOneOrFail.mockResolvedValue(animalWithImages);

      const result = await service.create(input, 'user-id');

      expect(result).toEqual(animalWithImages);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledWith(
        input.state,
        input.city,
      );

      expect(filesServiceMock.findById).toHaveBeenCalledWith('file-id');

      expect(transactionManagerMock.create).toHaveBeenNthCalledWith(1, Animal, {
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
        createdByUserId: 'user-id',
      });

      expect(transactionManagerMock.create).toHaveBeenNthCalledWith(
        2,
        AnimalImage,
        {
          animalId: animal.id,
          fileId: file.id,
          isPrimary: true,
        },
      );

      expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw when the animal has no images', async () => {
      const input = {
        name: 'Rex',
        description: 'Cão dócil',
        species: AnimalSpecies.DOG,
        breed: 'SRD',
        sex: AnimalSex.MALE,
        size: AnimalSize.MEDIUM,
        color: 'Caramelo',
        state: BrazilianState.RS,
        city: 'Pelotas',
        ageInMonths: 24,
        vaccinated: true,
        neutered: true,
        images: [],
      };

      await expect(service.create(input, 'user-id')).rejects.toThrow(
        new BadRequestException('Animal must have at least one image'),
      );

      expect(locationsProviderMock.validateCity).not.toHaveBeenCalled();
      expect(dataSourceMock.transaction).not.toHaveBeenCalled();
    });

    it('should throw when the city does not belong to the state', async () => {
      const input = {
        name: 'Rex',
        description: 'Cão dócil',
        species: AnimalSpecies.DOG,
        breed: 'SRD',
        sex: AnimalSex.MALE,
        size: AnimalSize.MEDIUM,
        color: 'Caramelo',
        state: BrazilianState.RS,
        city: 'São Paulo',
        ageInMonths: 24,
        vaccinated: true,
        neutered: true,
        images: [{ fileId: 'file-id' }],
      };

      locationsProviderMock.validateCity.mockResolvedValue(false);

      await expect(service.create(input, 'user-id')).rejects.toThrow(
        new BadRequestException('City does not belong to the selected state'),
      );

      expect(locationsProviderMock.validateCity).toHaveBeenCalledWith(
        input.state,
        input.city,
      );

      expect(filesServiceMock.findById).not.toHaveBeenCalled();
      expect(dataSourceMock.transaction).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return available animals with pagination', async () => {
      const animals = [
        {
          id: 'animal-1',
          name: 'Rex',
          status: AnimalStatus.AVAILABLE,
          images: [],
        },
        {
          id: 'animal-2',
          name: 'Luna',
          status: AnimalStatus.AVAILABLE,
          images: [],
        },
      ];

      queryBuilderMock.getManyAndCount.mockResolvedValue([animals, 10]);

      const result = await service.findAll();

      expect(result).toEqual({
        items: animals,
        total: 10,
        page: 1,
        totalPages: 2,
      });

      expect(animalsRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'animal',
      );

      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'animal.images',
        'image',
      );

      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        'image.file',
        'file',
      );

      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'animal.status = :status',
        {
          status: AnimalStatus.AVAILABLE,
        },
      );

      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(8);
    });

    it('should apply the provided filters', async () => {
      const filter = {
        page: 2,
        limit: 4,
        search: 'Rex',
        species: AnimalSpecies.DOG,
        size: AnimalSize.MEDIUM,
        sex: AnimalSex.MALE,
        state: BrazilianState.RS,
        city: 'Pelotas',
        minAgeInMonths: 12,
        maxAgeInMonths: 60,
      };

      queryBuilderMock.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(filter);

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        '(animal.name ILIKE :search OR animal.breed ILIKE :search OR animal.description ILIKE :search)',
        {
          search: '%Rex%',
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.species = :species',
        {
          species: AnimalSpecies.DOG,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.size = :size',
        {
          size: AnimalSize.MEDIUM,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.sex = :sex',
        {
          sex: AnimalSex.MALE,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.state = :state',
        {
          state: BrazilianState.RS,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.city ILIKE :city',
        {
          city: 'Pelotas',
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.ageInMonths >= :minAgeInMonths',
        {
          minAgeInMonths: 12,
        },
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'animal.ageInMonths <= :maxAgeInMonths',
        {
          maxAgeInMonths: 60,
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
    it('should return the animal when it exists', async () => {
      const animal = {
        id: 'animal-id',
        name: 'Rex',
        images: [],
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);

      const result = await service.findById('animal-id');

      expect(result).toEqual(animal);

      expect(animalsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'animal-id' },
        relations: {
          images: {
            file: true,
          },
        },
      });
    });

    it('should throw when the animal does not exist', async () => {
      animalsRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        new NotFoundException('Animal not found'),
      );

      expect(animalsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: {
          images: {
            file: true,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update the provided fields', async () => {
      const animal = {
        id: 'animal-id',
        name: 'Rex',
        description: 'Cão dócil',
        species: AnimalSpecies.DOG,
        breed: 'SRD',
        sex: AnimalSex.MALE,
        size: AnimalSize.MEDIUM,
        color: 'Caramelo',
        state: BrazilianState.RS,
        city: 'Pelotas',
        ageInMonths: 24,
        vaccinated: true,
        neutered: true,
      };

      const input = {
        name: 'Rex Atualizado',
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);

      transactionManagerMock.save.mockResolvedValue(animal);
      transactionManagerMock.findOneOrFail.mockResolvedValue(animal);

      const result = await service.update('animal-id', input);

      expect(result).toEqual(animal);
      expect(animal.name).toBe('Rex Atualizado');
      expect(animal.description).toBe('Cão dócil');

      expect(transactionManagerMock.save).toHaveBeenCalledWith(Animal, animal);
    });

    it('should validate the city when state or city is updated', async () => {
      const animal = {
        id: 'animal-id',
        state: BrazilianState.RS,
        city: 'Pelotas',
      };

      const input = {
        city: 'Porto Alegre',
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);
      locationsProviderMock.validateCity.mockResolvedValue(true);
      transactionManagerMock.save.mockResolvedValue(animal);
      transactionManagerMock.findOneOrFail.mockResolvedValue(animal);

      await service.update('animal-id', input);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledWith(
        BrazilianState.RS,
        'Porto Alegre',
      );
    });

    it('should throw when the updated city does not belong to the state', async () => {
      const animal = {
        id: 'animal-id',
        state: BrazilianState.RS,
        city: 'Pelotas',
      };

      const input = {
        city: 'São Paulo',
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);
      locationsProviderMock.validateCity.mockResolvedValue(false);

      await expect(service.update('animal-id', input)).rejects.toThrow(
        new BadRequestException('City does not belong to the selected state'),
      );

      expect(dataSourceMock.transaction).not.toHaveBeenCalled();
    });

    it('should replace the images when images are provided', async () => {
      const animal = {
        id: 'animal-id',
        name: 'Rex',
      };

      const file = {
        id: 'new-file-id',
      };

      const input = {
        images: [{ fileId: 'new-file-id' }],
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);
      filesServiceMock.findById.mockResolvedValue(file);

      transactionManagerMock.save
        .mockResolvedValueOnce(animal)
        .mockResolvedValueOnce([]);

      transactionManagerMock.findOneOrFail.mockResolvedValue(animal);

      await service.update('animal-id', input);

      expect(filesServiceMock.findById).toHaveBeenCalledWith('new-file-id');

      expect(transactionManagerMock.delete).toHaveBeenCalledWith(AnimalImage, {
        animalId: 'animal-id',
      });

      expect(transactionManagerMock.create).toHaveBeenCalledWith(AnimalImage, {
        animalId: 'animal-id',
        fileId: 'new-file-id',
        isPrimary: true,
      });

      expect(transactionManagerMock.save).toHaveBeenCalledTimes(2);
    });

    it('should keep the existing images when images are not provided', async () => {
      const animal = {
        id: 'animal-id',
        name: 'Rex',
      };

      const input = {
        name: 'Rex Atualizado',
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);
      transactionManagerMock.save.mockResolvedValue(animal);
      transactionManagerMock.findOneOrFail.mockResolvedValue(animal);

      await service.update('animal-id', input);

      expect(transactionManagerMock.delete).not.toHaveBeenCalled();
      expect(filesServiceMock.findById).not.toHaveBeenCalled();
    });

    it('should throw when the animal does not exist', async () => {
      animalsRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { name: 'Rex' }),
      ).rejects.toThrow(new NotFoundException('Animal not found'));

      expect(dataSourceMock.transaction).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete the animal', async () => {
      const animal = {
        id: 'animal-id',
        adoptionRequests: [],
      };

      animalsRepositoryMock.findOne.mockResolvedValue(animal);
      animalsRepositoryMock.softRemove.mockResolvedValue(animal);

      const result = await service.remove('animal-id');

      expect(result).toBe('Animal removed successfully');

      expect(animalsRepositoryMock.softRemove).toHaveBeenCalledWith(animal);
    });

    it('should throw when the animal does not exist', async () => {
      animalsRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        new NotFoundException('Animal not found'),
      );

      expect(animalsRepositoryMock.softRemove).not.toHaveBeenCalled();
    });
  });
});
