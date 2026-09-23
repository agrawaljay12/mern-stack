import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Home} from "./pages/Home";
// import { About } from "./pages/About";
// import { Contact } from "./pages/Contact";
// import { Projects } from "./pages/Project";
// import { TechnicalSkills } from "./pages/TechnicalSkills";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/skills" element={<TechnicalSkills/>} />
      </Routes> */}
    </BrowserRouter>
  );
}

export default App;
