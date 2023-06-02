import React, { useState } from 'react';
import axios from 'axios';

const FormInput = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

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
        setFormSubmitted(true); // Set a flag to indicate form submission success
      })
      .catch((error) => {
        console.error(error);
        // Handle error scenario if needed
      });
  };

  return (
    <div>
      {formSubmitted ? (
        <p>Form Submitted Successfully</p>
      ) : (
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
      )}
    </div>
  );
};

export default FormInput;
