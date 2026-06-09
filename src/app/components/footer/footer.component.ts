import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  subscribeEmail: string = '';

  constructor(private notificationService: NotificationService) {}

  onSubscribe(email: string): void {
    if (email.trim()) {
      this.notificationService.show(`Thanks for subscribing, ${email}`);
    }
  }
}
