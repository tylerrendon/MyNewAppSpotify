import { useEffect, useState } from 'react';
import getCurrentPlaying from './getPlayback.js';
import { loginWithSpotify } from './spotify.js';
import getLyrics from './fetchLyrics.js'
import { fetchSimilarSongsWithArt } from './getSimilarSongs.js';
import './Dashboard.css';

function Dashboard() {
  const [currentSong, setCurrentSong] = useState(null);
  const [similarSongs, setSimilarSongs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (!accessToken) {
      loginWithSpotify();
      return;
    }

    const fetchCurrentSong = async () => {
      try {
        const song = await getCurrentPlaying();
        setCurrentSong(song);
      } catch (err) {
        console.error('error', err);
      }
    };

    fetchCurrentSong();
    const interval = setInterval(fetchCurrentSong, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  const handleGetLyrics = async () => {
    if (!currentSong) return;
    
    setIsAnalyzing(true);
    setShowSimilar(false);
    
    try {
      const artist = currentSong.item.artists[0].name;
      const title = currentSong.item.name;
      
      const fetchedLyrics = await getLyrics(artist, title);
      const similarSongsData = await fetchSimilarSongsWithArt(fetchedLyrics);
      setSimilarSongs(similarSongsData.similarSongs);
      setShowSimilar(true);
    } catch (err) {
      console.error('failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('code_verifier');
    window.location.href = '/';
  };

  if (!currentSong) {
    return (
      <div className="dashboard-container">
        <div className="no-song-card">
          <div className="no-song-icon">🎵</div>
          <h2>No Song Playing</h2>
          <p>Start playing a song on Spotify to see it here</p>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="background-animation">
        <div className="gradient-bg"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="app-title">SoulMatch</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="now-playing-section">
          <div className="now-playing-card">
            <div className="song-info">
              <div className="album-art-container">
                <img 
                  src={currentSong.item.album.images[0]?.url || '/default-album.png'} 
                  alt="Album Art"
                  className="album-art"
                />
                <div className="playing-indicator">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
              
              <div className="song-details">
                <h2 className="song-title">{currentSong.item.name}</h2>
                <p className="song-artist">
                  {currentSong.item.artists.map(a => a.name).join(', ')}
                </p>
                <p className="song-album">{currentSong.item.album.name}</p>
              </div>
            </div>

            <button 
              className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
              onClick={handleGetLyrics}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="analyze-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>Find Similar Songs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showSimilar && similarSongs.length > 0 && (
          <div className="similar-songs-section">
            <div className="section-header">
              <h2>Similar Songs</h2>
              <p>Based on lyrics analysis</p>
            </div>
            
            <div className="similar-songs-grid">
              {similarSongs.map((song, index) => (
                <div key={index} className="similar-song-card">
                  <div className="song-cover">
                    {song.coverArt ? (
                      <img src={song.coverArt} alt={`${song.name} cover`} />
                    ) : (
                      <div className="no-cover">🎵</div>
                    )}
                  </div>
                  <div className="song-info-mini">
                    <h3 className="song-name">{song.name}</h3>
                    <p className="song-artist-mini">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
