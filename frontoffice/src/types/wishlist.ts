export interface Wishlist {
    id: string;
    userId: string;
    products: string[]; // Array of product IDs
    createdAt: Date;
    updatedAt: Date;
  }