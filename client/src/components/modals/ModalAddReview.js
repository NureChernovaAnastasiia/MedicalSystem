import React, { useEffect, useState } from 'react';
import styles from '../../style/modalstyle/ModalAddReview.module.css';
import { submitReview } from '../../http/reviewAPI';
import { fetchAllDoctors } from '../../http/doctorAPI';
import { fetchAllHospitals } from '../../http/hospitalAPI';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalAddReview = ({ onClose, onSubmit }) => {
  const [targetType, setTargetType] = useState('Doctor');
  const [targets, setTargets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredTargets, setFilteredTargets] = useState([]);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data =
          targetType === 'Doctor' ? await fetchAllDoctors() : await fetchAllHospitals();
        setTargets(data);
        setFilteredTargets(data);
        setSearchInput('');
        setSelectedTargetId(null);
      } catch (error) {
        setAlert({ message: 'Помилка при завантаженні даних.', type: 'error' });
      }
    };

    fetchTargets();
  }, [targetType]);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    const filtered = targets.filter((target) => {
      const name = targetType === 'Doctor'
        ? `${target.last_name} ${target.first_name} ${target.middle_name}`.toLowerCase()
        : target.name.toLowerCase();
      return name.includes(input.toLowerCase());
    });

    setFilteredTargets(filtered);
  };

  const handleSelectTarget = (target) => {
    setSearchInput(
      targetType === 'Doctor'
        ? `${target.last_name} ${target.first_name} ${target.middle_name}`
        : target.name
    );
    setSelectedTargetId(target.id);
    setFilteredTargets([]);
  };

  const handleSubmit = async () => {
    if (!selectedTargetId || rating === 0 || !reviewText.trim()) {
      setAlert({ message: 'Будь ласка, заповніть усі поля.', type: 'error' });
      return;
    }

    const reviewData = {
      target_type: targetType,
      target_id: selectedTargetId,
      rating,
      comment: reviewText,
    };

    try {
      await submitReview(reviewData);
      setAlert({ message: 'Відгук надіслано успішно!', type: 'success' });
      setTimeout(() => {
        onSubmit?.();
        onClose();
      }, 1200);
    } catch (error) {
      setAlert({ message: 'Не вдалося надіслати відгук.', type: 'error' });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {alert && <AlertPopup message={alert.message} type={alert.type} />}
        <h2 className={styles.title}>Залишити відгук</h2>

        <label className={styles.label}>Ціль:</label>
        <select
          className={styles.select}
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        >
          <option value="Doctor">Лікар</option>
          <option value="Hospital">Лікарня</option>
        </select>

        <label className={styles.label}>Оберіть {targetType === 'Doctor' ? 'лікаря' : 'лікарню'}:</label>
        <input
          type="text"
          className={styles.input}
          placeholder={`Пошук ${targetType === 'Doctor' ? 'лікаря' : 'лікарні'}...`}
          value={searchInput}
          onChange={handleSearchChange}
        />
        {filteredTargets.length > 0 && (
          <ul className={styles.suggestions}>
            {filteredTargets.map((target) => (
              <li
                key={target.id}
                onClick={() => handleSelectTarget(target)}
                className={styles.suggestionItem}
              >
                {targetType === 'Doctor'
                  ? `${target.last_name} ${target.first_name} ${target.middle_name}`
                  : target.name}
              </li>
            ))}
          </ul>
        )}

        <label className={styles.label}>Оцінка:</label>
        <div className={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${styles.star} ${star <= rating ? styles.active : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className={styles.textarea}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Напишіть свій відгук тут..."
        />

        <div className={styles.actions}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Надіслати
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            <span className={styles.closeIcon}>×</span>
            <span className={styles.closeText}>Скасувати</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddReview;
