import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DataBaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { AdoptionRequestsModule } from './modules/adoption-requests/adoption-requests.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    DataBaseModule,
    UsersModule,
    AnimalsModule,
    AdoptionRequestsModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
