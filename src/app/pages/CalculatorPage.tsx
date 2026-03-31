import React from "react";
import CalculatorTabs from "@/features/calculator/ui/CalculatorTabs";
import { ContentContainer, PageTransition } from "@/shared/ui";

const CalculatorPage: React.FC = () => (
  <PageTransition>
    <ContentContainer className="max-w-[1600px] flex-1 py-3 md:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-1 sm:px-3">
        <CalculatorTabs />
      </div>
    </ContentContainer>
  </PageTransition>
);

export default CalculatorPage;
