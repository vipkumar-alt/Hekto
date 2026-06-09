import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductService } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'hekto-cart-items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private productService: ProductService) {
    this.initializeCart();
  }

  private initializeCart(): void {
    const savedItems = this.readSavedItems();

    this.productService.getProducts().subscribe(products => {
      if (savedItems) {
        const restoredItems = savedItems
          .map(savedItem => {
            const product = products.find(p => p.id === savedItem.productId);
            return product ? { product, quantity: savedItem.quantity } : null;
          })
          .filter((item): item is CartItem => item !== null);

        this.cartItemsSubject.next(restoredItems);
        return;
      }

      const initialItems = this.createDemoCart(products);
      this.setCartItems(initialItems);
    });
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.getCartItems()];
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.setCartItems(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    let currentItems = [...this.getCartItems()];
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex].quantity = quantity;
      }
      this.setCartItems(currentItems);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.getCartItems().filter(item => item.product.id !== productId);
    this.setCartItems(currentItems);
  }

  clearCart(): void {
    this.setCartItems([]);
  }

  getSubtotal(): number {
    return this.getCartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getShippingCost(): number {
    const items = this.getCartItems();
    return items.length > 0 ? 150.00 : 0.00; // Flat shipping cost matching screenshot
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  getTotalItemsCount(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  private createDemoCart(products: Product[]): CartItem[] {
    const demoQuantities = new Map<number, number>([
      [1, 1],
      [2, 2],
      [6, 4]
    ]);

    return products
      .filter(product => demoQuantities.has(product.id))
      .map(product => ({
        product,
        quantity: demoQuantities.get(product.id) ?? 1
      }));
  }

  private setCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.persistItems(items);
  }

  private readSavedItems(): Array<{ productId: number; quantity: number }> | null {
    try {
      const raw = localStorage.getItem(this.storageKey);

      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return null;
      }

      return parsed
        .map(item => {
          if (typeof item !== 'object' || item === null) {
            return null;
          }

          const savedItem = item as { productId?: unknown; quantity?: unknown };
          const productId = Number(savedItem.productId);
          const quantity = Number(savedItem.quantity);
          return Number.isFinite(productId) && Number.isFinite(quantity) && quantity > 0
            ? { productId, quantity }
            : null;
        })
        .filter((item): item is { productId: number; quantity: number } => item !== null);
    } catch {
      return null;
    }
  }

  private persistItems(items: CartItem[]): void {
    try {
      const payload = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // Cart persistence is a convenience; in-memory state still keeps the app usable.
    }
  }
}
