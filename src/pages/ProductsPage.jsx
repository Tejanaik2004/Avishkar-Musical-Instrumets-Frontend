import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const LoadingSkeleton = () => (
  <div className="row g-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="col-lg-3 col-md-4 col-6">
        <div className="card h-100 border-0" style={{ background: '#2a2a2a', borderRadius: '12px' }}>
          <div style={{ height: '220px', background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite', borderRadius: '12px 12px 0 0' }} />
          <div className="card-body">
            <div style={{ height: '14px', width: '80%', background: '#3a3a3a', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '12px', width: '50%', background: '#3a3a3a', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [brands, setBrands] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categoryId') ? [searchParams.get('categoryId')] : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [instrumentType, setInstrumentType] = useState(searchParams.get('instrumentType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const searchQuery = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage);
      params.set('size', 12);
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategories.length === 1) params.set('categoryId', selectedCategories[0]);
      if (selectedCategories.length > 1) params.set('categoryId', selectedCategories.join(','));
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (selectedBrand) params.set('brand', selectedBrand);
      if (instrumentType) params.set('instrumentType', instrumentType);
      if (sortBy) params.set('sort', sortBy);

      const response = await api.get(`/products?${params.toString()}`);
      const data = response.data;
      setProducts(data.content || data || []);
      setTotalPages(data.totalPages || 1);

      if (data.content) {
        const uniqueBrands = [...new Set((data.content || []).map((p) => p.brand).filter(Boolean))];
        if (uniqueBrands.length > 0) setBrands(uniqueBrands);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories, minPrice, maxPrice, selectedBrand, instrumentType, sortBy, currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch {
        // silent
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategories.length > 0) params.set('categoryId', selectedCategories.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (instrumentType) params.set('instrumentType', instrumentType);
    if (sortBy) params.set('sort', sortBy);
    if (currentPage > 0) params.set('page', currentPage);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategories, minPrice, maxPrice, selectedBrand, instrumentType, sortBy, currentPage, setSearchParams]);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(String(catId)) ? prev.filter((c) => c !== String(catId)) : [...prev, String(catId)]
    );
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setInstrumentType('');
    setSortBy('');
    setCurrentPage(0);
    setSearchParams({}, { replace: true });
  };

  const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice || selectedBrand || instrumentType || sortBy;

  const FilterSidebar = () => (
    <div className="p-4" style={{ background: '#222', borderRadius: '12px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0" style={{ color: '#c9a84c' }}>
          <FiFilter className="me-2" />Filters
        </h5>
        {hasFilters && (
          <button className="btn btn-sm" onClick={clearFilters} style={{ color: '#e74c3c' }}>
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Category</h6>
        {categories.map((cat) => (
          <div key={cat.id} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id={`cat-${cat.id}`}
              checked={selectedCategories.includes(String(cat.id))}
              onChange={() => toggleCategory(cat.id)}
              style={{ borderColor: '#c9a84c' }}
            />
            <label className="form-check-label" htmlFor={`cat-${cat.id}`} style={{ color: '#d4c9a8' }}>
              {cat.name}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Price Range</h6>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(0); }}
            style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444' }}
          />
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(0); }}
            style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444' }}
          />
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Brand</h6>
          <select
            className="form-select form-select-sm"
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(0); }}
            style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444' }}
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {/* Instrument Type */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Instrument Type</h6>
        {['Traditional', 'Modern'].map((type) => (
          <div key={type} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="instrumentType"
              id={`type-${type}`}
              checked={instrumentType === type}
              onChange={() => { setInstrumentType(instrumentType === type ? '' : type); setCurrentPage(0); }}
              style={{ borderColor: '#c9a84c' }}
            />
            <label className="form-check-label" htmlFor={`type-${type}`} style={{ color: '#d4c9a8' }}>
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div className="mb-3">
        <h6 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Sort By</h6>
        <select
          className="form-select form-select-sm"
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
          style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444' }}
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>Products</li>
            {searchQuery && <li className="breadcrumb-item active" style={{ color: '#888' }}>Search: "{searchQuery}"</li>}
          </ol>
        </nav>

        <div className="row">
          {/* Desktop Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Mobile Filter Toggle */}
            <div className="d-lg-none mb-3">
              <button
                className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{ background: '#2a2a2a', color: '#c9a84c', border: '1px solid #c9a84c', borderRadius: '8px' }}
              >
                <FiFilter /> Filters {hasFilters && <span className="badge" style={{ background: '#c9a84c', color: '#1a1a1a' }}>Active</span>}
              </button>
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="d-lg-none mb-4 overflow-hidden"
              >
                <FilterSidebar />
              </motion.div>
            )}

            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="mb-0" style={{ color: '#888' }}>
                {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="d-none d-md-inline" style={{ color: '#888', fontSize: '0.9rem' }}>Sort:</span>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
                  style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444', minWidth: '160px' }}
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <LoadingSkeleton />
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
                <FiSearch size={64} style={{ color: '#444' }} className="mb-3" />
                <h4 style={{ color: '#f5f0e1' }}>No products found</h4>
                <p style={{ color: '#888' }}>Try adjusting your filters or search terms.</p>
                <button className="btn mt-2" onClick={clearFilters} style={{ background: '#c9a84c', color: '#1a1a1a' }}>
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="row g-4"
              >
                {products.map((product) => (
                  <div key={product.id} className="col-lg-3 col-md-4 col-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <button
                  className="btn btn-sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  style={{
                    background: currentPage === 0 ? '#333' : '#2a2a2a',
                    color: currentPage === 0 ? '#666' : '#c9a84c',
                    border: '1px solid #444',
                  }}
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className="btn btn-sm"
                    onClick={() => setCurrentPage(i)}
                    style={{
                      background: currentPage === i ? '#c9a84c' : '#2a2a2a',
                      color: currentPage === i ? '#1a1a1a' : '#f5f0e1',
                      border: '1px solid #444',
                      minWidth: '36px',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{
                    background: currentPage >= totalPages - 1 ? '#333' : '#2a2a2a',
                    color: currentPage >= totalPages - 1 ? '#666' : '#c9a84c',
                    border: '1px solid #444',
                  }}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
