import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AdoptionRequestsResolver } from './adoption-requests.resolver';
import { AdoptionRequestsService } from './adoption-requests.service';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';

import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

describe('AdoptionRequestsResolver', () => {
  let resolver: AdoptionRequestsResolver;

  const adoptionRequestsServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    startAnalysis: jest.fn(),
    reject: jest.fn(),
    approve: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptionRequestsResolver,
        {
          provide: AdoptionRequestsService,
          useValue: adoptionRequestsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AdoptionRequestsResolver>(AdoptionRequestsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('adoptionRequests', () => {
    it('should return the adoption requests list', async () => {
      const adoptionRequestsResponse = {
        items: [
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
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      };

      adoptionRequestsServiceMock.findAll.mockResolvedValue(
        adoptionRequestsResponse,
      );

      const result = await resolver.adoptionRequests();

      expect(result).toEqual(adoptionRequestsResponse);

      expect(adoptionRequestsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.findAll).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should pass the filter to the service', async () => {
      const filter = {
        search: 'Rex',
        status: AdoptionRequestStatus.IN_ANALYSIS,
        animalId: 'animal-id',
        state: BrazilianState.RS,
        city: 'Pelotas',
        page: 1,
        limit: 10,
      };

      const adoptionRequestsResponse = {
        items: [
          {
            id: 'request-1',
            applicantName: 'João',
            status: AdoptionRequestStatus.IN_ANALYSIS,
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      adoptionRequestsServiceMock.findAll.mockResolvedValue(
        adoptionRequestsResponse,
      );

      const result = await resolver.adoptionRequests(filter);

      expect(result).toEqual(adoptionRequestsResponse);

      expect(adoptionRequestsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('adoptionRequest', () => {
    it('should return an adoption request by id', async () => {
      const adoptionRequest = {
        id: 'request-1',
        applicantName: 'João',
        status: AdoptionRequestStatus.PENDING,
      };

      adoptionRequestsServiceMock.findById.mockResolvedValue(adoptionRequest);

      const result = await resolver.adoptionRequest('request-1');

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.findById).toHaveBeenCalledWith(
        'request-1',
      );
    });

    it('should throw when the adoption request is not found', async () => {
      adoptionRequestsServiceMock.findById.mockRejectedValue(
        new NotFoundException('Adoption request not found'),
      );

      await expect(resolver.adoptionRequest('request-1')).rejects.toThrow(
        'Adoption request not found',
      );

      expect(adoptionRequestsServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.findById).toHaveBeenCalledWith(
        'request-1',
      );
    });
  });

  describe('createAdoptionRequest', () => {
    it('should create an adoption request', async () => {
      const input = {
        animalId: 'animal-id',
        applicantName: 'João',
        applicantEmail: 'joao@example.com',
        applicantPhone: '+5554999999999',
        state: BrazilianState.RS,
        city: 'Pelotas',
        message: 'Tenho interesse na adoção.',
      };

      const adoptionRequest = {
        id: 'request-id',
        ...input,
        status: AdoptionRequestStatus.PENDING,
      };

      adoptionRequestsServiceMock.create.mockResolvedValue(adoptionRequest);

      const result = await resolver.createAdoptionRequest(input);

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsServiceMock.create).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.create).toHaveBeenCalledWith(input);
    });
  });

  describe('startAdoptionRequestAnalysis', () => {
    it('should move an adoption request to analysis', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.IN_ANALYSIS,
      };

      adoptionRequestsServiceMock.startAnalysis.mockResolvedValue(
        adoptionRequest,
      );

      const result = await resolver.startAdoptionRequestAnalysis('request-id');

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsServiceMock.startAnalysis).toHaveBeenCalledTimes(
        1,
      );

      expect(adoptionRequestsServiceMock.startAnalysis).toHaveBeenCalledWith(
        'request-id',
      );
    });
  });

  describe('rejectAdoptionRequest', () => {
    it('should reject an adoption request', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.REJECTED,
      };

      adoptionRequestsServiceMock.reject.mockResolvedValue(adoptionRequest);

      const result = await resolver.rejectAdoptionRequest('request-id');

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsServiceMock.reject).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.reject).toHaveBeenCalledWith(
        'request-id',
      );
    });
  });

  describe('approveAdoptionRequest', () => {
    it('should approve an adoption request', async () => {
      const adoptionRequest = {
        id: 'request-id',
        status: AdoptionRequestStatus.APPROVED,
      };

      adoptionRequestsServiceMock.approve.mockResolvedValue(adoptionRequest);

      const result = await resolver.approveAdoptionRequest('request-id');

      expect(result).toEqual(adoptionRequest);

      expect(adoptionRequestsServiceMock.approve).toHaveBeenCalledTimes(1);
      expect(adoptionRequestsServiceMock.approve).toHaveBeenCalledWith(
        'request-id',
      );
    });
  });
});
