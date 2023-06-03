import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Form from './components/Form';
import SuccessModal from './components/SuccessModal';
import './dynamic-form.css'; // Import the CSS file

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = () => {
    // Handle form submission logic here

    // Set the form submission flag to true
    setIsSubmitted(true);
  };

  return (
    <Router>
      <div className="app-container"> {/* Add the app-container class */}
        <h1>Dynamic Form</h1>
        <Switch>
          <Route exact path="/">
            <Form onSubmit={handleFormSubmit} />
          </Route>
          <Route exact path="/success">
            {isSubmitted ? <SuccessModal /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
