import React from 'react';
import { NavLink } from "react-router-dom";
import { LOGIN_ROUTE } from '../../utils/consts';
import online from "../../img/Fromhome.jpg";
import card from "../../img/Medicalcard.jpg";
import med from "../../img/Medicine.png";
import analis from "../../img/Analisys.jpeg";
import '../../style/default/Services.css';

const ServiceItem = ({ imgSrc, alt, title, desc, className }) => (
  <>
    <img src={imgSrc} alt={alt} className={`service-img ${className}`} />
    <div className={`service-info ${className}`}>
      <h4 className="service-title">{title}</h4>
      <p className="service-desc">{desc}</p>
    </div>
  </>
);

const Services = () => {
  return (
    <section className="servicess">
      <div className="services-header">
        <h2 className="services-title">Послуги LifeLine – швидка та зручна медицина онлайн</h2>
        <p className="services-subtitle">Доступ до якісних медичних послуг без черг та зайвих витрат часу!</p>
      </div>

      <div className="services-intro-wrapper">
        <div className="services-intro">
            <h3 className="services-intro-title">Що ми пропонуємо?</h3>
        </div>
        </div>

      <div className="service-group">
        <ServiceItem
          imgSrc={online}
          alt="Онлайн-запис"
          title="Онлайн-запис до лікаря"
          desc="Запишіться на прийом у будь-який зручний для вас час."
          className="first"
        />
        <ServiceItem
          imgSrc={card}
          alt="Медична картка"
          title="Електронна медична картка"
          desc="Ваші медичні дані завжди під рукою."
          className="second"
        />
      </div>

      <div className="service-group">
        <ServiceItem
          imgSrc={med}
          alt="Призначення ліків"
          title="Призначення ліків"
          desc="Лікар може призначати вам ліки онлайн, а ви отримаєте рецепт у своєму кабінеті."
          className="third"
        />
        <ServiceItem
          imgSrc={analis}
          alt="Аналізи"
          title="Замовлення та перегляд аналізів"
          desc="Замовляйте лабораторні дослідження та переглядайте результати у вашому акаунті."
          className="fourth"
        />
      </div>

      <div className="get-started">
        <p className="get-started-text">Готові скористатися зручними медичними послугами?</p>
        <NavLink to={LOGIN_ROUTE}>
            <button className="get-started-btn">Розпочати</button>
        </NavLink>
      </div>
    </section>
  );
};

export default Services;
