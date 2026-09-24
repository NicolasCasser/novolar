import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DataBaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { AdoptionRequestsModule } from './modules/adoption-requests/adoption-requests.module';
import { AuthModule } from './modules/auth/auth.module';
import { Request, Response } from 'express';
import { FilesModule } from './modules/files/files.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    DataBaseModule,
    UsersModule,
    AnimalsModule,
    AdoptionRequestsModule,
    AuthModule,
    FilesModule,
    LocationsModule,
  ],
  providers: [],
})
export class AppModule {}
