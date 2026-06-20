import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './core/services/storage.service';
import { RemoteConfigService } from './core/services/remote-config';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private readonly storageService: StorageService,
     private readonly remoteConfigService: RemoteConfigService) {
    this.storageService.init();
    this.init();
  }

  private async init(): Promise<void> {
    await this.remoteConfigService.initialize();
  }
}
