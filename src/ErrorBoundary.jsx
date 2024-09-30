import React, { Component } from 'react';
// Error boundary can help me gracefully handle errors
// Only downpoint is that it can be only a class component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isError: false
    }
  }

  // First method to get call when child will runs into an error
  static getDerivedStateFromError(error) {
    return {isError: true}
  }

  // Now, I can log the error
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  // render the fallback UI
  render() {
    if(this.state.isError) {
      return <h2>Something went wrong ...</h2>
    }
    return this.props.children
  }
}

export default ErrorBoundary;