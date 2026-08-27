import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { AuthInputDTO } from './dto/auth.input.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: AuthInputDTO): Promise<AuthDTO> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersService.findById(userId);
  }
}
