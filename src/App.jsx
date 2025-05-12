import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/pages/Home';
import './styles/main.scss';
import HeaderTemplate from './components/templates/HeaderTemplate';


const App = () => {
  return (
      <Router basename="/">
        <Routes>
          <Route path="/" element={<><HeaderTemplate /><Home /></>} />
        </Routes>
      </Router>
  );
};

export default App;