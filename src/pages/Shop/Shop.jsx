import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useOrder } from '../../context/OrderContext';
import { categories, brands } from '../../data/products';
import './Shop.css';

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
];

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $75', min: 0, max: 75 },
    { label: '$75 – $120', min: 75, max: 120 },
    { label: '$120 – $160', min: 120, max: 160 },
    { label: '$160+', min: 160, max: Infinity },
];

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { adminProducts } = useOrder();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
    const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [filterOpen, setFilterOpen] = useState(false);
    const [showSaleOnly, setShowSaleOnly] = useState(searchParams.get('sale') === 'true');

    const filteredAndSorted = useCallback(() => {
        let result = [...adminProducts];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (selectedBrand !== 'All') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        if (showSaleOnly) {
            result = result.filter(p => p.discount > 0);
        }

        const { min, max } = PRICE_RANGES[selectedPriceIdx];
        result = result.filter(p => p.price >= min && p.price <= max);

        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
            case 'newest': result.sort((a, b) => b.id - a.id); break;
        }

        return result;
    }, [adminProducts, search, selectedCategory, selectedBrand, selectedPriceIdx, sortBy, showSaleOnly]);

    const results = filteredAndSorted();

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('All');
        setSelectedBrand('All');
        setSelectedPriceIdx(0);
        setSortBy('featured');
        setShowSaleOnly(false);
        setSearchParams({});
    };

    const hasFilters = search || selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPriceIdx !== 0 || showSaleOnly;

    return (
        <div className="shop-page page-enter">
            <div className="container">
                {/* Header */}
                <div className="shop-header">
                    <div>
                        <h1 className="shop-title heading-display">
                            {selectedCategory !== 'All' ? selectedCategory : 'All Shoes'}
                        </h1>
                        <p className="shop-subtitle">
                            {results.length} products found
                            {selectedBrand !== 'All' && ` in ${selectedBrand}`}
                        </p>
                    </div>
                    <div className="shop-header-actions">
                        <div className="search-bar-shop">
                            <Search size={16} className="search-bar-icon" />
                            <input
                                type="text"
                                placeholder="Search shoes..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="search-bar-input"
                                id="shop-search-input"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="search-clear">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div className="sort-wrapper">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="select"
                                id="sort-select"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                id="grid-view-btn"
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                id="list-view-btn"
                            >
                                <LayoutList size={16} />
                            </button>
                        </div>
                        <button
                            className={`btn btn-ghost filter-toggle-btn ${filterOpen ? 'filter-open' : ''}`}
                            onClick={() => setFilterOpen(p => !p)}
                            id="filter-toggle-btn"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="shop-layout">
                    {/* Filter Sidebar */}
                    <aside className={`shop-filters ${filterOpen ? 'filters-open' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            {hasFilters && (
                                <button className="clear-filters-btn" onClick={clearFilters}>
                                    <X size={13} /> Clear all
                                </button>
                            )}
                        </div>

                        {/* Category */}
                        <div className="filter-group">
                            <h4 className="filter-group-title">Category</h4>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                        id={`filter-cat-${cat}`}
                                    >
                                        {cat}
                                        {selectedCategory === cat && <span className="filter-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="filter-group">
                            <h4 className="filter-group-title">Brand</h4>
                            <div className="filter-options">
                                {brands.map(brand => (
                                    <button
                                        key={brand}
                                        className={`filter-option ${selectedBrand === brand ? 'active' : ''}`}
                                        onClick={() => setSelectedBrand(brand)}
                                        id={`filter-brand-${brand}`}
                                    >
                                        {brand}
                                        {selectedBrand === brand && <span className="filter-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="filter-group">
                            <h4 className="filter-group-title">Price Range</h4>
                            <div className="filter-options">
                                {PRICE_RANGES.map((range, i) => (
                                    <button
                                        key={i}
                                        className={`filter-option ${selectedPriceIdx === i ? 'active' : ''}`}
                                        onClick={() => setSelectedPriceIdx(i)}
                                        id={`filter-price-${i}`}
                                    >
                                        {range.label}
                                        {selectedPriceIdx === i && <span className="filter-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sale */}
                        <div className="filter-group">
                            <h4 className="filter-group-title">Promotions</h4>
                            <label className="filter-toggle-label">
                                <div className={`filter-toggle ${showSaleOnly ? 'on' : ''}`} onClick={() => setShowSaleOnly(p => !p)}>
                                    <div className="filter-toggle-knob" />
                                </div>
                                <span>On Sale Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="shop-products">
                        {/* Active Filters */}
                        {hasFilters && (
                            <div className="active-filters">
                                {search && (
                                    <span className="active-filter">
                                        "{search}" <button onClick={() => setSearch('')}><X size={11} /></button>
                                    </span>
                                )}
                                {selectedCategory !== 'All' && (
                                    <span className="active-filter">
                                        {selectedCategory} <button onClick={() => setSelectedCategory('All')}><X size={11} /></button>
                                    </span>
                                )}
                                {selectedBrand !== 'All' && (
                                    <span className="active-filter">
                                        {selectedBrand} <button onClick={() => setSelectedBrand('All')}><X size={11} /></button>
                                    </span>
                                )}
                                {showSaleOnly && (
                                    <span className="active-filter sale-filter">
                                        Sale <button onClick={() => setShowSaleOnly(false)}><X size={11} /></button>
                                    </span>
                                )}
                                <button className="clear-filters-inline" onClick={clearFilters}>Clear All</button>
                            </div>
                        )}

                        {results.length === 0 ? (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search query</p>
                                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
                                {results.map((product, i) => (
                                    <div key={product.id} style={{ animationDelay: `${(i % 8) * 0.05}s` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
