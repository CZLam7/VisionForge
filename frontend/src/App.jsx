import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EditPage    from './pages/EditPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/edit"     element={<EditPage />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}
