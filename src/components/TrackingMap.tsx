import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Navigation, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom red marker icon for tracking
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface TrackingMapProps {
  onClose: () => void;
}

// Component to update map view when location changes
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const TrackingMap: React.FC<TrackingMapProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { bookings, tracking, equipment } = useEquipment();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const myBookings = bookings.filter(
    (b) => b.farmerId === user?.id && (b.status === 'active' || b.status === 'confirmed')
  );

  const getTrackingData = (equipmentId: string) => {
    return tracking.find((t) => t.equipmentId === equipmentId);
  };

  const getEquipment = (equipmentId: string) => {
    return equipment.find((e) => e.id === equipmentId);
  };

  const renderMap = () => {
    const trackData = selectedBooking ? getTrackingData(selectedBooking) : null;
    const eq = selectedBooking ? getEquipment(selectedBooking) : null;

    if (!trackData || !eq) {
      return (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Select a booking to view tracking</p>
            <p className="text-sm text-gray-500 mt-2">Choose an equipment from the list above</p>
          </div>
        </div>
      );
    }

    const position: [number, number] = [trackData.location.lat, trackData.location.lng];
    const initialPosition: [number, number] = [eq.location.lat, eq.location.lng];

    return (
      <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300 relative">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={position} zoom={13} />
          
          {/* Equipment original location marker */}
          <Marker position={initialPosition} icon={L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}>
            <Popup>
              <div className="text-sm">
                <strong>Original Location</strong><br />
                {eq.location.address}
              </div>
            </Popup>
          </Marker>

          {/* Current tracking location marker */}
          <Marker position={position} icon={redIcon}>
            <Popup>
              <div className="text-sm">
                <strong className="text-red-600">Live Location</strong><br />
                Status: <span className="capitalize font-medium">{trackData.status}</span><br />
                Updated: {format(new Date(trackData.location.timestamp), 'MMM dd, yyyy HH:mm:ss')}<br />
                <span className="text-xs text-gray-500">
                  Lat: {trackData.location.lat.toFixed(6)}, Lng: {trackData.location.lng.toFixed(6)}
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        
        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-900">Live Tracking</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{trackData.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(trackData.location.timestamp), 'HH:mm:ss')}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Red marker shows current location
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Live Equipment Tracking</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {myBookings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No active bookings to track</p>
              <p className="text-sm text-gray-500 mt-2">
                Book equipment and wait for owner confirmation to track it
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Equipment to Track</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myBookings.map((booking) => {
                    const trackData = getTrackingData(booking.equipmentId);
                    const eq = getEquipment(booking.equipmentId);
                    const isSelected = selectedBooking === booking.equipmentId;

                    return (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking.equipmentId)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{booking.equipmentName}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Booking ID: {booking.id.slice(0, 8)}...</div>
                          {trackData && (
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  trackData.status === 'in-use' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                              ></div>
                              <span className="capitalize">{trackData.status}</span>
                            </div>
                          )}
                          {!trackData && (
                            <div className="text-xs text-yellow-600">Tracking not initialized</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Map View</h3>
                {renderMap()}
              </div>

              {selectedBooking && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Equipment Details</h4>
                  {(() => {
                    const eq = getEquipment(selectedBooking);
                    const trackData = getTrackingData(selectedBooking);
                    if (!eq || !trackData) return null;

                    return (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-2 font-medium">{eq.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2 font-medium capitalize">{trackData.status}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <span className="ml-2 font-medium">
                            {format(new Date(trackData.location.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">
                            {trackData.location.lat.toFixed(6)}, {trackData.location.lng.toFixed(6)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Address:</span>
                          <span className="ml-2 font-medium">{eq.location.address}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
