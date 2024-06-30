import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Projects from './components/Projects.tsx'

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
      </Routes>
  </Router>
);
