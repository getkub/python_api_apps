import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Form from './components/Form';
import SuccessModal from './components/SuccessModal';

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = () => {
    // Handle form submission logic here

    // Set the form submission flag to true
    setIsSubmitted(true);
  };

  return (
    <Router>
      <div>
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
