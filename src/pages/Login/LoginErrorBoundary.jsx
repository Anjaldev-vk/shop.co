import React from 'react';

class LoginErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Login Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-900">Login Error</h2>
            <p className="text-gray-600">We encountered an issue with the login form.</p>
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm">
                {this.state.error?.toString()}
            </div>
            <button
               onClick={() => this.setState({ hasError: false })}
               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Reset Form
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LoginErrorBoundary;
