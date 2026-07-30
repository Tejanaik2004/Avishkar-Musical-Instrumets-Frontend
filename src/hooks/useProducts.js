import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useProducts = (initialPage = 1, initialLimit = 12) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });

      const response = await api.get('/api/products', { params });
      const data = response.data;

      setProducts(data.products || data.items || data.data || []);
      setTotalPages(data.totalPages || data.totalPages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchQuery, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const search = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const filter = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    setPage,
    search,
    filter,
    refetch,
  };
};

export default useProducts;
