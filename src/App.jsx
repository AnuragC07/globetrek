import HistoricalFact from "./components/HistoricalFact";

function App() {
  //landing page
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Historical Explorer</h1>
      <HistoricalFact />
    </div>
  );
}

export default App;
