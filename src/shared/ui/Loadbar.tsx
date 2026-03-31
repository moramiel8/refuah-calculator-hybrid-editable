import React from "react";

interface LoadbarProps {
  small?: boolean;
}

const Loadbar: React.FC<LoadbarProps> = ({ small }) => {
  return (
    <div className={`flex items-center justify-center ${small ? "py-3" : "py-16"}`}>
      <div
        className={`animate-spin rounded-full border-2 border-muted border-t-primary ${
          small ? "h-5 w-5" : "h-8 w-8"
        }`}
      />
    </div>
  );
};

export default Loadbar;
