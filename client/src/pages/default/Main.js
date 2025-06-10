import React, { useState, useEffect  } from 'react';
import { NavLink } from "react-router-dom";
import { ABOUTUS_ROUTE, LOGIN_ROUTE } from '../../utils/consts';
import { fetchAllReviews } from '../../http/reviewAPI'; 
import '../../style/default/Main.css';

import bannerImage from '../../img/Healthcare.png';
import { iconBooking, iconHealth, iconReminder, iconServices } from '../../utils/icons';
import noPhoto from '../../img/NoPhoto.jpg';

const InfoCard = ({ icon, title, text }) => (
  <div className="card">
    <h3 className="card-title">{title}</h3>
    <img src={icon} alt={title} className="card-icon" />
    <p className="card-text">{text}</p>
  </div>
);

const ReviewCard = ({ img, name, age, stars, quote, targetType, doctorName, hospitalName }) => {
  const photo = img || noPhoto;

  let targetLabel = '';
  if (targetType === 'Doctor') {
    targetLabel = doctorName ? `лікаря: ${doctorName}` : 'лікаря';
  } else if (targetType === 'Hospital') {
    targetLabel = hospitalName ? `лікарню: "${hospitalName}"` : 'лікарню';
  }

  return (
    <div className="review">
      <div className="review-left">
        <img src={photo} alt={name} />
        <div className="author-info">
          <span className="name">{name}</span>
          <span className="age">{age} років</span>
        </div>
      </div>
      <div className="review-right">
        <div className="stars">{'✭'.repeat(stars)}</div>
        <div className="target">
          Відгук про  {targetLabel}
        </div>
        <p className="quote">"{quote}"</p>
      </div>
    </div>
  );
};

const Main = () => {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    fetchAllReviews()
      .then(data => {
        const lastSix = data.slice(-6); 
        setReviews(lastSix);
      })
      .catch(error => console.error("Не вдалося завантажити коментарі", error));
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const currentReview = reviews[current];

  return (
    <div className="homepage">

      <div className="banner">
        <div className="banner-graphic">
          <div className="ellipse">
            <img src={bannerImage} alt="Main banner" />
          </div>
        </div>
        <div className="banner-text">
          <h1 className="banner-title">Сучасна медична система для лікарів та пацієнтів</h1>
          <p className="banner-description">
            Записуйтеся до лікаря онлайн, зберігайте історію прийомів та отримуйте результати аналізів в один клік!
          </p>
          <div className="banner-buttons">
            <NavLink to={LOGIN_ROUTE}>
              <button className="join-btn">Приєднатися</button>
            </NavLink>
            <NavLink className="learn-more" to={ABOUTUS_ROUTE}>Дізнатися більше</NavLink>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-title">Що дає LifeLine?</h2>
        <div className="info-cards">
          <InfoCard icon={iconBooking} title="Онлайн-запис" text="Зручне бронювання без дзвінків та очікувань" />
          <InfoCard icon={iconHealth} title="Медична картка" text="Зберігайте історію хвороби в безпеці" />
          <InfoCard icon={iconReminder} title="Розклад лікарів" text="Переглядайте доступний графік роботи медичного персоналу" />
          <InfoCard icon={iconServices} title="Аналізи та результати" text="Переглядайте результати онлайн без візиту в лікарню" />
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Що кажуть наші користувачі?</h2>
        {reviews.length > 0 ? (
          <div className="review-wrapper">
            <div className="arrow arrow-left" onClick={prevReview}>‹</div>
            <ReviewCard
              img={currentReview.reviewer?.photo_url}
              name={currentReview.reviewer?.name}
              age={currentReview.reviewer?.age}
              stars={currentReview.rating}
              quote={currentReview.comment}
              targetType={currentReview.target_type}
              doctorName={
                currentReview.target_type === 'Doctor'
                  ? `${currentReview?.doctor?.last_name ?? ''} ${currentReview?.doctor?.first_name ?? ''}`.trim()
                  : null
              }
              hospitalName={
                currentReview.target_type === 'Hospital'
                  ? currentReview.hospital?.name
                  : null
              }
            />
            <div className="arrow arrow-right" onClick={nextReview}>›</div>
          </div>
        ) : (
          <p>Коментарі завантажуються...</p>
        )}
      </div>
    </div>
  );
};

export default Main;