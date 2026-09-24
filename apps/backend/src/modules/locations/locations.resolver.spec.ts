import { Test, TestingModule } from '@nestjs/testing';

import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

describe('LocationsResolver', () => {
  let resolver: LocationsResolver;

  const locationsServiceMock = {
    getCities: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsResolver,
        {
          provide: LocationsService,
          useValue: locationsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<LocationsResolver>(LocationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('cities', () => {
    it('should return the cities for the state', async () => {
      const cities = ['Pelotas', 'Porto Alegre', 'Rio Grande'];

      locationsServiceMock.getCities.mockResolvedValue(cities);

      const result = await resolver.cities(BrazilianState.RS);

      expect(result).toEqual(cities);

      expect(locationsServiceMock.getCities).toHaveBeenCalledTimes(1);

      expect(locationsServiceMock.getCities).toHaveBeenCalledWith(
        BrazilianState.RS,
      );
    });
  });
});
