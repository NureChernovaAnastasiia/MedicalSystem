import React from 'react';
import logo from "../../img/Logo.png";
import doc from "../../img/Doctor.jpg";
import tech from "../../img/Technologies.png";
import iconLaptop from '../../img/icons/laptop.png';
import iconReduce from '../../img/icons/reduce.png';
import iconSecure from '../../img/icons/secure.png';
import '../../style/AboutUs.css';

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
        <div className="feature">
          <div className="feature-icon">
            <img src={iconLaptop} alt="Технологічність" />
          </div>
          <h3>Технологічність</h3>
          <p>Використовуємо найсучасніші IT-рішення для швидкої та безпечної роботи</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <img src={iconReduce} alt="Доступність" />
          </div>
          <h3>Доступність</h3>
          <p>Пацієнти можуть легко записатися на прийом та отримати результати аналізів онлайн</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <img src={iconSecure} alt="Безпека" />
          </div>
          <h3>Безпека</h3>
          <p>Захищені сервери та шифрування гарантують безпеку ваших даних</p>
        </div>
      </section>

      <section className="mission">
        <div className="header-box">
          <div className="rectangle">
          <h2>Наша місія та цінності</h2>
          </div>
        </div>
        <p className="quote">"Робити медицину простішою, швидшою та доступнішою для всіх!"</p>
        <div className="values">
          <div className="value-item">
            <div className="value-circle">
              <h3>Інновації</h3>
            </div>
            <p className="value-description">Ми постійно вдосконалюємо платформу для зручності користувачів</p>
          </div>
          <div className="value-item">
            <div className="value-circle">
              <h3>Якість</h3>
            </div>
            <p className="value-description">Ми співпрацюємо лише з кваліфікованими лікарями</p>
          </div>
          <div className="value-item">
            <div className="value-circle">
              <h3>Конфіденційність</h3>
            </div>
            <p className="value-description">Ваші медичні дані під надійним захистом</p>
          </div>
          <div className="value-item">
            <div className="value-circle">
              <h3>Підтримка</h3>
            </div>
            <p className="value-description">Ми завжди готові допомогти у вирішенні будь-яких питань</p>
          </div>
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
