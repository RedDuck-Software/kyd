import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { getDataSourceOptions, readEnv } from '../common';
import { AuctionMetadataEntity, FileEntity, NftMetadataEntity } from './entities';

export const defaultDataSource = getDataSourceOptions(readEnv, (readEnv) => ({
  entities: [AuctionMetadataEntity, NftMetadataEntity, FileEntity],
  migrations: readEnv('RUN_MIGRATION') ? ['**/migrations/*.{ts,js}'] : undefined,
  migrationsRun: false,
  synchronize: readEnv('IS_DEV') === 'true',
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    acquireTimeoutMillis: 30000, // Time to wait to acquire a connection before timing out
  },
  extra: {
    cli: {
      migrationsDir: 'apps/backend/metadata-api/src/database/metadata/migrations',
    },
  },
  ...(readEnv('DB_SSL') === 'true' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
}));

export const dataSource = new DataSource(defaultDataSource);
