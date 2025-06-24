import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import ReservationForm from './pages/ReservationForm';
import ReviewPage from './pages/ReviewPage';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MyReservations from './pages/MyReservations'; // ⬅️ Import it
import AllReservations from './pages/AllReservations';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Protected Routes */}
            <Route
              path="/reservation/:restaurantId"
              element={
                <ProtectedRoute>
                  <ReservationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:restaurantId"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute>
                <AllReservations />
                  </ProtectedRoute>
               }
              />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
