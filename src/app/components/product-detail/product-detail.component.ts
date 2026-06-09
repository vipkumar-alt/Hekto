import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  selectedImage: string = '';
  activeTab: string = 'description';
  loading: boolean = true;

  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadProductDetails(id);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    this.productService.getProductById(id, true).subscribe(product => {
      this.product = product;
      if (product) {
        this.selectedImage = product.image;
        this.loadRelatedProducts(product);
      }
      this.loading = false;
    });
  }

  loadRelatedProducts(currentProduct: Product): void {
    this.productService.getProducts().subscribe(products => {
      // Find products in same category, excluding current product
      const filtered = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
      
      if (filtered.length > 0) {
        this.relatedProducts = filtered.slice(0, 4);
      } else {
        // Fallback to general products
        this.relatedProducts = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
      }
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.notificationService.show(`${this.product.name} added to cart`);
    }
  }

  addToWishlist(): void {
    if (this.product) {
      this.notificationService.show(`${this.product.name} added to wishlist`);
    }
  }
}
