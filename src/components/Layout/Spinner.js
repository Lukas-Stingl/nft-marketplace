import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

//standardized loading Animation for use in the whole project
const Spinner = () => {
  return (
    <RotatingLines width="100" strokeColor="black" height="100" ariaLabel="Loading"/>
  );
}

export default Spinner;