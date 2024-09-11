export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }