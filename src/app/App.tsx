import { Routes, Route } from 'react-router-dom';
import Navbar from '../resources/components/Navbar';
import Home from '../resources/views/Home';
import Detail from '../resources/views/Detail';
import Search from '../resources/views/Search';

function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
