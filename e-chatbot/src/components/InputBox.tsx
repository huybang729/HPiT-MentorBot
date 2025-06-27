import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputBox: React.FC<InputFieldProps> = ({ icon, type, placeholder, value, onChange }) => {
  return (
    <div className="flex items-center w-2/3 h-12 border border-black rounded-lg gap-3 px-3">
      <FontAwesomeIcon icon={icon} className='text-xl' />
      <input
        type={type}
        className='w-full h-full outline-none'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
