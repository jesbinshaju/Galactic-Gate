import React, { useState } from 'react';

// Filter component for auction discovery
// Connects to GET /api/auctions?filters=... endpoint
const AuctionFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    spice: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    endingSoon: false,
    sortBy: 'endTime',
    ...initialFilters
  });

  const spiceTypes = ['cardamom', 'pepper', 'clove', 'nutmeg', 'cinnamon', 'vanilla'];
  const locations = ['Idukki', 'Wayanad', 'Kottayam', 'Thrissur', 'Palakkad', 'Kozhikode'];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      spice: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      endingSoon: false,
      sortBy: 'endTime'
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Auctions</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spice Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Spice Type</label>
          <select
            value={filters.spice}
            onChange={(e) => handleFilterChange('spice', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Spices</option>
            {spiceTypes.map(spice => (
              <option key={spice} value={spice} className="capitalize">
                {spice}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-1">Min Price (₹)</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Price (₹)</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="10000"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {/* Ending Soon */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.endingSoon}
            onChange={(e) => handleFilterChange('endingSoon', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Ending Soon (&lt; 24h)</span>
        </label>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="p-1 border rounded text-sm"
          >
            <option value="endTime">Ending Soon</option>
            <option value="price">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Bids</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || value === false || key === 'sortBy') return null;
          
          return (
            <span
              key={key}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {key === 'endingSoon' ? 'Ending Soon' : `${key}: ${value}`}
              <button
                onClick={() => handleFilterChange(key, key === 'endingSoon' ? false : '')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default AuctionFilters;