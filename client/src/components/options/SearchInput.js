import React, { useState } from "react";
import { iconSearch } from "../../utils/icons";

const baseInputStyle = {
  width: "100%",
  padding: "12px 12px 12px 60px",
  fontFamily: "'Montserrat', sans-serif",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "18px",
  lineHeight: "1.75rem",
  color: "rgba(0, 0, 0, 0.6)",
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

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "20px",
    width: "30px",
    height: "30px",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
};

const SearchInput = ({
  value,
  onChange,
  placeholder = "Пошук...",
  icon = iconSearch,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const combinedInputStyle = {
    ...baseInputStyle,
    ...(isFocused || isHovered ? glowStyle : {}),
  };

  return (
    <div style={styles.wrapper}>
      <img src={icon} alt="Search Icon" style={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={combinedInputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
};

export default SearchInput;
