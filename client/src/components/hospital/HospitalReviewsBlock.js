import React, { useEffect, useState } from 'react';
import { fetchReviewsByTarget, deleteReview } from '../../http/reviewAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import ConfirmModal from '../elements/ConfirmModal';

const styles = {
  reviewsContainer: {
    margin: '40px 0',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '20px',
  },
  sectionTitle: {
    fontSize: '26px',
    margin: '5px 0 10px',
    color: '#333',
    textAlign: 'center',
    fontWeight: '400',
  },
  tabButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '10px 0 20px',
    borderBottom: '2px solid rgba(0, 195, 161, 0.42)',
  },
  tabButton: {
    background: 'transparent',
    border: 'none',
    padding: '12px 24px',
    fontSize: '22px',
    fontWeight: 500,
    color: '#333',
    cursor: 'pointer',
    borderBottom: '4px solid transparent',
    transition: 'color 0.3s ease, border-color 0.3s ease',
  },
  activeTabButton: {
    color: '#00C3A1',
    borderBottom: '4px solid #00C3A1',
    fontWeight: 700,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    border: '1px solid #e0e0e0',
    fontFamily: 'Montserrat, sans-serif',
  },
  deleteButton: {
    position: 'absolute',
    top: '0px',
    right: '8px',
    background: 'transparent',
    border: 'none',
    color: '#f44336',
    fontSize: '30px',
    cursor: 'pointer',
  },
  reviewDate: {
    position: 'absolute',
    top: '10px',
    right: '40px',
    fontSize: '13px',
    color: '#888',
  },
  reviewTitle: {
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#333',
  },
  reviewRating: {
    margin: '0 0 4px',
    fontSize: '16px',
    color: '#FFD700',
  },
  reviewComment: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
  },
  doctorSection: {
    marginTop: '16px',
  },
  doctorName: {
    fontWeight: 600,
    margin: '20px',
  },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const renderStars = (rating) => {
  const fullStar = '★';
  const emptyStar = '☆';
  return (
    <span style={{ color: '#FFD700', fontSize: '20px' }}>
      {fullStar.repeat(rating)}
      {emptyStar.repeat(5 - rating)}
    </span>
  );
};

const HospitalReviewsBlock = ({ hospitalId }) => {
  const [hospitalReviews, setHospitalReviews] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('hospital');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hospitalId) return;

    const fetchData = async () => {
      try {
        const hospitalRes = await fetchReviewsByTarget('Hospital', hospitalId);
        setHospitalReviews(hospitalRes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const doctors = await fetchDoctorsByHospitalId(hospitalId);
        const reviewsWithDoctors = await Promise.all(
          doctors.map(async (doctor) => {
            const reviews = await fetchReviewsByTarget('Doctor', doctor.id);
            return reviews.length ? { doctor, reviews } : null;
          })
        );
        setDoctorReviews(reviewsWithDoctors.filter(Boolean));
      } catch (err) {
        console.error('Помилка при завантаженні відгуків:', err);
      }
    };

    fetchData();
  }, [hospitalId]);

  const handleDeleteClick = (id, type) => {
    setSelectedReview({ id, type });
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReview) return;
    const { id, type } = selectedReview;

    try {
      setLoading(true);
      await deleteReview(id);

      if (type === 'hospital') {
        setHospitalReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        setDoctorReviews((prev) =>
          prev
            .map(({ doctor, reviews }) => ({
              doctor,
              reviews: reviews.filter((r) => r.id !== id),
            }))
            .filter(({ reviews }) => reviews.length > 0)
        );
      }
    } catch (err) {
      console.error('Не вдалося видалити відгук:', err);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setSelectedReview(null);
    }
  };

  const renderReview = (review, type = 'hospital') => (
    <div key={review.id} style={styles.reviewCard}>
      <button style={styles.deleteButton} onClick={() => handleDeleteClick(review.id, type)}>×</button>
      <div style={styles.reviewDate}>{formatDate(review.createdAt)}</div>
      <p style={styles.reviewTitle}>
        {review.Patient?.last_name} {review.Patient?.first_name}:
      </p>
      <p style={styles.reviewRating}>{renderStars(review.rating)}</p>
      <p style={styles.reviewComment}>{review.comment}</p>
    </div>
  );

  return (
    <div style={styles.reviewsContainer}>
      <p style={styles.sectionTitle}>Відгуки лікарні</p>

      <div style={styles.tabButtons}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'hospital' ? styles.activeTabButton : {}),
          }}
          onClick={() => setActiveTab('hospital')}
        >
          Лікарня
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'doctors' ? styles.activeTabButton : {}),
          }}
          onClick={() => setActiveTab('doctors')}
        >
          Лікарі
        </button>
      </div>

      {activeTab === 'hospital' ? (
        hospitalReviews.length ? (
          hospitalReviews.map((review) => renderReview(review, 'hospital'))
        ) : (
          <p>Немає відгуків про цю лікарню.</p>
        )
      ) : (
        doctorReviews.length ? (
          doctorReviews.map(({ doctor, reviews }) => (
            <div key={doctor.id} style={styles.doctorSection}>
              <h3 style={styles.doctorName}>
                Відгуки для {doctor.last_name} {doctor.first_name}
              </h3>
              {reviews.map((review) => renderReview(review, 'doctor'))}
            </div>
          ))
        ) : (
          <p>Відгуків про лікарів немає.</p>
        )
      )}

      <ConfirmModal
        isOpen={modalOpen}
        title="Підтвердити видалення"
        message="Ви впевнені, що хочете видалити цей відгук?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setModalOpen(false);
          setSelectedReview(null);
        }}
        loading={loading}
        confirmText="Видалити"
        cancelText="Скасувати"
      />
    </div>
  );
};

export default HospitalReviewsBlock;