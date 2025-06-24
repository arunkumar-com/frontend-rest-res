import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [navigate]);

  const fetchReservations = () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    axios
      .get('https://backend-rest-res.onrender.com/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load your reservations.');
        setLoading(false);
      });
  };

  const handleCancel = (id) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    axios
      .delete(`https://backend-rest-res.onrender.com/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setReservations((prev) => prev.filter((r) => r._id !== id));
      })
      .catch(() => {
        alert('Failed to cancel reservation.');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>
      {reservations.length === 0 ? (
        <p>You have no reservations yet.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li key={r._id} className="p-4 border rounded-lg">
              <p><strong>Restaurant:</strong> {r.restaurant?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {r.time}</p>
              <p><strong>Guests:</strong> {r.numberOfGuests}</p>
              <p><strong>Table:</strong> {r.tableType}</p>
              <button
                onClick={() => handleCancel(r._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Reservation
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReservations;
