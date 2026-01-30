import React from 'react';

class ProfileErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Profile Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="text-center p-8 bg-white shadow-lg rounded-xl">
             <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Unavailable</h2>
             <p className="text-gray-600 mb-6">We couldn't load your profile information.</p>
             <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
             >
               Try Again
             </button>
           </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProfileErrorBoundary;
