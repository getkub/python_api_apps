// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import SuccessModal from './components/SuccessModal';
import './dynamic-form.css';

const App = () => {
  const [dataUpdated, setDataUpdated] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <h1>Dynamic Form</h1>
        <Switch>
          <Route exact path="/">
            <Form onDataUpdate={() => setDataUpdated(!dataUpdated)} />
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
