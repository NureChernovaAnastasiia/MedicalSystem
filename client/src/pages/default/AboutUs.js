import React from 'react';
import logo from "../../img/Logo.png";
import doc from "../../img/Doctor.jpg";
import tech from "../../img/Technologies.png";
import { iconLaptop, iconReduce, iconSecure } from "../../utils/icons";
import '../../style/default/AboutUs.css';

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature">
    <div className="feature-icon">
      <img src={icon} alt={title} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const ValueCard = ({ title, description }) => (
  <div className="value-item">
    <div className="value-circle">
      <h3>{title}</h3>
    </div>
    <p className="value-description">{description}</p>
  </div>
);

const AboutUs = () => {
  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="hero-text">
          <h1>LifeLine – </h1>
          <h3>цифрове рішення для медицини</h3>
          <p>Наша місія – зробити медичні послуги доступними, зручними та інноваційним</p>
        </div>
        <div className="hero-image">
          <img src={doc} alt="Doctor" />
        </div>
      </section>

      <section className="who-we-are">
        <div className="header-box">
          <div className="rectangle">
            <h2>Хто ми такі?</h2>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="logo-container">
            <img src={logo} alt="LifeLine Logo" className="logo" />
          </div>
          <p className="description">
            LifeLine – це сучасна медична інформаційна система, яка спрощує взаємодію між лікарями та пацієнтами. Ми прагнемо зробити медичні послуги доступнішими та зручнішими завдяки цифровим технологіям.
          </p>
        </div>
      </section>

      <section className="features">
        <FeatureCard icon={iconLaptop} title="Технологічність" description="Використовуємо найсучасніші IT-рішення для швидкої та безпечної роботи" />
        <FeatureCard icon={iconReduce} title="Доступність" description="Пацієнти можуть легко записатися на прийом та отримати результати аналізів онлайн" />
        <FeatureCard icon={iconSecure} title="Безпека" description="Захищені сервери та шифрування гарантують безпеку ваших даних" />
      </section>

      <section className="mission">
        <div className="header-box">
          <div className="rectangle">
            <h2>Наша місія та цінності</h2>
          </div>
        </div>
        <p className="quote">"Робити медицину простішою, швидшою та доступнішою для всіх!"</p>
        <div className="values">
          <ValueCard title="Інновації" description="Ми постійно вдосконалюємо платформу для зручності користувачів" />
          <ValueCard title="Якість" description="Ми співпрацюємо лише з кваліфікованими лікарями" />
          <ValueCard title="Конфіденційність" description="Ваші медичні дані під надійним захистом" />
          <ValueCard title="Підтримка" description="Ми завжди готові допомогти у вирішенні будь-яких питань" />
        </div>
      </section>

      <section className="why-lifeline">
        <div className="header-box">
          <div className="rectangle">
            <h2>Чому LifeLine – це правильний вибір?</h2>
          </div>
        </div>
        <div className="content">
          <div className="image">
            <img src={tech} alt="Сучасні технології" />
          </div>
          <div className="reasons">
            <p><strong>Досвід у сфері eHealth</strong> – Наша команда має багаторічний досвід у розробці медичних IT-рішень</p>
            <p><strong>Підтримка 24/7</strong> – Наші консультанти готові допомогти вам у будь-який час</p>
            <p><strong>Швидкість роботи</strong> – Жодних черг – все онлайн, швидко та зручно</p>
            <p><strong>Лояльність користувачів</strong> – 95% наших клієнтів задоволені сервісом!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
