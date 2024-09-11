export interface CreateOrderDTO {
    userId: string;
    products: {
      productId: string;
      quantity: number;
    }[];
  }