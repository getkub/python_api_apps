import options from './options.json';

const optionsData = () => {
  try {
    return options;
  } catch (error) {
    console.error('Error fetching options data:', error);
    return null;
  }
};

export default optionsData;
