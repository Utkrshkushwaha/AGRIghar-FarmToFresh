import React from "react";
import { FaCheckCircle, FaCircle, FaTruck, FaBoxOpen, FaClipboardCheck } from "react-icons/fa";

const STEPS = [
  { key: "pending",    label: "Order Placed",  icon: FaClipboardCheck },
  { key: "confirmed",  label: "Confirmed",     icon: FaCheckCircle },
  { key: "dispatched", label: "Dispatched",    icon: FaTruck },
  { key: "delivered",  label: "Delivered",     icon: FaBoxOpen },
];

const OrderStatusStepper = ({ status }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center justify-between w-full py-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isDone    = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isDone
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-gray-100 text-gray-400"
              } ${isCurrent ? "ring-4 ring-primary-100 scale-110" : ""}`}>
                <Icon className="text-sm" />
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                isDone ? "text-primary-700" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`h-1 flex-1 mx-1 rounded-full transition-all ${
                index < currentIndex ? "bg-primary-500" : "bg-gray-200"
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
