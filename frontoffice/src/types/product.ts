export interface Product {
  id: number;
  nameProduct: string;
  description: string;
  price: number;
  createdate: string;
  updatedate: string | null;
  colours: Colour[];
  category?: Category;
}

export interface Colour {
  id: number;
  nameCouleur: string;
  createdate: string;
  updatedate: string | null;
  images?: Image[];
  sizes?: Size[];
}

export interface Image {
  id: number;
  UrlImage: string;
  createdate: string;
  updatedate: string | null;
}

export interface Size {
  id: number;
  typeSize: string;
  createdate: string;
  updatedate: string | null;
  stockQuantity: number;
}

export interface Category {
  id: number;
  nameCategory: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
}