import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import LeaderBoard from './pages/LeaderBoard';
import Problem1 from './pages/Problem1';
function App(){
  return (
  <Router>
    <Routes>
    <Route path="/" element={<LandingPage/>}/>
    </Routes>
    <Routes>
    <Route path="/LeaderBoard" element={<LeaderBoard/>}/>
    <Route path="/problem-1" element={<Problem1/>}/>

    </Routes>
  </Router>
  )
}

export default App;