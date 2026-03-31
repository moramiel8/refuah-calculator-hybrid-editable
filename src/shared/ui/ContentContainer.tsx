import React from "react";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto flex min-h-[calc(100svh-18.5rem)] max-w-[920px] flex-col px-5 py-8 animate-fade-in md:min-h-[calc(100svh-19rem)] md:px-6 md:py-10 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default ContentContainer;
