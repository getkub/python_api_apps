import React, { useState } from 'react';
import axios from 'axios';
import '../dynamic-form.css'; // Import your CSS file

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:8000/api/submit-form', formData)
      .then((response) => {
        setIsSubmitted(true);
        onSubmit();
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Submit Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <button type="submit" className="form-button">Submit</button>
      </form>
      {isSubmitted && <p className="success-message">Form submitted successfully!</p>}
      {isError && <p className="error-message">An error occurred. Please try again.</p>}
    </div>
  );
};

export default Form;
