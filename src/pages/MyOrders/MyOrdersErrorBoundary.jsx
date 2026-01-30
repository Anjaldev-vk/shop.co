import React from 'react';

class MyOrdersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MyOrders Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Could not load your orders</h2>
          <p className="text-gray-600 mb-4">There was a problem fetching your order history.</p>
          <button
             onClick={() => this.setState({ hasError: false })}
             className="text-indigo-600 font-semibold hover:text-indigo-800 underline"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MyOrdersErrorBoundary;
