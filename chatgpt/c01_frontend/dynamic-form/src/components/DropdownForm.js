import React, { useState, useEffect } from 'react';
import optionsData from './optionsData';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const DropdownForm = ({ onSubmit }) => {
  const [firstOptions, setFirstOptions] = useState([]);
  const [secondOptions, setSecondOptions] = useState([]);
  const [selectedFirstOptions, setSelectedFirstOptions] = useState([]);
  const [selectedSecondOptions, setSelectedSecondOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await optionsData();
      if (data) {
        setFirstOptions(data.firstOptions);
        setSecondOptions(data.secondOptions);
      }
    };

    fetchData();
  }, []);

  const handleFirstOptionChange = (selectedOptions) => {
    setSelectedFirstOptions(selectedOptions);
    setSelectedSecondOptions([]);
  };

  const handleSecondOptionChange = (selectedOptions) => {
    setSelectedSecondOptions(selectedOptions);
  };

  const getAvailableSecondOptions = () => {
    const availableSecondOptions = [];
    selectedFirstOptions.forEach((selectedOption) => {
      const options = secondOptions[selectedOption];
      if (options) {
        availableSecondOptions.push(...options);
      }
    });
    return availableSecondOptions;
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    const formData = {
      firstOptions: selectedFirstOptions,
      secondOptions: selectedSecondOptions,
    };
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Dropdown Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstOptions">Select first options:</label>
          <Typeahead
            id="firstOptions"
            name="firstOptions"
            multiple
            options={firstOptions}
            selected={selectedFirstOptions}
            onChange={handleFirstOptionChange}
            labelKey="label"
          />
        </div>

        {selectedFirstOptions.length > 0 && (
          <div>
            <label htmlFor="secondOptions">Select second options:</label>
            <Typeahead
              id="secondOptions"
              name="secondOptions"
              multiple
              options={getAvailableSecondOptions()}
              selected={selectedSecondOptions}
              onChange={handleSecondOptionChange}
              labelKey="label"
            />
          </div>
        )}

        <button type="submit" disabled={!selectedFirstOptions.length || !selectedSecondOptions.length}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DropdownForm;
