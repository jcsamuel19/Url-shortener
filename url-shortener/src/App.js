import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // all help with routing for application
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; // import bootsrap moduale
import './App.css'; // import CSS
import Form from ".components/Form"; // import form page

function App() {
  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path="/" components={form} /> {/* directs any path with foward slash to component form */}
            <Route path="/app" components={form} /> {/* directs any path with /app to component form */}
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
