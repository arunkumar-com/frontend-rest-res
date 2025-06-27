import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TABLE_OPTIONS = [
  { label: '2-Seat Table', value: 'twoSeater', note: 'Perfect for couples' },
  { label: '4-Seat Table', value: 'fourSeater', note: 'For small groups' },
];

const ReservationForm = () => {
  const { restaurantId: id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const defaultDate = queryParams.get('date') || '';
  const defaultTime = queryParams.get('time') || '';
  const defaultTableType = queryParams.get('tableType') || 'twoSeater';

  const [formData, setFormData] = useState({
    date: defaultDate,
    time: defaultTime,
    tableType: defaultTableType,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const isValidObjectId = typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    if (!isValidObjectId) setError('Invalid restaurant ID in URL.');
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValidObjectId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      await axios.post(
        'https://backend-rest-res.onrender.com/api/reservations',
        {
          restaurantId: id,
          ...formData,
          numberOfGuests: formData.tableType === 'fourSeater' ? 4 : 2
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Make a Reservation</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
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

          {/* Time */}
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
                const display = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
                return <option key={hour} value={`${hour}:00`}>{display}</option>;
              })}
            </select>
          </div>

          {/* Table Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Table Type</label>
            <div className="grid grid-cols-2 gap-4">
              {TABLE_OPTIONS.map(({ label, value, note }) => (
                <label key={value} className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    name="tableType"
                    value={value}
                    checked={formData.tableType === value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-full p-4 bg-white border border-gray-200 rounded-lg peer-checked:border-black peer-checked:bg-gray-50">
                    <span className="font-medium text-gray-800">{label}</span>
                    <span className="text-sm text-gray-500 block">{note}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requests or dietary requirements?"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Submit */}
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
