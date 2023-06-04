import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import SuccessModal from './components/SuccessModal';
import './dynamic-form.css'; // Import the CSS file

const App = () => {
  const handleFormSubmit = () => {
    // Handle form submission logic here
  };

  return (
    <Router>
      <div className="app-container">
        <h1>Dynamic Form</h1>
        <Switch>
          <Route exact path="/">
            <Form onSubmit={handleFormSubmit} />
          </Route>
          <Route exact path="/success">
            <SuccessModal />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
