import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DataBaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthResolver } from './health/health.resolver';
import { UsersModule } from './modules/users/users.module';

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
    }),

    DataBaseModule,
    UsersModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
