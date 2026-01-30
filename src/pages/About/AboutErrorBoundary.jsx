import React from 'react';

class AboutErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("About Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong in the About section.</h2>
          <p className="text-gray-600 mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AboutErrorBoundary;
