import React from 'react';

export const DECIMALS = (10 ** 18);

export const ether = wei => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 1000; // Use 3 decimal places

  price = ether(price);
  price = Math.round(price * precision) / precision;

  return price;
};

export function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(() => {
    setValue(v => !v);
  }, []);
  return [value, toggle];
}