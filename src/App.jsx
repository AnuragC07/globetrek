import { useState } from "react";
import HistoricalFact from "./components/HistoricalFact";
import "./App.css"; // We'll create this CSS file

function App() {
  const [showExplorer, setShowExplorer] = useState(false);

  if (showExplorer) {
    return <HistoricalFact onBack={() => setShowExplorer(false)} />;
  }

  return (
    <div className="landing-page">
      <div className="overlay"></div>

      <div className="landing-content">
        <h1>TimeTrek</h1>
        <p>
          Discover random interesting or historical places and events from
          around the world with just one click.
        </p>
        <button
          className="primary-button"
          onClick={() => setShowExplorer(true)}
        >
          Pick a Random Fact
        </button>
      </div>
    </div>
  );
}

export default App;
