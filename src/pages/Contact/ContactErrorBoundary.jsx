import React from 'react';

class ContactErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Contact Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100 m-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to load Contact Form</h2>
          <p className="text-gray-500 mb-4">Please try again later or reach us directly at support@shop.co</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-indigo-600 font-medium hover:underline"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContactErrorBoundary;
