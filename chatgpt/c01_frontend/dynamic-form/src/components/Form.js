// components/Form.js
import React, { useState } from 'react';

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // Log the response from the backend

      // Assuming onSubmit is a callback prop passed from App.js
      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Form Field:
        <input type="text" name="field" onChange={handleChange} />
      </label>
      <button type="submit">Submit Form</button>
    </form>
  );
};

export default Form;
