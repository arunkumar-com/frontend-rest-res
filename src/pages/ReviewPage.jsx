import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`https://backend-rest-res.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant details');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://backend-rest-res.onrender.com/api/reviews',
        {
          restaurantId,
          ...formData,
          rating: Number(formData.rating)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate(`/restaurant/${restaurantId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading...</div>
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

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Write a Review</h1>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-700">{restaurant.name}</h2>
            <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
            <p className="text-gray-500 line-clamp-1">{restaurant.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Rating Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Your Rating
            </label>
            <div className="flex items-center space-x-2">
              {[5, 4, 3, 2, 1].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'rating', value } })}
                  className="text-3xl focus:outline-none transition-colors"
                >
                  <span 
                    className={`${
                      Number(formData.rating) >= value 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Text Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Your Review
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              rows="6"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
              placeholder="Share your dining experience... What did you like about the food, service, and atmosphere?"
            />
          </div>

          {/* Review Guidelines */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Review Guidelines:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Be specific about your dining experience</li>
              <li>• Mention the dishes you tried</li>
              <li>• Comment on the service and atmosphere</li>
              <li>• Keep it respectful and constructive</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
