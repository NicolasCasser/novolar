import { Animal } from '../entities/animal.entity';

export interface AnimalsListResult {
  items: Animal[];
  total: number;
  page: number;
  totalPages: number;
}
