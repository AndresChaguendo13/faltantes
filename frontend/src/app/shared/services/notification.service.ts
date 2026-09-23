import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  visible: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new BehaviorSubject<NotificationData>({
    visible: false,
    type: 'info',
    title: '',
    message: ''
  });

  notification$ = this.notificationSubject.asObservable();

  success(message: string, title: string = 'Operación exitosa') {
    this.show('success', title, message);
  }

  error(message: string, title: string = 'Ocurrió un error') {
    this.show('error', title, message);
  }

  warning(message: string, title: string = 'Advertencia') {
    this.show('warning', title, message);
  }

  info(message: string, title: string = 'Información') {
    this.show('info', title, message);
  }

  private show(
    type: NotificationType,
    title: string,
    message: string
  ) {
    this.notificationSubject.next({
      visible: true,
      type,
      title,
      message
    });
  }

  close() {
    this.notificationSubject.next({
      visible: false,
      type: 'info',
      title: '',
      message: ''
    });
  }
}
