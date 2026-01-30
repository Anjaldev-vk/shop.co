import React from 'react';

class ProductsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Products Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-8">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
             <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load products</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">We're experiencing some technical difficulties displaying our catalog right now.</p>
          <button
             onClick={() => window.location.reload()}
             className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductsErrorBoundary;
