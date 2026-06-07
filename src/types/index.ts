export type UserRole = 'farmer' | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  description: string;
  ownerId: string;
  ownerName: string;
  pricePerDay: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'rented' | 'maintenance';
  image?: string;
  specifications: {
    [key: string]: string;
  };
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  farmerId: string;
  farmerName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface EquipmentTracking {
  equipmentId: string;
  location: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  status: 'idle' | 'in-use' | 'moving';
}

export interface CropAdvisorResponse {
  recommendation: string;
  equipment: string[];
  reasoning: string;
  cropType: string;
  season: string;
}

