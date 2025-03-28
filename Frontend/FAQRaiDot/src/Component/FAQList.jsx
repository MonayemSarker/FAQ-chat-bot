import React from "react";

const FAQList = ({ faqs, onFAQClick }) => {
  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => (
        <div
          key={faq.id || index}
          onClick={() => onFAQClick(faq)}
          className="p-3 bg-gray-100 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors group"
        >
          <div className="flex items-center">
            <p className="text-sm font-medium group-hover:text-blue-800">
              {index + 1}. {faq.question}
            </p>
          </div>
        </div>
      ))}
      {faqs.length === 0 && (
        <div className="text-center text-gray-500 p-4">No FAQs found</div>
      )}
    </div>
  );
};

export default FAQList;
