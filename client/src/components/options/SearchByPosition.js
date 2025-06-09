import React, { useState, useEffect } from "react";
import { fetchUniqueHospitalPositions } from "../../http/hospitalStaffAPI";

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

const SearchByPosition = ({ value, onChange }) => {
  const [positions, setPositions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const posData = await fetchUniqueHospitalPositions();
        setPositions(posData);
      } catch (error) {
        console.error("Помилка при завантаженні посад:", error);
      }
    };
    loadPositions();
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
      <option value="">Посада</option>
      {positions.map((pos, index) => (
        <option key={index} value={pos}>{pos}</option>
      ))}
    </select>
  );
};

export default SearchByPosition;
