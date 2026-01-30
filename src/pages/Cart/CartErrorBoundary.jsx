import React from 'react';

class CartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Cart Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-gray-50 min-h-[50vh] flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart Error</h2>
          <p className="text-gray-600 mb-6">We couldn't load your cart. Please try refreshing.</p>
          <p className="text-sm text-red-500 mb-6">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CartErrorBoundary;
