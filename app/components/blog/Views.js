"use client"
import React, { useState, useEffect } from 'react';

const Views = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Simulate a view each time the component is mounted
    setViews(prev => prev + 1);
  }, []);

  return (

    <div className="ml-24  mr-8 text-sm text-gray-500   px-4 py-2 rounded-full  t bg-gray-100 ">
       {views} {views === 1 ? 'view' : 'views'}
    </div>
    
  );
};

export default Views;
