// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import SuccessModal from './components/SuccessModal';
import './dynamic-form.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>Dynamic Form</h1>
        <Switch>
          <Route exact path="/">
            <Form onFormSubmit={() => console.log('Form submitted successfully!')} />
          </Route>
          <Route exact path="/success">
            <SuccessModal />
          </Route>
          {/* Add more routes if needed */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
