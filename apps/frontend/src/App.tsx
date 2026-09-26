import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdoptionInterest from './pages/AdoptionInterest/AdoptionInterest';
import AnimalDetails from './pages/AnimalDetails/AnimalDetails';
import AnimalsList from './pages/AnimalsList/AnimalsList';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import RequestConfirmation from './pages/RequestConfirmation/RequestConfirmation';
import RequestDetails from './pages/RequestDetails/RequestDetails';
import RequestList from './pages/RequestList/RequestList';
import { RequireAuth } from './components/layout/RequireAuth/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/animais"
          element={
            <RequireAuth>
              <AnimalsList />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/solicitacoes"
          element={
            <RequireAuth>
              <RequestList />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/solicitacoes/:id"
          element={
            <RequireAuth>
              <RequestDetails />
            </RequireAuth>
          }
        />
        <Route path="/animals/:id" element={<AnimalDetails />} />
        <Route path="/animals/:id/interesse" element={<AdoptionInterest />} />
        <Route
          path="/animals/:id/interesse/enviada"
          element={<RequestConfirmation />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
