// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MedicineList } from './components/MedicineList';
import { MedicineForm } from './components/MedicineForm';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MedicineList />} />
            <Route path="login" element={<Login />} />
            <Route 
              path="add" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <MedicineForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="edit/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <MedicineForm isEditing />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;