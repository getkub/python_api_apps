import React from 'react';
import { Link } from 'react-router-dom';

const SuccessModal = () => {
  return (
    <div>
      <h2>Form Submitted Successfully!</h2>
      <p>Thank you for submitting the form.</p>
      <Link to="/form">Go Back to Form</Link>
    </div>
  );
};

export default SuccessModal;
