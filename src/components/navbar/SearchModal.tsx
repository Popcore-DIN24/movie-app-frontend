// components/SearchModal.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./searchModal.css"

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    ageGroup: "",
    actor: "",
    city: "",
    cinema: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSearch(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{t("searchMovies")}</h2>

        <input
          name="title"
          placeholder={t("movieTitle") || "Movie Title"}
          value={filters.title}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder={t("category") || "Category"}
          value={filters.category}
          onChange={handleChange}
        />

        <input
          name="ageGroup"
          placeholder={t("ageGroup") || "Age Group"}
          value={filters.ageGroup}
          onChange={handleChange}
        />

        <input
          name="actor"
          placeholder={t("actor") || "Actor"}
          value={filters.actor}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder={t("city") || "City"}
          value={filters.city}
          onChange={handleChange}
        />

        <input
          name="cinema"
          placeholder={t("cinema") || "Cinema"}
          value={filters.cinema}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>{t("search")}</button>
          <button onClick={onClose}>{t("close")}</button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
