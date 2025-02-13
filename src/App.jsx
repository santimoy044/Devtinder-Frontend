import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<div>Base Pagee</div>} />
          <Route path="/login" element={<div>Login Pagee</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
