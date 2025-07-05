import './App.css';
import { loginWithSpotify } from './spotify.js';
import {getToken} from './spotifyToken.js'
import { useEffect, useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    loginWithSpotify();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setIsLoading(true);
      getToken(code)
        .then(token => {
          console.log("token", token);
          window.location.href = "/dashboard";
        })
        .catch(err => {
          console.error('error getting the token', err);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className="App">
      <div className="background-animation">
        <div className="gradient-bg"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="content">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">🎵</div>
            <h1 className="app-title">SoulMatch</h1>
            <p className="app-subtitle">Discover your next favorite song</p>
          </div>
        </div>

        <div className="login-section">
          <div className="login-card">
            <h2>Welcome to SoulMatch</h2>
            <p>Connect with Spotify to discover similar songs based on your current playlist</p>
            
            <button 
              className={`spotify-login-btn ${isLoading ? 'loading' : ''} ${isHovered ? 'hovered' : ''}`}
              onClick={handleLogin}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <svg className="spotify-icon" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span>Connect with Spotify</span>
                </>
              )}
            </button>
            
            <div className="features">
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <span>Smart Recommendations</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🎼</div>
                <span>Lyrics Analysis</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🎧</div>
                <span>Real-time Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
