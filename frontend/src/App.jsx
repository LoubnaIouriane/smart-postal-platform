import { BrowserRouter, Routes, Route } from "react-router-dom";

import CommercialList from "./pages/commercial/CommercialList";


function App() {

  return (
      <BrowserRouter>

        <Routes>

          <Route
              path="/commercial/liste"
              element={<CommercialList />}
          />

        </Routes>

      </BrowserRouter>
  );
}

export default App;