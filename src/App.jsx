import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import SubmitRequest from './pages/SubmitRequest.jsx';
import TriageQueue from './pages/TriageQueue.jsx';
import RequestDetail from './pages/RequestDetail.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen bg-white text-body">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Navigate to="/submit" replace />} />
          <Route path="/submit" element={<SubmitRequest />} />
          <Route path="/triage" element={<TriageQueue />} />
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="*" element={<Navigate to="/submit" replace />} />
        </Routes>
      </main>
    </div>
  );
}
