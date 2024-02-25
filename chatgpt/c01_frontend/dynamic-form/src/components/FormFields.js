// components/FormFields.js
import React from 'react';

const FormFields = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="text"
          className="form-control"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="phone" className="form-label">
          Phone:
        </label>
        <input
          type="text"
          className="form-control"
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FormFields;
