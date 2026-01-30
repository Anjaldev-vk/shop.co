import React from 'react';

class HomeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Home Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="text-center p-8">
             <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Something went wrong</h2>
             <p className="text-gray-600 mb-8 max-w-md mx-auto">We're having trouble loading the home page. It might be a momentary glitch.</p>
             <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-black text-white rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
             >
               Reload Page
             </button>
           </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HomeErrorBoundary;
