import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Globe from "./Globe";
import "./HistoricalFact.css"; // We'll create this CSS file

const HistoricalFact = ({ onBack }) => {
  const [event, setEvent] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Set a timeout to ensure map container is fully rendered
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const fetchFact = async () => {
    try {
      setEvent(null);
      setError(null);
      setSpinning(true);

      // Start spinning the globe immediately
      const map = mapRef.current;
      if (map) {
        map.setView([Math.random() * 180 - 90, Math.random() * 360 - 180], 2);
      }

      // Fetch historical data from Wikipedia
      const res = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          format: "json",
          generator: "random",
          grnnamespace: 0,
          prop: "coordinates|extracts|pageimages",
          exintro: true,
          explaintext: true,
          pithumbsize: 500,
          origin: "*",
        },
      });

      const pages = res.data.query.pages;
      const page = Object.values(pages)[0];

      if (!page.coordinates) {
        fetchFact(); // Retry if no coordinates
        return;
      }

      setEvent({
        title: page.title,
        description: page.extract,
        image: page.thumbnail ? page.thumbnail.source : null,
        wikiUrl: `https://en.wikipedia.org/wiki/${page.title.replace(
          / /g,
          "_"
        )}`,
        lat: page.coordinates[0].lat,
        lon: page.coordinates[0].lon,
      });

      setSpinning(false);
    } catch (error) {
      console.error("Error fetching historical fact:", error);
      setError("Failed to fetch a historical fact. Please try again.");
      setSpinning(false);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="explorer-container">
      {/* Full-screen map container */}
      <div className="map-container">
        {mapLoaded && (
          <Globe
            lat={event?.lat}
            lon={event?.lon}
            title={event?.title}
            spinning={spinning}
            mapRef={mapRef}
          />
        )}
      </div>

      {/* Back button */}
      <button onClick={onBack} className="back-button">
        ← Back
      </button>

      {/* Controls and info card */}
      <div className={`info-card-container ${collapsed ? "collapsed" : ""}`}>
        {event && (
          <button onClick={toggleCollapse} className="collapse-button">
            {collapsed ? "Expand" : "Collapse"}
          </button>
        )}

        {!collapsed && (
          <>
            {!event && !spinning && !error ? (
              <div className="card-content">
                <h2>Ready to Explore?</h2>
                <p>
                  Click the button below to discover a random interesting or
                  historical place or event!
                </p>
                <button className="primary-button" onClick={fetchFact}>
                  Start Exploring
                </button>
              </div>
            ) : spinning ? (
              <div className="card-content loading">
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <h2>Spinning the globe...</h2>
                </div>
                <p>Searching for an interesting location...</p>
              </div>
            ) : error ? (
              <div className="card-content error">
                <h2>Oops!</h2>
                <p>{error}</p>
                <button className="primary-button" onClick={fetchFact}>
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                {/* Fact card header */}
                <div className="card-header">
                  <h2>{event.title}</h2>
                </div>

                {/* Fact card content */}
                <div className="card-body">
                  <div className="card-content-flex">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                    )}
                    <div className="event-description">
                      <p>{event.description}</p>
                      <a
                        href={event.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wiki-link"
                      >
                        Read More on Wikipedia
                      </a>
                    </div>
                  </div>
                </div>

                {/* Fact card footer */}
                <div className="card-footer">
                  <button className="primary-button" onClick={fetchFact}>
                    Get Another Fact
                  </button>
                  <span className="coordinates">
                    {event.lat && event.lon ? (
                      <>
                        Location: {event.lat.toFixed(2)}°,{" "}
                        {event.lon.toFixed(2)}°
                      </>
                    ) : (
                      "Location data unavailable"
                    )}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        {collapsed && event && (
          <div className="mini-card">
            <h3>{event.title}</h3>
            <span className="mini-coordinates">
              {event.lat.toFixed(2)}°, {event.lon.toFixed(2)}°
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalFact;
