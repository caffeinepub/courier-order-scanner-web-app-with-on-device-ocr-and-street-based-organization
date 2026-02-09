export interface Order {
  id: string;
  customerName: string;
  street: string;
  completed: boolean;
  createdAt: number;
  imageData?: string;
}

export interface StreetGroup {
  street: string;
  orders: Order[];
  count: number;
}

export interface CustomerGroup {
  customerName: string;
  orders: Order[];
  count: number;
}
