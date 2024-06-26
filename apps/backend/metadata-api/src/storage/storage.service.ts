import { Inject, Injectable } from '@nestjs/common';
import { StorageModuleConfig } from './storage.module-definition';
import { Akord, Auth } from '@akord/akord-js';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_CONFIG')
    public readonly config: StorageModuleConfig
  ) {}

  async getClient(): Promise<Akord> {
    const { wallet } = await Auth.signIn(this.config.email, this.config.password);
    return new Akord(wallet);
  }

  async writeFile({ content, id, extension }: { content: Buffer; id: string; extension: string }) {
    const akord = await this.getClient();

    const vaults = await akord.vault.listAll();

    let vaultId: string;

    if (vaults.length === 0) {
      vaultId = (await akord.vault.create('GC Service Vault', { public: true })).vaultId;
    } else {
      vaultId = vaults[0].id;
    }

    const { stackId, uri } = await akord.stack.create(vaultId, content, {
      public: true,
      name: `${id}.${extension}`,
    });

    return { externalId: stackId, uri };
  }

  async getUri(stackId: string): Promise<string> {
    const akord = await this.getClient();

    return akord.stack.getUri(stackId);
  }
}
