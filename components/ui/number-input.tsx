'use client';

import { useState, useEffect, InputHTMLAttributes } from 'react';
import { Input } from './input'; // Assuming Input is imported from ShadCN

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onValueChange: (value: number) => void;
}

const NumberInput = ({ value, onValueChange, ...inputProps }: NumberInputProps) => {
  const [internalValue, setInternalValue] = useState<number>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleIncrement = () => {
    onValueChange(internalValue + 1);
  };

  const handleDecrement = () => {
    onValueChange(Math.max(internalValue - 1, 0)); // Ensure value doesn't go below 0
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      setInternalValue(newValue);
      onValueChange(newValue);
    } else {
      // Optionally handle invalid input
      console.warn('Invalid input, not a number');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
      >
        &ndash; {/* Minus sign */}
      </button>
      <Input
        type="number"
        value={internalValue}
        onChange={handleChange}
        {...inputProps} // Spread additional props here
      />
      <button
        onClick={handleIncrement}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
      >
        &#43; {/* Plus sign */}
      </button>
    </div>
  );
};

export default NumberInput;
