import './App.css';
import DashBoard from './pages/Dashboard'
import Navbar from './components/Navbar'
import {
  BrowserRouter as Router,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <DashBoard />
      </Router>
    </div>
  );
}

export default App;
