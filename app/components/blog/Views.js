"use client"
import React, { useState, useEffect } from 'react';

const Views = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Simulate a view each time the component is mounted
    setViews(prev => prev + 1);
  }, []);

  return (

    <div className="text-sm text-gray-500 mt-2 pl-2 pr-24">
      👁️ {views} {views === 1 ? 'view' : 'views'}
    </div>
    
  );
};

export default Views;
