// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import Table from './components/Table';
import SuccessModal from './components/SuccessModal';
import './dynamic-form.css';

const App = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-data');
      const result = await response.json();

      // Check if result is a valid array before updating the state
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error('Invalid data format received:', result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once on component mount

  const handleFormSubmit = async () => {
    // Fetch updated data after submission
    fetchData();
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

        {/* Render the table directly */}
        <Table existingData={data} />
      </div>
    </Router>
  );
};

export default App;
