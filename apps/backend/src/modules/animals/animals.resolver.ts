import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

import { CreateAnimalInputDTO } from './dto/create-animal.input';
import { UpdateAnimalInputDTO } from './dto/update-animal.input';
import { AnimalDTO } from './dto/animal.dto';
import { AnimalImageDTO } from './dto/animal-image.dto';
import { AnimalsFilterInputDTO } from './dto/animals-filter.input';
import { AnimalsResponseDTO } from './dto/animals-response.dto';

import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { FilesService } from '../files/files.service';

@Resolver(() => AnimalDTO)
export class AnimalsResolver {
  constructor(
    private readonly animalsService: AnimalsService,
    private readonly filesService: FilesService,
  ) {}

  @Query(() => AnimalsResponseDTO)
  async animals(
    @Args('filter', { nullable: true }) filter?: AnimalsFilterInputDTO,
  ): Promise<AnimalsResponseDTO> {
    return this.animalsService.findAll(filter);
  }

  @Query(() => AnimalDTO)
  async animal(@Args('id') id: string): Promise<Animal> {
    return this.animalsService.findById(id);
  }

  @ResolveField(() => [AnimalImageDTO])
  async images(@Parent() animal: Animal): Promise<AnimalImageDTO[]> {
    return Promise.all(
      animal.images.map(async (image) => ({
        ...image,
        url: await this.filesService.getUrl(image.file),
      })),
    );
  }

  @Mutation(() => AnimalDTO)
  @UseGuards(JwtAuthGuard)
  async createAnimal(
    @Args('input') input: CreateAnimalInputDTO,
    @CurrentUser() user: User,
  ): Promise<Animal> {
    return this.animalsService.create(input, user.id);
  }

  @Mutation(() => AnimalDTO)
  @UseGuards(JwtAuthGuard)
  async updateAnimal(
    @Args('id') id: string,
    @Args('input') input: UpdateAnimalInputDTO,
  ): Promise<Animal> {
    return this.animalsService.update(id, input);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async deleteAnimal(@Args('id') id: string): Promise<string> {
    return this.animalsService.remove(id);
  }
}
