import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Landing from './pages/Landing.jsx';
import SubmitRequest from './pages/SubmitRequest.jsx';
import TriageQueue from './pages/TriageQueue.jsx';
import RequestDetail from './pages/RequestDetail.jsx';

export default function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/landing-no-sidebar';
  return (
    <div className="flex min-h-screen bg-white text-body">
      {showSidebar && <Sidebar />}
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/submit" element={<SubmitRequest />} />
          <Route path="/triage" element={<TriageQueue />} />
          <Route path="/request/:id" element={<RequestDetail />} />
        </Routes>
      </main>
    </div>
  );
}
