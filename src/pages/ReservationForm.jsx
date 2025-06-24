import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationForm = () => {
  // const { id } = useParams();
  const { restaurantId: id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restaurantValid, setRestaurantValid] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    tableType: 'twoSeater', // Updated to match backend enum
    specialRequests: ''
  });

  useEffect(() => {
    const isValidObjectId = typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
    setRestaurantValid(isValidObjectId);
    console.log('Restaurant ID from URL:', id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!restaurantValid) {
      setError('Invalid restaurant ID. Please ensure the URL contains a valid 24-character ID.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('https://backend-rest-res.onrender.com/api/reservations', {
        restaurantId: id,
        date: formData.date,
        time: formData.time,
        tableType: formData.tableType,
        numberOfGuests: formData.tableType === 'fourSeater' ? 4 : 2,
        specialRequests: formData.specialRequests
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Make a Reservation</h1>
        {error && <div className="mb-6 p-4 bg-red-50 border-red-200 rounded-lg text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="">Select a time</option>
              {[...Array(11)].map((_, i) => {
                const hour = 11 + i;
                return (
                  <option key={hour} value={`${hour}:00`}>
                    {hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Table Type</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '2-Seat Table', value: 'twoSeater', note: 'Perfect for couples' },
                { label: '4-Seat Table', value: 'fourSeater', note: 'For small groups' }
              ].map(option => (
                <label key={option.value} className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    name="tableType"
                    value={option.value}
                    checked={formData.tableType === option.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-full p-4 bg-white border border-gray-200 rounded-lg peer-checked:border-black peer-checked:bg-gray-50">
                    <span className="font-medium text-gray-800">{option.label}</span>
                    <span className="text-sm text-gray-500 block">{option.note}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black resize-none"
              placeholder="Any special requests or dietary requirements?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-black text-white rounded-lg font-semibold 
              ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-800'} transition-colors duration-200`}
          >
            {loading ? 'Confirming Reservation...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
