import { Link } from 'react-router-dom';
import {
  Bus,
  Train,
  Ship,
  Plane,
  MapPin,
  Clock,
  DollarSign,
} from 'lucide-react';

const transportIcons = {
  bus: Bus,
  train: Train,
  launch: Ship,
  plane: Plane,
};

export default function TicketCard({ ticket }) {
  const Icon = transportIcons[ticket.transportType];

  return (
    <Link
      to={`/ticket/${ticket._id}`}
      className="group relative overflow-hidden rounded-3xl h-[500px] flex flex-col glass dark:glass-dark hover:glass hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-4"
    >
      {/* Badge */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          Limited Seats
        </div>
      </div>

      {/* Image */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass p-4 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white font-bold text-sm">● LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-3 line-clamp-2">
            {ticket.title}
          </h3>

          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Dhaka → Cox's Bazar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>2h 45m</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-primary-600">
              ৳{ticket.price}
            </span>
            <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/50 px-4 py-2 rounded-2xl">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                {ticket.quantity} seats
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full border-3 border-white dark:border-gray-900"
                  />
                ))}
            </div>
            <Link
              to={`/ticket/${ticket._id}`}
              className="group/btn inline-flex items-center space-x-2 text-sm font-bold text-primary-600 hover:text-primary-700 group-hover/btn:translate-x-1 transition-all"
            >
              <span>View Details</span>
              <DollarSign className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
