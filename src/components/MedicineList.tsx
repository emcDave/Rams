// src/components/MedicineList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Medicine, FoodRelation } from '../types';
import { medicineApi } from '../services/api';

export const MedicineList = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const data = await medicineApi.getAllMedicines();
        console.log(data)
        setMedicines(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch medicines');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineApi.deleteMedicine(id);
        setMedicines(medicines.filter(med => med._id !== id));
      } catch (err) {
        setError('Failed to delete medicine');
        console.error(err);
      }
    }
  };

  const getFoodRelationText = (relation: FoodRelation): string => {
    switch (relation) {
      case FoodRelation.BEFORE_FOOD: return 'Before food';
      case FoodRelation.AFTER_FOOD: return 'After food';
      case FoodRelation.WITH_FOOD: return 'With food';
      case FoodRelation.ANY_TIME: return 'Any time';
      default: return relation;
    }
  };

  if (loading) return <div className="loading">Loading medicines...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Medicines</h1>
        <Link to="/add" className="btn btn-primary">
          Add New Medicine
        </Link>
      </div>

      {medicines.length === 0 ? (
        <p className="empty-state">No medicines found. Add your first medicine!</p>
      ) : (
        <div className="card-grid">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="card">
              <div className="card-header">
                <h2 className="card-title">{medicine.name}</h2>
                <span className="card-badge">
                  {medicine.type}
                </span>
              </div>
              
              <div className="card-body">
                <p><strong>Food Relation:</strong> {getFoodRelationText(medicine.foodRelation)}</p>
                
                <div className="dosage-section">
                  <strong>Dosage:</strong>
                  <div className="dosage-grid">
                    { (
                      <div className="dosage-pill dosage-morning">
                        <span className="dosage-label">Morning</span>
                        <span>{medicine.dosage.morning}</span>
                      </div>
                    )}
                    {  (
                      <div className="dosage-pill dosage-afternoon">
                        <span className="dosage-label">Afternoon</span>
                        <span>{medicine.dosage.afternoon}</span>
                      </div>
                    )}
                    {(
                      <div className="dosage-pill dosage-evening">
                        <span className="dosage-label">Evening</span>
                        <span>{medicine.dosage.evening}</span>
                      </div>
                    )}
                    { (
                      <div className="dosage-pill dosage-bedtime">
                        <span className="dosage-label">Bedtime</span>
                        <span>{medicine.dosage.bedtime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <Link 
                  to={`/edit/${medicine._id}`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(medicine._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};