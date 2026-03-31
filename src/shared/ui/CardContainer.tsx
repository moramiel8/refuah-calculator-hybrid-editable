import React from "react";

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, className = "", onClick, style }) => {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default CardContainer;
