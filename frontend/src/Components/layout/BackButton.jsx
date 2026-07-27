import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label = "Back" }) => {
  const navigate = useNavigate();
  const go = () => (to ? navigate(to) : navigate(-1));
  return (
    <button className="sh-back" onClick={go} aria-label="Go back">
      ← {label}
    </button>
  );
};

export default BackButton;