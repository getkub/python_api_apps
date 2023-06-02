import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('/api/submit-form', formValues)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <h1>Dynamic Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formValues.message}
          onChange={handleChange}
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
