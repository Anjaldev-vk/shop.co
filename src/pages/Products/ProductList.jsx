import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "./ProductCard";
import Pagination from "../../components/Pagination";

// FilterSection and FilterPanel components are unchanged...
const FilterSection = ({ title, children }) => (
  <div className="py-5 border-b border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const FilterPanel = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  categories, 
  handleResetFilters 
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Filters</h2>
      <button onClick={handleResetFilters} className="text-sm text-indigo-600 hover:underline">Reset</button>
    </div>
    <FilterSection title="Search">
      <input
        type="text" placeholder="Search by name..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </FilterSection>
    <FilterSection title="Category">
      <select
        className="w-full p-2 border rounded" value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </FilterSection>
    <FilterSection title="Price Range">
      <input
        type="range" min="0" max="5000" step="10" value={filters.priceRange[1]}
        onChange={(e) => setFilters({ ...filters, priceRange: [0, Number(e.target.value)] })}
        className="w-full"
      />
      <div className="text-sm text-gray-600 text-center">Up to {filters.priceRange[1]}₹</div>
    </FilterSection>
    <FilterSection title="Minimum Rating">
      <input
        type="range" min="0" max="5" step="0.5" value={filters.minRating}
        onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
        className="w-full"
      />
      <div className="text-sm text-gray-600 text-center">{filters.minRating} ★ & up</div>
    </FilterSection>
  </>
);


const ProductList = () => {
  const { products, loading, error } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 5000],
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Changed to 8 for better grid alignment (2 rows on XL)

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered = filtered.filter(p => {
      const price = p.discountedPrice || p.price;
      return (
        (filters.category ? p.category === filters.category : true) &&
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        p.rating >= filters.minRating
      );
    });
    switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
        case 'rating-desc':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default: break;
      }
    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSortBy("default");
    setFilters({
      category: "",
      priceRange: [0, 5000], 
      minRating: 0,
    });
  };

  const filterPanelProps = {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    categories,
    handleResetFilters,
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsFilterOpen(false)}></div>
        )}
        <aside className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full overflow-y-auto">
              <button onClick={() => setIsFilterOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <FilterPanel {...filterPanelProps} />
            </div>
        </aside>
        
        <aside className="hidden lg:block w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <FilterPanel {...filterPanelProps} />
          </div>
        </aside>

        {/* ✅ FIXED: Changed "w-full" to "flex-1" for robust responsive layout. */}
        <main className="flex-1">
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
            <button onClick={() => setIsFilterOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            </button>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              Showing <span className="text-gray-900">{currentProducts.length}</span> of <span className="text-gray-900">{filteredAndSortedProducts.length}</span> products
            </p>
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-md text-sm sm:text-base"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              
              <Pagination 
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedProducts.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold">No Products Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;