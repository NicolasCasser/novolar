import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateAdoptionRequestInputDTO } from './dto/create-adoption-request.input';
import { AdoptionRequestDTO } from './dto/adoption-request.dto';
import { AnimalDTO } from 'src/modules/animals/dto/animal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdoptionRequestsListResult } from './dto/adoption-requests-list-result';
import { AdoptionRequestsFilterInputDTO } from './dto/adoption-requests-filter.input';

@Resolver(() => AdoptionRequestDTO)
export class AdoptionRequestsResolver {
  constructor(
    private readonly adoptionRequestsService: AdoptionRequestsService,
  ) {}

  @ResolveField(() => AnimalDTO)
  animal(
    @Parent() adoptionRequest: AdoptionRequest,
  ): AdoptionRequest['animal'] {
    return adoptionRequest.animal;
  }

  @Mutation(() => AdoptionRequestDTO)
  createAdoptionRequest(
    @Args('input') input: CreateAdoptionRequestInputDTO,
  ): Promise<AdoptionRequestDTO> {
    return this.adoptionRequestsService.create(input);
  }

  @Mutation(() => AdoptionRequestDTO)
  @UseGuards(JwtAuthGuard)
  async startAdoptionRequestAnalysis(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AdoptionRequestDTO> {
    return this.adoptionRequestsService.startAnalysis(id);
  }

  @Mutation(() => AdoptionRequestDTO)
  @UseGuards(JwtAuthGuard)
  async rejectAdoptionRequest(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AdoptionRequestDTO> {
    return this.adoptionRequestsService.reject(id);
  }

  @Mutation(() => AdoptionRequestDTO)
  @UseGuards(JwtAuthGuard)
  async approveAdoptionRequest(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AdoptionRequestDTO> {
    return this.adoptionRequestsService.approve(id);
  }

  @Query(() => AdoptionRequestsListResult)
  @UseGuards(JwtAuthGuard)
  async adoptionRequests(
    @Args('filter', {
      type: () => AdoptionRequestsFilterInputDTO,
      nullable: true,
    })
    filter?: AdoptionRequestsFilterInputDTO,
  ): Promise<AdoptionRequestsListResult> {
    return this.adoptionRequestsService.findAll(filter);
  }

  @Query(() => AdoptionRequestDTO)
  @UseGuards(JwtAuthGuard)
  adoptionRequest(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AdoptionRequestDTO> {
    return this.adoptionRequestsService.findById(id);
  }
}
