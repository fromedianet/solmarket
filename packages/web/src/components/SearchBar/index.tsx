import React from "react";
import { SearchOutlined } from '@ant-design/icons';

export const SearchBar = ({
  value,
  placeholder,
  controlClass,
  containerClass,
  inputClass,
  onChange,
  otherProps,
}: any) => {
  return (
    <div className={`search__control ${controlClass}`}>
      <div className={`search__value-container ${containerClass}`}>
        <input
          className={`search__input ${inputClass}`}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          {...otherProps}
        />
      </div>
      <div className="search__icon">
        <SearchOutlined />
      </div>
    </div>
  );
}
