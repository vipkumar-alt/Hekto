import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  total: number = 0;
  showCheckoutModal: boolean = false;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateTotals();
    });
  }

  updateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shipping = this.cartService.getShippingCost();
    this.total = this.cartService.getTotal();
  }

  incrementQuantity(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrementQuantity(productId: number, currentQty: number): void {
    if (currentQty <= 1) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, currentQty - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.notificationService.show('Item removed from cart');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.notificationService.show('Cart cleared');
  }

  openCheckoutModal(): void {
    if (this.cartItems.length > 0) {
      this.showCheckoutModal = true;
    }
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
  }

  confirmCheckout(): void {
    this.showCheckoutModal = false;
    this.cartService.clearCart(); // Empties the cart
    this.notificationService.show('Order placed successfully');
  }
}
