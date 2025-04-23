import React, { useState, useEffect  } from 'react';
import { NavLink } from "react-router-dom";
import { ABOUTUS_ROUTE, LOGIN_ROUTE } from '../../utils/consts';
import '../../style/Main.css';

import bannerImage from '../../img/Healthcare.png';
import iconBooking from '../../img/icons/cellphone.png';
import iconCard from '../../img/icons/medical.png';
import iconReminder from '../../img/icons/reminder.png';
import iconAnalysis from '../../img/icons/analysis.png';
import avatar1 from '../../img/Woman1.jpg';
import avatar2 from '../../img/Man1.jpg';
import avatar3 from '../../img/Woman2.jpg';
import avatar4 from '../../img/Man2.jpg';

const reviews = [
  {
    img: avatar1,
    name: 'Анна К.',
    age: '42 роки',
    stars: 5,
    quote: 'Дуже зручно! Записалася до лікаря за хвилину і отримала нагадування про прийом. Більше не потрібно дзвонити в клініку!'
  },
  {
    img: avatar2,
    name: 'Ігор С.',
    age: '35 років',
    stars: 4,
    quote: 'Зберігати медичну картку стало набагато простіше. Усе в одному місці! І найголовніше — я завжди маю доступ до результатів аналізів незалежно від того, де я знаходжусь.'
  },
  {
    img: avatar3,
    name: 'Марина Т.',
    age: '27 років',
    stars: 5,
    quote: 'Це справжня революція у сфері медицини! Я більше не боюсь забути про візит — система завжди нагадує вчасно. А ще можна легко переглянути історію всіх прийомів і порад лікаря.'
  },
  {
    img: avatar4,
    name: 'Олег М.',
    age: '47 років',
    stars: 4,
    quote: 'Інтерфейс зручний, навіть для тих, хто не дуже дружить із технологіями. Завдяки додатку я швидко знайшов хорошого спеціаліста і зберіг усі аналізи в одному місці. Хотілося б ще додати можливість відеоконсультацій.'
  }
];

const InfoCard = ({ icon, title, text }) => (
  <div className="card">
    <h3 className="card-title">{title}</h3>
    <img src={icon} alt={title} className="card-icon" />
    <p className="card-text">{text}</p>
  </div>
);

const ReviewCard = ({ img, name, age, stars, quote }) => (
  <div className="review">
    <div className="review-left">
      <img src={img} alt={name} />
      <div className="author-info">
        <span className="name">{name}</span>
        <span className="age">{age}</span>
      </div>
    </div>
    <div className="review-right">
      <div className="stars">{'⭐'.repeat(stars)}</div>
      <p className="quote">"{quote}"</p>
    </div>
  </div>
);

const Main = () => {
  const [current, setCurrent] = useState(0);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  const { img, name, age, stars, quote } = reviews[current];

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
          <InfoCard icon={iconCard} title="Медична картка" text="Зберігайте історію хвороби в безпеці" />
          <InfoCard icon={iconReminder} title="Нагадування" text="Отримуйте автоматичні нагадування про прийоми" />
          <InfoCard icon={iconAnalysis} title="Аналізи та результати" text="Переглядайте результати онлайн без візиту в лікарню" />
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Що кажуть наші користувачі?</h2>
        <div className="review-wrapper">
          <div className="arrow arrow-left" onClick={prevReview}>‹</div>
          <ReviewCard img={img} name={name} age={age} stars={stars} quote={quote} />
          <div className="arrow arrow-right" onClick={nextReview}>›</div>
        </div>
      </div>

    </div>
  );
};

export default Main;