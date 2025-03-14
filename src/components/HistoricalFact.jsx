import { useState, useRef } from "react";
import axios from "axios";
import Globe from "./Globe";

const HistoricalFact = () => {
  const [event, setEvent] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const mapRef = useRef(null); // Move inside component

  const fetchFact = async () => {
    try {
      setEvent(null);
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
      setSpinning(false);
    }
  };

  return (
    <div className="text-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchFact}
      >
        Get a Random Historical Fact
      </button>

      {event || spinning ? (
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            {event ? event.title : "🌍 Spinning the globe..."}
          </h2>
          {event && <p>{event.description}</p>}
          {event?.image && (
            <img
              src={event.image}
              alt={event.title}
              className="mx-auto my-2 w-60 rounded"
            />
          )}
          {event && (
            <a
              href={event.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              Read More on Wikipedia
            </a>
          )}
          <Globe
            lat={event?.lat}
            lon={event?.lon}
            title={event?.title}
            spinning={spinning}
            mapRef={mapRef}
          />
        </div>
      ) : (
        <p>Click the button to get a historical fact!</p>
      )}
    </div>
  );
};

export default HistoricalFact;
