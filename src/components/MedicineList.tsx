import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FoodRelation, Medicine } from '../types';
import { medicineApi } from '../services/api';

export const MedicineList = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const data = await medicineApi.getAllMedicines();
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

  const confirmDelete = (id: string) => {
    setMedicineToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!medicineToDelete) return;

    try {
      await medicineApi.deleteMedicine(medicineToDelete);
      setMedicines(medicines.filter(med => med._id !== medicineToDelete));
    } catch (err) {
      setError('Failed to delete medicine');
      console.error(err);
    } finally {
      setShowConfirmDialog(false);
      setMedicineToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setMedicineToDelete(null);
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
      <Link
        to={isAdmin ? "/add" : "#"}
        className={`btn btn-primary ${!isAdmin ? 'disabled' : ''}`}
        onClick={(e) => {
          if (!isAdmin) e.preventDefault();
        }}
      >
        Add Medicine
      </Link>
    </div>

    {medicines.length === 0 ? (
      <p className="empty-state">
        No medicines found. {isAdmin && 'Add your first medicine!'}
      </p>
    ) : (
      <div className="card-grid">
        {medicines.map((medicine) => (
          <div key={medicine._id} style={{ position: 'relative' }}>
            <div className={`card ${showConfirmDialog && medicineToDelete === medicine._id ? 'blurred' : ''}`}>
              <div className="card-header">
                <h2 className="card-title">{medicine.name}</h2>
                <span className="card-badge">{medicine.type}</span>
              </div>

              <div className="card-body">
                <p><strong>Food Relation:</strong> {getFoodRelationText(medicine.foodRelation)}</p>

                <div className="dosage-section">
                  <strong>Dosage:</strong>
                  <div className="dosage-grid">
                    <div className="dosage-pill dosage-morning">
                      <span className="dosage-label">Morning</span>
                      <span>{medicine.dosage.morning}</span>
                    </div>
                    <div className="dosage-pill dosage-afternoon">
                      <span className="dosage-label">Afternoon</span>
                      <span>{medicine.dosage.afternoon}</span>
                    </div>
                    <div className="dosage-pill dosage-evening">
                      <span className="dosage-label">Evening</span>
                      <span>{medicine.dosage.evening}</span>
                    </div>
                    <div className="dosage-pill dosage-bedtime">
                      <span className="dosage-label">Bedtime</span>
                      <span>{medicine.dosage.bedtime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {isAdmin ? (
                  <>
                    <Link to={`/edit/${medicine._id}`} className="btn btn-secondary">
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(medicine._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/edit/${medicine._id}`}
                      className="btn btn-secondary disabled"
                      onClick={(e) => e.preventDefault()}
                    >
                      Edit
                    </Link>
                    <button className="btn btn-danger disabled" disabled>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {showConfirmDialog && medicineToDelete === medicine._id && (
              <div className="inline-dialog">
                <p>Are you sure you want to delete {medicine.name}?</p>
                <div className="dialog-actions">
                  <button onClick={handleConfirmDelete} className="btn btn-danger">Yes, Delete</button>
                  <button onClick={handleCancelDelete} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

};
