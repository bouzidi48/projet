export interface Cart {
    id: string;
    userId: string;
    items: CartItemType[];
    createdAt: Date;
    updatedAt: Date;
  }
  export interface CartItemType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
    size?: string;
  }