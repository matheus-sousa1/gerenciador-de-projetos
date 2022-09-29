import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./componets/pages/home";
import Contact from "./componets/pages/contact";
import Company from "./componets/pages/company";
import NewProject from "./componets/pages/newproject";
import Container from "./componets/layout/container";
import NavBar from "./componets/layout/Navbar";
import Footer from "./componets/layout/footer";
import Projects from "./componets/pages/projects";
import Project from "./componets/pages/project";

function App() {
  return (
    <Router>
      <NavBar />
      <Container customClass="minHeight">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
