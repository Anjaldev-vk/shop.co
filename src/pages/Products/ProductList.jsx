import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "./ProductCard";
import Pagination from "../../components/Pagination";
import PageTransition from "../../components/PageTransition";
import { ProductSkeleton } from "../../components/Loading";

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
        {categories.map(cat => {
            const catName = typeof cat === 'object' ? cat.name : cat;
            const catId = typeof cat === 'object' ? cat.id || cat.name : cat;
            return <option key={catId} value={catName}>{catName}</option>
        })}
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
  const { products, categories, loading, error } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [categories, setCategories] = useState([]); // Removed local categories state
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 5000],
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Changed to 8 for better grid alignment (2 rows on XL)

  // useEffect(() => {
  //   if (products.length > 0) {
  //     const uniqueCategories = [...new Set(products.map(p => p.category))];
  //     setCategories(uniqueCategories);
  //   }
  // }, [products]);

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
      // Backend uses final_price or price. discount_price might be null.
      const price = parseFloat(p.final_price || p.price || 0);
      // Rating is optional/missing from backend, default to 4.5 for now or check if exists
      const rating = p.rating || 4.5; 
      
      return (
        (filters.category ? p.category === filters.category : true) &&
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        rating >= filters.minRating
      );
    });
    switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => (parseFloat(a.final_price || a.price) - parseFloat(b.final_price || b.price)));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (parseFloat(b.final_price || b.price) - parseFloat(a.final_price || a.price)));
          break;
        case 'rating-desc':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
    <PageTransition>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-10">
          
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsFilterOpen(false)}></div>
          )}
          <aside className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 h-full overflow-y-auto">
                <button onClick={() => setIsFilterOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <FilterPanel {...filterPanelProps} />
              </div>
          </aside>
          
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button onClick={() => setIsFilterOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100 self-start">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              </button>
              <p className="text-gray-500 font-medium text-sm">
                Showing <span className="text-black font-bold">{currentProducts.length}</span> results
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="p-2.5 bg-gray-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none cursor-pointer hover:bg-gray-100 transition w-full sm:w-auto"
                >
                  <option value="default">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                
                <div className="mt-12">
                  <Pagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedProducts.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Products Found</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">We couldn't find what you're looking for. Try adjusting your filters.</p>
                <button onClick={handleResetFilters} className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition shadow-lg">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductList;