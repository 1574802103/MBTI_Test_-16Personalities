import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Test } from './pages/Test';
import { Result } from './pages/Result';
import { PersonalityDetail } from './pages/PersonalityDetail';
import { TypeLibrary } from './pages/TypeLibrary';
import { Profile } from './pages/Profile';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/:version" element={<Test />} />
        <Route path="/result/:type" element={<Result />} />
        <Route path="/type/:typeId" element={<PersonalityDetail />} />
        <Route path="/types" element={<TypeLibrary />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
