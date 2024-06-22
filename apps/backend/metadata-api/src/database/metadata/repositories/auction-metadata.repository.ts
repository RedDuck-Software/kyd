import { EntityManager } from 'typeorm';
import { AuctionMetadataEntity } from '../entities';

export const getAuctionMetadataRepository = (manager: EntityManager) => {
  return manager.getRepository(AuctionMetadataEntity).extend({
    async getAll() {
      return this.find();
    },
  });
};
