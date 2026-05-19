import React from 'react';
import './App.css'
import { useAuth } from '../context/auth-context';
import { AuthenticatedApp } from '../authenticated-app';
import { UnauthenticatedApp } from '../unauthenticated-app';
import { ErrorBoundary } from '../components/error-bounder';
import { FullPageError } from '../components/lib';


function App() {
  const {user}=useAuth();
  return (
    
    <div className="App">
      <ErrorBoundary fallbackrender={FullPageError}>{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </ErrorBoundary>
      
      {/* <ProjectListScreen /> */}
    </div>
  );
}


export default App;
