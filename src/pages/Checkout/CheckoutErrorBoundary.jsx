import React from 'react';

class CheckoutErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Checkout Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center max-w-2xl mx-auto mt-10">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Checkout Process Interrupted</h2>
            <p className="text-red-700 mb-6">We encountered an issue with the checkout form. Your data is safe, but we need you to try again.</p>
            <button
               onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-medium"
            >
              Retry Checkout
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CheckoutErrorBoundary;
