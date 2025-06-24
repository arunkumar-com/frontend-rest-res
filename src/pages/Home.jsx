import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('https://backend-rest-res.onrender.com/api/restaurants');
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurants. Please try again later.');
        setLoading(false);
      }
    };

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.isAdmin) setIsAdmin(true);

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title text-3xl">Our Restaurants</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/reservations')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            My Reservations
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/reservations')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              All Reservations
            </button>
          )}
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center text-gray-600">
          No restaurants available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
