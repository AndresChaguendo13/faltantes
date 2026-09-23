import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  NotificationService,
  NotificationData
} from '../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.css'
})
export class NotificationModalComponent implements OnInit, OnDestroy {

  notification: NotificationData = {
    visible: false,
    type: 'info',
    title: '',
    message: ''
  };

  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.notificationService.notification$
        .subscribe(data => {

          this.notification = data;

          // Forzar actualización visual del modal
          this.cdr.detectChanges();

        });
  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

  cerrar(): void {

    this.notificationService.close();

    this.cdr.detectChanges();

  }

}
