import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  description: string;
  code: string;
  image: string;
  thumbnails: string[];
  brand: string;
  discountType: string | null;
  category: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: "Watches",
      price: 42.00,
      originalPrice: 65.00,
      rating: 5,
      description: "Sleek, modern white wrist watch. High quality silicone strap with digital and analog displays. Perfect for everyday wear.",
      code: "Y523201",
      image: "/assets/products/watches.jpg",
      thumbnails: [
        "/assets/products/watches.jpg",
        "/assets/products/black-watches.jpg",
        "/assets/products/headphones-thumb-1.jpg"
      ],
      brand: "Casio",
      discountType: "25% Discount Offer",
      category: "Watches",
      tags: ["Featured", "Trending", "Special Offer", "New Arrival"]
    },
    {
      id: 2,
      name: "Headphones",
      price: 90.00,
      originalPrice: 99.00,
      rating: 4,
      description: "Active noise cancelling wireless over-ear headphones. Immersive studio sound quality, comfortable memory foam ear cups.",
      code: "Y523202",
      image: "/assets/products/headphones-detail.jpg",
      thumbnails: [
        "/assets/products/headphones-thumb-1.jpg",
        "/assets/products/headphones-thumb-2.jpg",
        "/assets/products/headphones-thumb-3.jpg"
      ],
      brand: "Apple",
      discountType: "20% Cashback",
      category: "Headphones",
      tags: ["Featured", "Trending", "Discount", "Best Seller"]
    },
    {
      id: 3,
      name: "Laptop",
      price: 89.00,
      originalPrice: 99.00,
      rating: 3,
      description: "Sleek and powerful ultra-slim laptop. Perfect for work, study, and creative entertainment with long-lasting battery life.",
      code: "Y523203",
      image: "/assets/products/laptop.jpg",
      thumbnails: [
        "/assets/products/laptop.jpg",
        "/assets/products/game-console.jpg",
        "/assets/products/present-box.jpg"
      ],
      brand: "Apple",
      discountType: "5% Cashback Offer",
      category: "Laptop",
      tags: ["Featured", "Trending", "Discount", "New Arrival"]
    },
    {
      id: 4,
      name: "Black watches",
      price: 35.00,
      originalPrice: 55.00,
      rating: 5,
      description: "Premium black leather strap minimalist watch. Elegant aesthetic design suitable for formal business or casual wear.",
      code: "Y523204",
      image: "/assets/products/black-watches.jpg",
      thumbnails: [
        "/assets/products/black-watches.jpg",
        "/assets/products/watches.jpg",
        "/assets/products/headphones-thumb-2.jpg"
      ],
      brand: "Casio",
      discountType: "25% Discount Offer",
      category: "Watches",
      tags: ["Featured", "Trending", "Special Offer"]
    },
    {
      id: 5,
      name: "Game console",
      price: 76.00,
      originalPrice: 89.00,
      rating: 4,
      description: "Next-gen entertainment console. Immersive gaming experiences with ultra-high speed SSD, ray tracing, and haptic feedback.",
      code: "Y523205",
      image: "/assets/products/game-console.jpg",
      thumbnails: [
        "/assets/products/game-console.jpg",
        "/assets/products/laptop.jpg",
        "/assets/products/headphones-detail.jpg"
      ],
      brand: "Sony",
      discountType: "20% Cashback",
      category: "Game Console",
      tags: ["Latest", "New Arrival", "Featured"]
    },
    {
      id: 6,
      name: "Shoes",
      price: 57.00,
      originalPrice: 75.00,
      rating: 4,
      description: "Extremely comfortable active lifestyle sneakers. Breathable mesh design, premium grip sole, and dynamic cushion support.",
      code: "Y523206",
      image: "/assets/products/shoes.jpg",
      thumbnails: [
        "/assets/products/shoes.jpg",
        "/assets/products/present-box.jpg",
        "/assets/products/bracelet.jpg"
      ],
      brand: "Nike",
      discountType: "5% Cashback Offer",
      category: "Clothe",
      tags: ["Latest", "Best Seller"]
    },
    {
      id: 7,
      name: "Perfume",
      price: 19.00,
      originalPrice: 29.00,
      rating: 5,
      description: "Elegant scent with base notes of amber, musk, and jasmine. Housed in a gorgeous minimalist glass bottle.",
      code: "Y523207",
      image: "/assets/products/perfume.jpg",
      thumbnails: [
        "/assets/products/perfume.jpg",
        "/assets/products/bracelet.jpg",
        "/assets/products/present-box.jpg"
      ],
      brand: "Vxe",
      discountType: "25% Discount Offer",
      category: "Perfume",
      tags: ["Latest", "Top Categories", "Special Offer"]
    },
    {
      id: 8,
      name: "Present box",
      price: 12.00,
      originalPrice: 29.00,
      rating: 4,
      description: "Hexagonal present box in premium cardboard material. Perfect for gift packing and custom styling of special gestures.",
      code: "Y523208",
      image: "/assets/products/present-box.jpg",
      thumbnails: [
        "/assets/products/present-box.jpg",
        "/assets/products/perfume.jpg",
        "/assets/products/bracelet.jpg"
      ],
      brand: "Glossiness",
      discountType: null,
      category: "Clothe",
      tags: ["Latest", "Top Categories", "Featured"]
    },
    {
      id: 9,
      name: "Bracelet",
      price: 67.00,
      originalPrice: 76.00,
      rating: 3,
      description: "Delicate and beautiful gold chain bracelet. Embellished with subtle design elements to complete your daily fashion.",
      code: "Y523209",
      image: "/assets/products/bracelet.jpg",
      thumbnails: [
        "/assets/products/bracelet.jpg",
        "/assets/products/ring.jpg",
        "/assets/products/perfume.jpg"
      ],
      brand: "Vxe",
      discountType: "20% Cashback",
      category: "Jewellery",
      tags: ["Latest", "Top Categories", "Best Seller"]
    },
    {
      id: 10,
      name: "Ring",
      price: 56.00,
      originalPrice: 65.00,
      rating: 5,
      description: "Elegant white gold diamond ring. Standard clarity and excellent cut, perfect for engagement and special milestones.",
      code: "Y523210",
      image: "/assets/products/ring.jpg",
      thumbnails: [
        "/assets/products/ring.jpg",
        "/assets/products/bracelet.jpg",
        "/assets/products/perfume.jpg"
      ],
      brand: "Glossiness",
      discountType: null,
      category: "Jewellery",
      tags: ["Latest", "Top Categories", "Featured"]
    }
  ];

  constructor() { }

  getProducts(simulateDelay: boolean = false): Observable<Product[]> {
    if (simulateDelay) {
      return of(this.products).pipe(delay(800));
    }
    return of(this.products);
  }

  getProductById(id: number, simulateDelay: boolean = false): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    if (simulateDelay) {
      return of(product).pipe(delay(500));
    }
    return of(product);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(this.products.filter(p => p.tags.includes("Featured")));
  }

  getLatestProducts(tab: string): Observable<Product[]> {
    // Tabs map: 'New Arrival', 'Best Seller', 'Featured', 'Special Offer'
    if (tab === 'New Arrival') {
      return of(this.products.filter(p => p.tags.includes("New Arrival")));
    } else if (tab === 'Best Seller') {
      return of(this.products.filter(p => p.tags.includes("Best Seller")));
    } else if (tab === 'Featured') {
      return of(this.products.filter(p => p.tags.includes("Featured")));
    } else if (tab === 'Special Offer') {
      return of(this.products.filter(p => p.tags.includes("Special Offer")));
    }
    return of(this.products);
  }

  getTrendingProducts(): Observable<Product[]> {
    return of(this.products.filter(p => p.tags.includes("Trending")));
  }

  getTopCategories(): Observable<Product[]> {
    return of(this.products.filter(p => p.tags.includes("Top Categories")));
  }
}
