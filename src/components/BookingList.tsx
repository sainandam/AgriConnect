import React from 'react';
import { Booking } from '../types';
import { Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useEquipment } from '../context/EquipmentContext';

interface BookingListProps {
  bookings: Booking[];
  userRole: 'farmer' | 'owner';
}

const BookingList: React.FC<BookingListProps> = ({ bookings, userRole }) => {
  const { updateBooking } = useEquipment();

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    updateBooking(bookingId, { status: newStatus });
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{booking.equipmentName}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">₹{booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {userRole === 'farmer' ? `Owner: ${booking.ownerName}` : `Farmer: ${booking.farmerName}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
                {userRole === 'farmer' && (
                  <div className="text-xs text-gray-500">
                    Booking ID: {booking.id.slice(0, 8)}...
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              {getStatusIcon(booking.status)}
            </div>
          </div>

          {userRole === 'owner' && booking.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {userRole === 'owner' && booking.status === 'confirmed' && (
            <div className="pt-4 border-t">
              <button
                onClick={() => handleStatusChange(booking.id, 'active')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark as Active
              </button>
            </div>
          )}

          {(booking.status === 'active' || booking.status === 'confirmed') && (
            <div className="pt-4 border-t">
              <button
                onClick={() => handleStatusChange(booking.id, 'completed')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Complete Rental
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingList;

