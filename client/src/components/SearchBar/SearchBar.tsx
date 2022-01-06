import React from "react";
import { RiSearchLine } from "react-icons/ri";
import "./index.css";

export default function SearchBar({
  placeholder,
  otherProps,
  iconSize,
  iconColor,
  controlClass,
  containerClass,
  inputClass,
}: any) {
  return (
    <div className={`search__control ${controlClass}`}>
      <div className={`search__value-container ${containerClass}`}>
        <input
          className={`search__input ${inputClass}`}
          type="text"
          placeholder={placeholder}
          {...otherProps}
        />
      </div>
      <div className="mr-1">
        <RiSearchLine size={iconSize} color={iconColor} />
      </div>
    </div>
  );
}
