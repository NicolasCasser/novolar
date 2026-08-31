import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthInputDTO } from './dto/auth.input.dto';
import { UserDTO } from '../users/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

interface GraphQLContext {
  res: Response;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  health(): string {
    return 'OK';
  }

  @Query(() => UserDTO)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }

  @Mutation(() => AuthDTO)
  async login(
    @Args('input') input: AuthInputDTO,
    @Context() context: GraphQLContext,
  ): Promise<AuthDTO> {
    const user = await this.authService.login(input);

    const accessToken = this.authService.generateAccessToken(user);

    context.res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  @Mutation(() => Boolean)
  logout(@Context() context: GraphQLContext): boolean {
    context.res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return true;
  }
}
