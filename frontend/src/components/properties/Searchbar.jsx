import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Popular locations and transaction types suggestions
  const popularLocations = [
    // 'Mumbai','Goa','Jaipur','Ahmedabad'
  ];
  
  const transactionTypes = ['Buy', 'Rent', 'Lease'];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Update recent searches
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search by location, address, city, state, pincode or transaction type (buy/rent/lease)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={toggleSuggestions}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-20 py-3 rounded-lg border border-gray-200 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
            transition-all text-gray-800 placeholder-gray-400 cursor-pointer"
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 
            text-gray-400 h-5 w-5 cursor-pointer" 
          onClick={toggleSuggestions}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              type="button"
              onClick={clearSearch}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 
                hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg 
              hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
              shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {recentSearches.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Recent Searches
                </h3>
                {recentSearches.map((query, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => {
                      setSearchQuery(query);
                      handleSearch(query);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    {query}
                  </button>
                ))}
              </div>
            )}

            {transactionTypes.length > 0 && (
              <div className="border-t border-gray-100 p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Transaction Types
                </h3>
                {transactionTypes.map((type, index) => (
                  <button
                    key={`type-${index}`}
                    onClick={() => {
                      setSearchQuery(type);
                      handleSearch(type);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700"
                  >
                    <Home className="h-4 w-4 text-gray-400" />
                    {type}
                  </button>
                ))}
              </div>
            )}

            {popularLocations.length > 0 && (
              <div className="border-t border-gray-100 p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Popular Locations
                </h3>
                {popularLocations.map((location, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => {
                      setSearchQuery(location);
                      handleSearch(location);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {location}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;