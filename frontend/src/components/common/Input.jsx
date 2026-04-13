import React from "react";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  style = {}
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #334155",
        background: "#0f172a",
        color: "#fff",
        outline: "none",
        fontSize: "14px",
        ...style
      }}
    />
  );
}

export default Input;