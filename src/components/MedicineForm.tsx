// src/components/MedicineForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MedicineFormData, MedicineType, FoodRelation } from '../types';
import { medicineApi } from '../services/api';

interface Props {
  isEditing?: boolean;
}

export const MedicineForm = ({ isEditing = false }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    type: MedicineType.TABLET,
    dosage: {
      morning: 0,
      afternoon: 0,
      evening: 0,
      bedtime: 0
    },
    foodRelation: FoodRelation.ANY_TIME
  });

  useEffect(() => {
    const fetchMedicine = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const medicine = await medicineApi.getMedicineById(id);
          console.log(medicine)
          const { name, type, dosage, foodRelation } = medicine;
          setFormData({ name, type, dosage, foodRelation });
          setError(null);
        } catch (err) {
          setError('Failed to fetch medicine details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedicine();
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dosage.')) {
      const dosageKey = name.split('.')[1] as keyof typeof formData.dosage;
      setFormData(prev => ({
        ...prev,
        dosage: {
          ...prev.dosage,
          [dosageKey]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && id) {
        await medicineApi.updateMedicine(id, formData);
      } else {
        await medicineApi.addMedicine(formData);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} medicine`);
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container form-container">
      <h1 className="page-title">
        {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
      </h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Medicine Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="type">
            Medicine Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-select"
          >
            {Object.values(MedicineType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="foodRelation">
            Food Relation
          </label>
          <select
            id="foodRelation"
            name="foodRelation"
            value={formData.foodRelation}
            onChange={handleChange}
            className="form-select"
          >
            {Object.values(FoodRelation).map(relation => (
              <option key={relation} value={relation}>
                {relation === FoodRelation.BEFORE_FOOD && 'Before Food'}
                {relation === FoodRelation.AFTER_FOOD && 'After Food'}
                {relation === FoodRelation.WITH_FOOD && 'With Food'}
                {relation === FoodRelation.ANY_TIME && 'Any Time'}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <p className="form-label">Dosage</p>
          <div className="dosage-inputs">
            <div>
              <label className="sub-label" htmlFor="dosage.morning">
                Morning
              </label>
              <input
                type="number"
                id="dosage.morning"
                name="dosage.morning"
                value={formData.dosage.morning}
                onChange={handleChange}
                min="0"
                className="form-input"
              />
            </div>
            <div>
              <label className="sub-label" htmlFor="dosage.afternoon">
                Afternoon
              </label>
              <input
                type="number"
                id="dosage.afternoon"
                name="dosage.afternoon"
                value={formData.dosage.afternoon}
                onChange={handleChange}
                min="0"
                className="form-input"
              />
            </div>
            <div>
              <label className="sub-label" htmlFor="dosage.evening">
                Evening
              </label>
              <input
                type="number"
                id="dosage.evening"
                name="dosage.evening"
                value={formData.dosage.evening}
                onChange={handleChange}
                min="0"
                className="form-input"
              />
            </div>
            <div>
              <label className="sub-label" htmlFor="dosage.bedtime">
                Bedtime
              </label>
              <input
                type="number"
                id="dosage.bedtime"
                name="dosage.bedtime"
                value={formData.dosage.bedtime}
                onChange={handleChange}
                min="0"
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {isEditing ? 'Update Medicine' : 'Add Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
};