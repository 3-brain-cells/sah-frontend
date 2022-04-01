import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateEventPage from "./pages/CreateEventPage";
import VotePage from "./pages/VotePage";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/new/:eventId" element={<CreateEventPage />} />
          <Route path="/vote/:eventId" element={<VotePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
