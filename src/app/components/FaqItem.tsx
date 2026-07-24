"use client";

import { useState, type ReactNode } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

interface Faq {
  question: string;
  answer: ReactNode;
}

interface FaqItemProps {
  faqs: Faq[];
}

function FaqRow({ question, answer, isLast }: Faq & { isLast: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`w-full block ${!isLast ? "border-b border-black/10" : ""}`}
    >
      {/* HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left gap-4"
      >
        <h3
          className={`text-black text-2xl transition-all duration-300 ease-out ${
            isOpen ? "font-semibold" : "font-medium"
          }`}
        >
          {question}
        </h3>

        <RiArrowDownSLine
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180 text-black" : "rotate-0 text-black/50"
          }`}
        />
      </button>

      {/* KONTEN */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-black/70 text-lg leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqItem({ faqs }: FaqItemProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {faqs.map((faq, i) => (
        <FaqRow
          key={i}
          question={faq.question}
          answer={faq.answer}
          isLast={i === faqs.length - 1}
        />
      ))}
    </div>
  );
}
