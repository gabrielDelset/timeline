import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './tools/AuthContext';
import Connexion from './pages/connexion';
import HomeScreen from './pages/home';

function AppContent() {
  const { loggedIn, email, setLoggedIn, setEmail } = useAuth();
  return (
    <div style={styles.container}>
      <BrowserRouter>
        <div style={{ backgroundColor: '#ffffffff', minHeight: '100vh' }}>
          {loggedIn ? (
            <HomeScreen email={email} />
          ) : (
            <Connexion setLoggedIn={setLoggedIn} setEmail={setEmail} />
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9'
  },
};

export default App;
