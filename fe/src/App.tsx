import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import { MarketProvider } from './context/MarketContext';
import Market from './pages/Market';
import CreateBox from './pages/CreateBox';
import Profile from './pages/Profile';
import Home from './pages/Home';

import PurchaseBox from './pages/PurchaseBox';

import TradeDetail from './pages/TradeDetail';
import Wiki from './pages/Wiki';

import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <MarketProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/create" element={<CreateBox />} />
              <Route path="/buy/:id" element={<PurchaseBox />} />
              <Route path="/trade/:id" element={<TradeDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wiki" element={<Wiki />} />
            </Route>
          </Routes>
        </Router>
      </MarketProvider>
    </NotificationProvider>
  );
}

export default App;
