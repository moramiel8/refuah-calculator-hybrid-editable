import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default Grid;
