export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  returnContainer?: boolean;
}

export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: Coordinates;
  items: DeliveryItem[];
  totalAmount: number;
  status: 'pending' | 'collecting' | 'picked_up' | 'delivering' | 'in_transit' | 'returning' | 'delivered' | 'returned' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: Date;
  estimatedTime?: Date;
  pickupTime?: Date;
  deliveredAt?: Date;
  photo?: string;
  signature?: string;
  notes?: string;
  bottleReturn?: number;
  paymentMethod: 'money' | 'card' | 'pix';
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  deliveryIds: string[];
  startLocation: Coordinates;
  currentLocation: Coordinates;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  distance: number; // in km
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy types for backward compatibility
export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface DeliveryRoute {
  id: string;
  deliveries: Delivery[];
  currentIndex: number;
  totalDistance: number;
  estimatedDuration: number;
  startTime?: Date;
  endTime?: Date;
}