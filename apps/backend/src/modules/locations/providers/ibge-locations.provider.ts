import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationsProvider } from './locations.providers';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

interface IbgeCity {
  nome: string;
}

@Injectable()
export class IbgeLocationsProvider implements LocationsProvider {
  async validateCity(state: BrazilianState, city: string): Promise<boolean> {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`,
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to validate city');
    }

    const cities = (await response.json()) as IbgeCity[];

    return cities.some((ibgeCity) => ibgeCity.nome === city);
  }

  async getCities(state: BrazilianState): Promise<string[]> {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`,
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to get cities');
    }

    const cities = (await response.json()) as IbgeCity[];

    return cities.map((city) => city.nome);
  }
}
