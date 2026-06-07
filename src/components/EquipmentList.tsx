import React from 'react';
import { Equipment } from '../types';
import { MapPin, Calendar, CheckCircle, XCircle, Wrench, Image as ImageIcon } from 'lucide-react';

interface EquipmentListProps {
  equipment: Equipment[];
  onBook?: (id: string) => void;
  userRole: 'farmer' | 'owner';
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onBook, userRole }) => {
  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rented':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'rented':
        return 'Rented';
      case 'maintenance':
        return 'Maintenance';
    }
  };

  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">No equipment found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
          {/* Equipment Image */}
          <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No Image</p>
                </div>
              </div>
            )}
            {/* Status Badge Overlay */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              {getStatusIcon(item.status)}
              <span className="text-xs font-medium text-gray-700">{getStatusText(item.status)}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.type}</p>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{item.location.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">₹{item.pricePerDay}/day</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Specifications:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {Object.entries(item.specifications).slice(0, 4).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>

            {userRole === 'farmer' && item.status === 'available' && onBook && (
              <button
                onClick={() => onBook(item.id)}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Book Now
              </button>
            )}

            {userRole === 'owner' && (
              <div className="text-sm text-gray-500">
                Owner: {item.ownerName}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EquipmentList;

