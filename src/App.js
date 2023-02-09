import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // all help with routing for application
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootsrap moduale
import './App.css'; // import CSS
import Form from ".components/Form"; // import form page

function App() {
  return (
    <Router>
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Routes>
            <Route exact path="/" components={Form} /> {/* directs any path with foward slash to component form */}
            <Route path="/app" components={Form} /> {/* directs any path with /app to component form */}
          </Routes>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
