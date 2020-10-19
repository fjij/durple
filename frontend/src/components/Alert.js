import React from 'react';

const typeToClassName = {
  info: "alert alert-primary",
  success: "alert alert-success",
  error: "alert alert-danger"
}

export function Alert({ message, options, style, close }) {
  return (
    <div className={typeToClassName[options.type]} style={{...style}} role="alert">
      {message}
      <button className="close ml-2" onClick={close}>
        <span>&times;</span>
      </button>
    </div>
  );
}
