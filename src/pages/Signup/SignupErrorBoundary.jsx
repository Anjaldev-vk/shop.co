import React from 'react';

class SignupErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Signup Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Signup Error</h2>
            <p className="text-gray-600 mb-6">Something went wrong during the registration process.</p>
            <div className="bg-red-50 p-3 rounded text-red-600 text-sm mb-6">
                {this.state.error?.message}
            </div>
            <button
               onClick={() => this.setState({ hasError: false })}
               className="w-full py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition"
            >
              Restart Signup
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SignupErrorBoundary;
