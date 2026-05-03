"import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Reservations from './pages/Reservations';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import OrderConfirmed from './pages/OrderConfirmed';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  });
  return null;
}

function App() {
  return (
    <div className=\"App\">
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <ScrollToTop />
            <Routes>
              <Route path=\"/\" element={<Home />} />
              <Route path=\"/menu\" element={<Menu />} />
              <Route path=\"/cart\" element={<Cart />} />
              <Route path=\"/reservations\" element={<Reservations />} />
              <Route path=\"/about\" element={<About />} />
              <Route path=\"/gallery\" element={<Gallery />} />
              <Route path=\"/contact\" element={<Contact />} />
              <Route path=\"/order-confirmed/:id\" element={<OrderConfirmed />} />
              <Route path=\"/admin/login\" element={<AdminLogin />} />
              <Route path=\"/admin\" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
"