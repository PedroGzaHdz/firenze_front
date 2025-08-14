export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  shippedDate: string;
  unitsOnHand: number;
  paymentStatus: 'On Time' | 'Overdue';
  marketValue: number;
}

export interface CostItem {
  type: string;
  category: string;
  status: string;
  amount: number;
}

export interface Anomaly {
  type: string;
  description: string;
}

export interface PromoItem {
  title: string;
  dateRange: string;
  sku: string;
}
