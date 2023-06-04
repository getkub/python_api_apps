import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../dynamic-form.css';
import { withRouter } from 'react-router-dom';

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post('http://localhost:8000/api/submit-form', formData);
      onSubmit();
      history.push('/success');
    } catch (error) {
      console.error(error);
    }
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
        <button className="btn btn-primary submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default withRouter(Form);
