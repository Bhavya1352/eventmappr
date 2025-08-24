import React, { useState } from 'react';
import TouristPlacesSection from '../src/components/sections/TouristPlacesSection';

const TouristPlacesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search tourist places..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          <option value="historical">Historical</option>
          <option value="parks">Parks</option>
          <option value="museums">Museums</option>
          {/* Add more categories as needed */}
        </select>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>
      <TouristPlacesSection
        searchQuery={searchQuery}
        category={category}
        sortBy={sortBy}
      />
    </div>
  );
};

export default TouristPlacesPage;