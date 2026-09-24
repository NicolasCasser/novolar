import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AnimalsResolver } from './animals.resolver';
import { AnimalsService } from './animals.service';
import { FilesService } from '../files/files.service';
import { User } from '../users/entities/user.entity';
import { Animal } from './entities/animal.entity';
import { CreateAnimalInputDTO } from './dto/create-animal.input';
import { UpdateAnimalInputDTO } from './dto/update-animal.input';
import { AnimalsFilterInputDTO } from './dto/animals-filter.input';

describe('AnimalsResolver', () => {
  let resolver: AnimalsResolver;

  const animalsServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const filesServiceMock = {
    getUrl: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsResolver,
        {
          provide: AnimalsService,
          useValue: animalsServiceMock,
        },
        {
          provide: FilesService,
          useValue: filesServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AnimalsResolver>(AnimalsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('animals', () => {
    it('should return the animals list', async () => {
      const animalsResponse = {
        items: [
          {
            id: 'animal-1',
            name: 'Rex',
          },
          {
            id: 'animal-2',
            name: 'Luna',
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      };

      animalsServiceMock.findAll.mockResolvedValue(animalsResponse);

      const result = await resolver.animals();

      expect(result).toEqual(animalsResponse);

      expect(animalsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass the filter to the service', async () => {
      const filter = {
        search: 'Rex',
      } as AnimalsFilterInputDTO;

      const animalsResponse = {
        items: [
          {
            id: 'animal-1',
            name: 'Rex',
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      animalsServiceMock.findAll.mockResolvedValue(animalsResponse);

      const result = await resolver.animals(filter);

      expect(result).toEqual(animalsResponse);

      expect(animalsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('animal', () => {
    it('should return an animal by id', async () => {
      const animal = {
        id: 'animal-1',
        name: 'Rex',
      };

      animalsServiceMock.findById.mockResolvedValue(animal);

      const result = await resolver.animal('animal-1');

      expect(result).toEqual(animal);

      expect(animalsServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.findById).toHaveBeenCalledWith('animal-1');
    });

    it('should throw when the animal is not found', async () => {
      animalsServiceMock.findById.mockRejectedValue(
        new NotFoundException('Animal not found'),
      );

      await expect(resolver.animal('animal-1')).rejects.toThrow(
        'Animal not found',
      );

      expect(animalsServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.findById).toHaveBeenCalledWith('animal-1');
    });
  });

  describe('createAnimal', () => {
    it('should create an animal with the current user id', async () => {
      const input = {
        name: 'Rex',
      } as CreateAnimalInputDTO;

      const user = {
        id: 'user-1',
      } as User;

      const animal = {
        id: 'animal-1',
        name: 'Rex',
      };

      animalsServiceMock.create.mockResolvedValue(animal);

      const result = await resolver.createAnimal(input, user);

      expect(result).toEqual(animal);

      expect(animalsServiceMock.create).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.create).toHaveBeenCalledWith(input, user.id);
    });
  });

  describe('updateAnimal', () => {
    it('should update an animal', async () => {
      const input = {
        name: 'Rex Updated',
      } as UpdateAnimalInputDTO;

      const animal = {
        id: 'animal-1',
        name: 'Rex Updated',
      };

      animalsServiceMock.update.mockResolvedValue(animal);

      const result = await resolver.updateAnimal('animal-1', input);

      expect(result).toEqual(animal);

      expect(animalsServiceMock.update).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.update).toHaveBeenCalledWith('animal-1', input);
    });
  });

  describe('deleteAnimal', () => {
    it('should delete an animal', async () => {
      animalsServiceMock.remove.mockResolvedValue(
        'Animal removed successfully',
      );

      const result = await resolver.deleteAnimal('animal-1');

      expect(result).toBe('Animal removed successfully');

      expect(animalsServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(animalsServiceMock.remove).toHaveBeenCalledWith('animal-1');
    });
  });

  describe('images', () => {
    it('should return images with their storage urls', async () => {
      const animal = {
        images: [
          {
            id: 'image-1',
            file: {
              id: 'file-1',
              storageKey: 'files/image-1.jpg',
            },
            isPrimary: true,
          },
          {
            id: 'image-2',
            file: {
              id: 'file-2',
              storageKey: 'files/image-2.jpg',
            },
            isPrimary: false,
          },
        ],
      } as Animal;

      filesServiceMock.getUrl
        .mockResolvedValueOnce('/uploads/image-1.jpg')
        .mockResolvedValueOnce('/uploads/image-2.jpg');

      const result = await resolver.images(animal);

      expect(result).toEqual([
        {
          id: 'image-1',
          file: animal.images[0].file,
          isPrimary: true,
          url: '/uploads/image-1.jpg',
        },
        {
          id: 'image-2',
          file: animal.images[1].file,
          isPrimary: false,
          url: '/uploads/image-2.jpg',
        },
      ]);

      expect(filesServiceMock.getUrl).toHaveBeenCalledTimes(2);

      expect(filesServiceMock.getUrl).toHaveBeenNthCalledWith(
        1,
        animal.images[0].file,
      );

      expect(filesServiceMock.getUrl).toHaveBeenNthCalledWith(
        2,
        animal.images[1].file,
      );
    });
  });
});
