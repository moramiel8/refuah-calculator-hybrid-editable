import React from "react";

interface BannerProps {
  title: string;
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ title, children }) => {
  return (
    <div className="relative h-48 overflow-hidden gradient-header md:h-56">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground drop-shadow-md md:text-4xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Banner;
