import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationModalComponent }
  from './shared/components/notification-modal/notification-modal';

import { ProductLookupModalComponent }
  from './shared/components/product-lookup-modal/product-lookup-modal';

import { GlobalScannerService }
  from './shared/services/global-scanner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NotificationModalComponent,
    ProductLookupModalComponent
  ],
  templateUrl: './app.html'
})
export class App {

  constructor(
    private globalScanner: GlobalScannerService
  ) {}

}
