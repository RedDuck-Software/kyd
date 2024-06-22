import { EntityManager } from 'typeorm';
import { NftMetadataEntity } from '../entities/nft-metadata.entity';

export const getNftMetadataRepository = (manager: EntityManager) => {
  return manager.getRepository(NftMetadataEntity).extend({
    async getAll() {
      return this.find();
    },
  });
};
