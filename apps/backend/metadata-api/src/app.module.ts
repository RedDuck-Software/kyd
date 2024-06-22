import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'node:path';
import { DatabaseModule } from './database/common';
import { defaultDataSource } from './database/metadata';
import { NftMetadataModule } from './nft-metadata/nft-metadata.module';
import { AuctionMetadataModule } from './auction-metadata/auction-metadata.module';
import { StorageModule } from './storage';

class GlobalProviders {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: GlobalProviders,
      providers: [
        {
          provide: Logger,
          useValue: new Logger(),
        },
      ],
    };
  }
}

@Module({
  imports: [
    GlobalProviders.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env', path.resolve('../../../../.env')],
    }),
    DatabaseModule.forRootAsync({
      global: true,
      useFactory: async () => {
        return {
          options: () => defaultDataSource,
        };
      },
    }),
    StorageModule.forRootAsync({
      global: true,
    }),
    NftMetadataModule,
    AuctionMetadataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
