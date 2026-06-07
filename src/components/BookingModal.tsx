import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';
import { X, Calendar } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

interface BookingModalProps {
  equipmentId: string;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ equipmentId, onClose }) => {
  const { user } = useAuth();
  const { equipment, createBooking } = useEquipment();
  const [startDate, setStartDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 8), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const equipmentItem = equipment.find((eq) => eq.id === equipmentId);

  if (!equipmentItem) {
    return null;
  }

  const days = differenceInDays(new Date(endDate), new Date(startDate));
  const totalPrice = days * equipmentItem.pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) return;

    createBooking({
      equipmentId: equipmentItem.id,
      equipmentName: equipmentItem.name,
      farmerId: user.id,
      farmerName: user.name,
      ownerId: equipmentItem.ownerId,
      ownerName: equipmentItem.ownerName,
      startDate,
      endDate,
      totalPrice,
    });

    setLoading(false);
    onClose();
    alert('Booking request submitted successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book Equipment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Equipment Image */}
          {equipmentItem.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img
                src={equipmentItem.image}
                alt={equipmentItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{equipmentItem.name}</h3>
            <p className="text-gray-600">{equipmentItem.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Rental Period:</span>
              <span className="font-medium">{days} {days === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Price per day:</span>
              <span className="font-medium">₹{equipmentItem.pricePerDay}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-lg font-semibold text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || days <= 0}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

