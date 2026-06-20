import { Injectable, inject } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  private remoteConfig = inject(RemoteConfig);

  async initialize(): Promise<void> {
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 60000
    };

    this.remoteConfig.defaultConfig = {
      enableCategories: false
    };

    await fetchAndActivate(this.remoteConfig);
  }

  get enableCategories(): boolean {
    return getValue(this.remoteConfig, 'enableCategories').asBoolean();
  }
}
