import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationModalComponent } from './shared/components/notification-modal/notification-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'

})
export class App {
}
