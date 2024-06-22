import { EntityManager } from 'typeorm';
import { FileEntity } from '../entities';

export const getFileRepository = (manager: EntityManager) => {
  return manager.getRepository(FileEntity).extend({
    async getAll() {
      return this.find();
    },
  });
};
