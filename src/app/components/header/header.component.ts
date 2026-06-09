import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  wishlistCount: number = 0; // Mock wishlist count

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getTotalItemsCount();
    });
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }
}
