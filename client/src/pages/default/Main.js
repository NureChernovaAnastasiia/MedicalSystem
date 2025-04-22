import React, { useState } from 'react';
import '../../style/Main.css';
import logo from '../../img/Logo.png';
import bannerImage from '../../img/Healthcare.png';

import iconBooking from '../../img/icons/cellphone.png';
import iconCard from '../../img/icons/medical.png';
import iconReminder from '../../img/icons/reminder.png';
import iconAnalysis from '../../img/icons/analysis.png';

import avatar1 from '../../img/Woman1.jpg'; // додай свої аватари
import avatar2 from '../../img/Woman1.jpg';

const reviews = [
    {
      img: avatar1,
      name: 'Анна К.',
      age: '32 роки',
      stars: 5,
      quote: 'Дуже зручно! Записалася до лікаря за хвилину і отримала нагадування про прийом. Більше не потрібно дзвонити в клініку!'
    },
    {
      img: avatar2,
      name: 'Ігор С.',
      age: '45 років',
      stars: 4,
      quote: 'Зберігати медичну картку стало набагато простіше. Усе в одному місці!'
    }
  ];

const HomePage = () => {
    const [current, setCurrent] = useState(0);

  const nextReview = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const { img, name, age, stars, quote } = reviews[current];
  return (
    <div className="homepage">
      {/* Головний банер */}
<div className="banner">
  <div className="banner-graphic">
    <div className="ellipse">
      <img src={bannerImage} alt="Main banner" />
    </div>
    {/* Якщо хочеш залишити логотип — прибери display: none у стилях */}
    <div className="logo-in-banner">
      <img src={logo} alt="Logo in banner" />
    </div>
  </div>
  <div className="banner-text">
    <h1 className="banner-title">Сучасна медична система для лікарів та пацієнтів</h1>
    <p className="banner-description">
      Записуйтеся до лікаря онлайн, зберігайте історію прийомів та отримуйте результати аналізів в один клік!
    </p>
    <div className="banner-buttons">
      <button className="join-btn">Приєднатися</button>
      <a href="#" className="learn-more">Дізнатися більше</a>
    </div>
  </div>
</div>

      {/* Інформаційна секція */}
      <div className="info-section">
        <h2 className="info-title">Що дає LifeLine?</h2>
        <div className="info-cards">
          <div className="card">
          <h3 className="card-title">Онлайн-запис</h3>
            <img
              src={iconBooking}
              alt="Онлайн-запис"
              className="card-icon"
            />
            <p className="card-text">Зручне бронювання без дзвінків та очікувань</p>
          </div>

          <div className="card">
            <h3 className="card-title">Медична картка</h3>
            <img
              src={iconCard}
              alt="Медична картка"
              className="card-icon"
            />
            <p className="card-text">Зберігайте історію хвороби в безпеці</p>
          </div>

          <div className="card">
            <h3 className="card-title">Нагадування</h3>
            <img
              src={iconReminder}
              alt="Нагадування"
              className="card-icon"
            />
            <p className="card-text">Отримуйте автоматичні нагадування про прийоми</p>
          </div>

          <div className="card">
            <h3 className="card-title">Аналізи та результати</h3>
            <img
              src={iconAnalysis}
              alt="Аналізи"
              className="card-icon"
            />
            <p className="card-text">Переглядайте результати онлайн без візиту в лікарню</p>
          </div>
        </div>
      </div>

      {/* Відгуки користувачів */}
      <div className="reviews-section">
      <h2 className="reviews-title">Що кажуть наші користувачі?</h2>
      <div className="review">
        <div className="review-left">
          <img src={img} alt={name} />
          <div className="author">{name}</div>
          <div className="author">{age}</div>
        </div>
        <div className="review-right">
          <div className="stars">{'⭐'.repeat(stars)}</div>
          <p className="quote">"{quote}"</p>
        </div>
      </div>
      <div className="arrow-left" onClick={prevReview}>‹</div>
      <div className="arrow-right" onClick={nextReview}>›</div>
    </div>
    </div>
  );
};

export default HomePage;
