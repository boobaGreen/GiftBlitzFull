import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import { MarketProvider } from './context/MarketContext';
import Market from './pages/Market';
import CreateBox from './pages/CreateBox';
import Profile from './pages/Profile';
import Home from './pages/Home';

import PurchaseBox from './pages/PurchaseBox';

import TradeDetail from './pages/TradeDetail';

function App() {
  return (
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
          </Route>
        </Routes>
      </Router>
    </MarketProvider>
  );
}

export default App;
