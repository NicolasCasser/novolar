import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthInputDTO } from './dto/auth.input.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  health(): string {
    return 'OK';
  }

  @Mutation(() => AuthDTO)
  async login(@Args('input') input: AuthInputDTO): Promise<AuthDTO> {
    return this.authService.login(input);
  }
}
