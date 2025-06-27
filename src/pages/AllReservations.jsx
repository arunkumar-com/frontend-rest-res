import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user token
    const raw = localStorage.getItem('userInfo');
    const userInfo = raw ? JSON.parse(raw) : null;
    const token = userInfo?.token;

    if (!token) {
      // Redirect to login if no token found
      navigate('/login');
      return;
    }

    // Fetch all reservations; backend enforces admin
    axios.get('https://backend-rest-res.onrender.com/api/reservations/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setReservations(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching reservations:', err);
      setError(err.response?.data?.message || 'Failed to load reservations.');
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <p>Loading reservations…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map(r => (
            <li key={r._id} className="p-4 border rounded-lg">
              <p><strong>User:</strong> {r.user?.username || 'N/A'}</p>
              <p><strong>Restaurant:</strong> {r.restaurant?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {r.time}</p>
              <p><strong>Guests:</strong> {r.numberOfGuests}</p>
              <p><strong>Table:</strong> {r.tableType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllReservations;
