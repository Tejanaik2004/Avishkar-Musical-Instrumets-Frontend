import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const debouncedSearch = useCallback(
    (value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          navigate(`/search?q=${encodeURIComponent(value.trim())}`);
          onSearch?.();
        }
      }, 500);
    },
    [navigate, onSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch?.();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div
        className="d-flex align-items-center rounded-pill overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(200, 164, 77, 0.3)',
          padding: '4px 6px',
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center px-3"
          style={{ color: 'var(--gray-400)' }}
        >
          <FiSearch size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="form-control border-0 bg-transparent"
          placeholder="Search for products..."
          value={query}
          onChange={handleChange}
          style={{
            color: 'var(--white)',
            fontSize: '0.9rem',
            padding: '10px 0',
            outline: 'none',
            boxShadow: 'none',
          }}
        />
        {query && (
          <button
            type="button"
            className="btn p-1 d-flex align-items-center justify-content-center"
            onClick={handleClear}
            style={{
              color: 'var(--gray-400)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <FiX size={16} />
          </button>
        )}
        <button
          type="submit"
          className="btn btn-sm px-3 py-1"
          style={{
            background: 'var(--primary)',
            color: 'var(--black)',
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '0.85rem',
            border: 'none',
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
