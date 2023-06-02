import React, { useState } from 'react';
import axios from 'axios';
import FormInput from './FormInput';

const Form = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/api/submit-form`, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
      />
      <FormInput
        label="Email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
      />
      {/* Add more FormInput components for additional fields */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
