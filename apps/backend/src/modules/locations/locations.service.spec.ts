import { Test, TestingModule } from '@nestjs/testing';

import { LocationsService } from './locations.service';
import { LOCATIONS_PROVIDER } from './providers/locations.providers';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

describe('LocationsService', () => {
  let service: LocationsService;

  const locationsProviderMock = {
    validateCity: jest.fn(),
    getCities: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: LOCATIONS_PROVIDER,
          useValue: locationsProviderMock,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCity', () => {
    it('should return true when the city belongs to the state', async () => {
      locationsProviderMock.validateCity.mockResolvedValue(true);

      const result = await service.validateCity(BrazilianState.RS, 'Pelotas');

      expect(result).toBe(true);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledTimes(1);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledWith(
        BrazilianState.RS,
        'Pelotas',
      );
    });

    it('should return false when the city does not belong to the state', async () => {
      locationsProviderMock.validateCity.mockResolvedValue(false);

      const result = await service.validateCity(BrazilianState.RS, 'São Paulo');

      expect(result).toBe(false);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledTimes(1);

      expect(locationsProviderMock.validateCity).toHaveBeenCalledWith(
        BrazilianState.RS,
        'São Paulo',
      );
    });
  });

  describe('getCities', () => {
    it('should return the cities for the state', async () => {
      const cities = ['Pelotas', 'Porto Alegre', 'Rio Grande'];

      locationsProviderMock.getCities.mockResolvedValue(cities);

      const result = await service.getCities(BrazilianState.RS);

      expect(result).toEqual(cities);

      expect(locationsProviderMock.getCities).toHaveBeenCalledTimes(1);

      expect(locationsProviderMock.getCities).toHaveBeenCalledWith(
        BrazilianState.RS,
      );
    });
  });
});
