import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MedicineList } from './components/MedicineList';
import { MedicineForm } from './components/MedicineForm';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MedicineList />} />
          <Route path="add" element={<MedicineForm />} />
          <Route path="edit/:id" element={<MedicineForm isEditing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;