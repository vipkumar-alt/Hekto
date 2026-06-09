import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

interface BlogPost {
  id: number;
  author: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  featuredProducts: Product[] = [];
  latestProducts: Product[] = [];
  trendingProducts: Product[] = [];
  discountProduct: Product | null = null;
  topCategories: Product[] = [];

  activeLatestTab: string = 'New Arrival';
  activeDiscountTab: string = 'Headphones';

  // Sofa Product representing the "Unique Features" armchair
  sofaProduct: Product = {
    id: 11,
    name: "B&B Italian Sofa",
    price: 32.00,
    originalPrice: 48.00,
    rating: 5,
    description: "Premium Italian upholstered armchair in a beautiful sky blue color. Perfect statement piece for modern living rooms.",
    code: "S523211",
    image: "/assets/home/sofa.jpg",
    thumbnails: ["/assets/home/sofa.jpg"],
    brand: "Nike",
    discountType: null,
    category: "Clothe",
    tags: []
  };

  blogs: BlogPost[] = [
    {
      id: 1,
      author: "SaberAli",
      date: "21 May, 2026",
      title: "Top essential Trends in 2026",
      excerpt: "More off this less hello samland say cute tip. In all wood design elements we find...",
      image: "/assets/home/blog-1.jpg"
    },
    {
      id: 2,
      author: "Surfux",
      date: "21 May, 2026",
      title: "Top essential Trends in 2026",
      excerpt: "More off this less hello samland say cute tip. In all wood design elements we find...",
      image: "/assets/home/blog-2.jpg"
    },
    {
      id: 3,
      author: "SaberAli",
      date: "21 May, 2026",
      title: "Top essential Trends in 2026",
      excerpt: "More off this less hello samland say cute tip. In all wood design elements we find...",
      image: "/assets/home/blog-3.jpg"
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);
    });

    this.loadLatestProducts(this.activeLatestTab);

    this.productService.getTrendingProducts().subscribe(products => {
      this.trendingProducts = products.slice(0, 4);
    });

    this.loadDiscountProduct(this.activeDiscountTab);

    this.productService.getTopCategories().subscribe(products => {
      this.topCategories = products.slice(0, 4);
    });
  }

  loadLatestProducts(tab: string) {
    this.activeLatestTab = tab;
    this.productService.getLatestProducts(tab).subscribe(products => {
      this.latestProducts = products.slice(0, 6);
    });
  }

  loadDiscountProduct(category: string) {
    this.activeDiscountTab = category;
    this.productService.getProducts().subscribe(products => {
      const match = products.find(p => p.category.toLowerCase() === category.toLowerCase());
      this.discountProduct = match || products[0]; // fallback
    });
  }

  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.cartService.addToCart(product);
    this.notificationService.show(`${product.name} added to cart`);
  }

  addToWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.show(`${product.name} added to wishlist`);
  }
}
