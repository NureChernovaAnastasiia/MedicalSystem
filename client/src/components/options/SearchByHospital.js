import React, { useState, useEffect } from "react";
import { fetchUniqueHospitalNames } from '../../http/doctorAPI';

const baseStyle = {
  width: "100%",
  padding: "12px",
  minWidth: "200px",
  fontFamily: "'Montserrat', sans-serif",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "18px",
  color: "#000",
  background: "#ffffff",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  outline: "none",
};

const glowStyle = {
  borderColor: "#00C3A1",
  boxShadow: "0 0 5px rgba(0, 195, 161, 0.5)",
};

const SearchByHospital = ({ value, onChange }) => {
  const [hospitals, setHospitals] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const hospitalData = await fetchUniqueHospitalNames();
        setHospitals(hospitalData);
      } catch (error) {
        console.error("Помилка при завантаженні лікарень:", error);
      }
    };
    loadHospitals();
  }, []);

  const combinedStyle = {
    ...baseStyle,
    ...(isFocused || isHovered ? glowStyle : {}),
  };

  return (
    <select
      style={combinedStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <option value="">Лікарня</option>
      {hospitals.map((hospital, index) => (
        <option key={index} value={hospital}>{hospital}</option>
      ))}
    </select>
  );
};

export default SearchByHospital;
