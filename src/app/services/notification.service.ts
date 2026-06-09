import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly messageSubject = new BehaviorSubject<string>('');
  readonly message$ = this.messageSubject.asObservable();
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    this.messageSubject.next(message);

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.hideTimer = setTimeout(() => {
      this.clear();
    }, 2600);
  }

  clear(): void {
    this.messageSubject.next('');
    this.hideTimer = null;
  }
}
