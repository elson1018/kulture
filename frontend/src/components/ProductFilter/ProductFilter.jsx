import React from 'react';
import './ProductFilter.css';

const ProductFilter = ({ filters, onFilterChange, onClearFilters }) => {

    // Handle category checkbox changes
    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)  // Remove if already selected
            : [...filters.categories, category];              // Add if not selected

        // Update the parent component with new filter state
        onFilterChange({ ...filters, categories: newCategories });
    };

    // Updates either min or max price based on which input changed
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        let numValue;

        // Handle empty input
        if (value === '') {
            numValue = name === 'min' ? 0 : 10000;
        } else {
            numValue = parseFloat(value) || 0;
        }

        onFilterChange({
            ...filters,
            priceRange: {
                ...filters.priceRange,
                [name]: numValue
            }
        });
    };


    // Updates the sortBy value in the filter state
    const handleSortChange = (e) => {
        onFilterChange({ ...filters, sortBy: e.target.value });
    };

    // Check if any filters are currently active
    // Used to show/hide the "Clear All" button
    const hasActiveFilters =
        filters.categories.length > 0 ||          // Any categories selected
        filters.priceRange.min > 0 ||             // Min price set
        filters.priceRange.max < 10000 ||         // Max price changed from default
        filters.sortBy !== 'default';             // Sort option changed

    return (
        <div className="product-filter">
            {/* Filter Header with Clear All button */}
            <div className="filter-header">
                <h2>Filters</h2>
                {/* Only show Clear All button when filters are active */}
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={onClearFilters}>
                        Clear All
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="filter-section">
                <h3>Category</h3>
                <div className="filter-options">
                    {/* Loop through each category and create a checkbox */}
                    {['Food', 'Instruments', 'Souvenirs', 'Tutorials'].map(category => (
                        <label key={category} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
                <h3>Price Range</h3>
                <div className="price-inputs">
                    <div className="price-input-group">
                        <label>Minimum (RM)</label>
                        <input
                            type="number"
                            name="min"
                            value={filters.priceRange.min === 0 ? '' : filters.priceRange.min}
                            onChange={handlePriceChange}
                            min="0"
                            placeholder="0"
                        />
                    </div>
                    <div className="price-input-group">
                        <label>Maximum (RM)</label>
                        <input
                            type="number"
                            name="max"
                            value={filters.priceRange.max === 10000 ? '' : filters.priceRange.max}
                            onChange={handlePriceChange}
                            min="0"
                            placeholder="10000"
                        />
                    </div>
                </div>
            </div>

            {/* Sort By */}
            <div className="filter-section">
                <h3>Sort By</h3>
                <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="sort-select"
                >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="name">Name: A to Z</option>
                </select>
            </div>
        </div>
    );
};

export default ProductFilter;
