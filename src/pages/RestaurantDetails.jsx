import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, reviewsRes] = await Promise.all([
          axios.get(`https://backend-rest-res.onrender.com/api/restaurants/${id}`),
          axios.get(`https://backend-rest-res.onrender.com/api/reviews/${id}`)
        ]);
        setRestaurant(restaurantRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant details. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    checkAvailability();
  }, []);

  const handleReservation = (selectedTime, type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/reservation/${id}?date=${date}&time=${selectedTime}&tableType=${type}`);
  };

  const handleReview = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/review/${id}`);
  };

  const checkAvailability = async () => {
    if (!date) return;
    try {
      setChecking(true);
      const res = await axios.get(`https://backend-rest-res.onrender.com/api/reservations/slots`, {
        params: { restaurantId: id, date }
      });
      setSlots(res.data.slots);
    } catch (err) {
      setSlots([]);
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading restaurant details...</div>;
  }

  if (error || !restaurant) {
    return <div className="flex justify-center items-center min-h-[60vh]">{error || 'Restaurant not found'}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-lg text-gray-200">{restaurant.description}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Table Availability</h2>
              <button onClick={() => handleReservation('', '')} className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200">Make a Reservation</button>
            </div>
            <div className="flex items-center gap-4">
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="border px-4 py-2 rounded-lg" />
              <button onClick={checkAvailability} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700" disabled={checking}>{checking ? 'Checking...' : 'Check Availability'}</button>
            </div>
            {slots.length > 0 && (
              <div className="space-y-6 mt-6">
                {slots.map((slot) => (
                  <div key={slot.time} className="border rounded-xl bg-gray-50 p-4 space-y-4">
                    <div className="text-lg font-semibold text-gray-700">{formatTime(slot.time)} — Total: {slot.twoSeater + slot.fourSeater} available</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-full">2-Seater</span>
                        <span className="text-gray-700 font-medium">{slot.twoSeater} available</span>
                        <button disabled={slot.twoSeater === 0} onClick={() => handleReservation(slot.time, 'twoSeater')} className={`ml-auto px-4 py-2 rounded-lg text-sm font-semibold ${slot.twoSeater > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                          Book
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-purple-100 text-purple-800 font-semibold rounded-full">4-Seater</span>
                        <span className="text-gray-700 font-medium">{slot.fourSeater} available</span>
                        <button disabled={slot.fourSeater === 0} onClick={() => handleReservation(slot.time, 'fourSeater')} className={`ml-auto px-4 py-2 rounded-lg text-sm font-semibold ${slot.fourSeater > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Guest Reviews</h2>
              <button onClick={handleReview} className="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200">Write a Review</button>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-600 text-lg">No reviews yet. Be the first to share your experience!</div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{review.user.username}</p>
                        <div className="flex items-center mt-1 space-x-1">
                          {[...Array(5)].map((_, index) => (
                            <span key={index} className={`text-xl ${index < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">⏰</div>
                <div>
                  <p className="text-sm text-gray-600">Opening Hours</p>
                  <p className="font-medium text-gray-800">11:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">📞</div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium text-gray-800">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">📍</div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-800">123 Restaurant St.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
