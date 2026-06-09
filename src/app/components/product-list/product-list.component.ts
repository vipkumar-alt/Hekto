import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  loading: boolean = true;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'price-low-high';
  searchQuery: string = '';
  currentPage: number = 1;
  perPage: number = 10;
  pageOptions = [6, 9, 10, 20];

  // Filter lists
  brands = ['Casio', 'Apple', 'Sony', 'Nike', 'Vxe', 'Glossiness'];
  categories = ['Watches', 'Headphones', 'Laptop', 'Game Console', 'Clothe', 'Jewellery', 'Perfume'];
  discounts = ['20% Cashback', '5% Cashback Offer', '25% Discount Offer'];
  prices = [
    { label: '$0 - $150', min: 0, max: 150 },
    { label: '$150 - $350', min: 150, max: 350 },
    { label: '$350 - $500', min: 350, max: 500 },
    { label: '$500 - $800', min: 500, max: 800 },
    { label: '$800+', min: 800, max: 99999 }
  ];

  // Active filter selections
  selectedBrands: string[] = [];
  selectedCategories: string[] = [];
  selectedDiscounts: string[] = [];
  selectedPriceRanges: { min: number, max: number }[] = [];
  selectedRating: number | null = null;

  private querySubscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      
      // If category is passed in route query parameter
      const catParam = params['category'];
      if (catParam) {
        this.selectedCategories = [catParam];
      }

      const viewParam = params['view'];
      if (viewParam === 'grid' || viewParam === 'list') {
        this.viewMode = viewParam;
      }

      const perPageParam = Number(params['perPage']);
      if (this.pageOptions.includes(perPageParam)) {
        this.perPage = perPageParam;
      }

      this.fetchProducts();
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts(true).subscribe(products => {
      this.allProducts = products;
      this.applyFiltersAndSorting(true);
      this.loading = false;
    });
  }

  applyFiltersAndSorting(resetPage: boolean = false): void {
    let filtered = [...this.allProducts];

    // Search query filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p => this.selectedBrands.includes(p.brand));
    }

    // Category filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => this.selectedCategories.includes(p.category));
    }

    // Discount filter
    if (this.selectedDiscounts.length > 0) {
      filtered = filtered.filter(p => p.discountType && this.selectedDiscounts.includes(p.discountType));
    }

    // Price range filter
    if (this.selectedPriceRanges.length > 0) {
      filtered = filtered.filter(p => {
        return this.selectedPriceRanges.some(range => p.price >= range.min && p.price <= range.max);
      });
    }

    // Rating filter
    if (this.selectedRating !== null) {
      filtered = filtered.filter(p => p.rating >= (this.selectedRating || 0));
    }

    // Sorting
    if (this.sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    this.filteredProducts = filtered;

    if (resetPage || this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.updatePagedProducts();
  }

  // Handle checkboxes
  toggleBrand(brand: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
    this.applyFiltersAndSorting(true);
  }

  toggleCategory(category: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.applyFiltersAndSorting(true);
  }

  toggleDiscount(discount: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedDiscounts.push(discount);
    } else {
      this.selectedDiscounts = this.selectedDiscounts.filter(d => d !== discount);
    }
    this.applyFiltersAndSorting(true);
  }

  togglePriceRange(min: number, max: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedPriceRanges.push({ min, max });
    } else {
      this.selectedPriceRanges = this.selectedPriceRanges.filter(r => r.min !== min || r.max !== max);
    }
    this.applyFiltersAndSorting(true);
  }

  setRating(rating: number): void {
    if (this.selectedRating === rating) {
      this.selectedRating = null; // deselect
    } else {
      this.selectedRating = rating;
    }
    this.applyFiltersAndSorting(true);
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.applyFiltersAndSorting(true);
  }

  onPerPageChange(event: Event): void {
    this.perPage = Number((event.target as HTMLSelectElement).value);
    this.applyFiltersAndSorting(true);
  }

  changePage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
    this.updatePagedProducts();
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.notificationService.show(`${product.name} added to cart`);
  }

  addToWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.show(`${product.name} added to wishlist`);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.perPage));
  }

  get paginationPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  private updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.perPage;
    this.products = this.filteredProducts.slice(start, start + this.perPage);
  }
}
