import React from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1.5">
      <FaGlobe className="text-gray-400 text-sm" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="text-sm text-gray-600 bg-transparent border-none outline-none cursor-pointer font-medium"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
