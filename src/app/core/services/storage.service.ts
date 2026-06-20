import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage!: Storage;

  constructor(private ionicStorage: Storage) {}

  async init(): Promise<void> {
    this.storage = await this.ionicStorage.create();
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.storage.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.storage.get(key);
  }
}
