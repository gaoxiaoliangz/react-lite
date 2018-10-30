import React from 'react';

const Link = ({ to, children, className }) => {
  return (
    <a className={className} href={to}>
      {children}
    </a>
  );
};

export default Link;
