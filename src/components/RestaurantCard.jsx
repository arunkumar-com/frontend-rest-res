import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const { _id, name, description, image } = restaurant;

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`/restaurant/${_id}`}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">2-Seat Tables</p>
              <p className="text-lg font-semibold text-gray-800">{restaurant.tables.twoSeater}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">4-Seat Tables</p>
              <p className="text-lg font-semibold text-gray-800">{restaurant.tables.fourSeater}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
