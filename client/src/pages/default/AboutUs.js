import React from 'react';
import '../../style/Main.css';

const Main = () => {
  

  return (
    <div className="homepage">

      {/* Головний банер */}
      <div className="banner">
        <div className="banner-graphic">
          <div className="ellipse">
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

    </div>
  );
};

export default Main;