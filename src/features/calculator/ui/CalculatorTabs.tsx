import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, GraduationCap, FileCheck } from "lucide-react";
import SechemCalculator from "./SechemCalculator";
import BagrutCalculator from "./BagrutCalculator";
import FinalGradeCalculator from "./FinalGradeCalculator";

type TabKey = "sechem" | "bagrut" | "finalGrade";

type IconComponent = React.ComponentType<{ className?: string }>;

const tabs: { key: TabKey; label: string; icon: IconComponent }[] = [
  { key: "sechem", label: "מחשבון סכמים", icon: Calculator },
  { key: "bagrut", label: "ממוצע בגרות", icon: GraduationCap },
  { key: "finalGrade", label: "ציון סופי", icon: FileCheck },
];

const CalculatorTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("sechem");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="mb-6 flex w-full min-w-0 gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "sechem" ? -12 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "sechem" ? 12 : -12 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="w-full min-w-0"
        >
          {activeTab === "sechem" && <SechemCalculator />}
          {activeTab === "bagrut" && <BagrutCalculator />}
          {activeTab === "finalGrade" && <FinalGradeCalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalculatorTabs;
