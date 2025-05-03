import React from 'react';

const SuisseFontDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="font-suisse space-y-4">
        <h1 className="text-3xl font-bold">Suisse BP Intl Bold (700)</h1>
        <h2 className="text-2xl font-medium">Suisse BP Intl Medium (500)</h2>
        <p className="text-xl font-normal">Suisse BP Intl Regular (400)</p>
        <p className="text-xl font-normal italic">Suisse BP Intl Regular Italic (400)</p>
        <p className="text-xl font-light">Suisse BP Intl Light (300)</p>
        <p className="text-xl font-thin">Suisse BP Intl Thin (100)</p>
        <p className="text-xl font-black">Suisse BP Intl Black (900)</p>
      </div>
    </div>
  );
};

export default SuisseFontDemo; 