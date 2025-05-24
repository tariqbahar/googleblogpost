"use client";
import React, { useState, useEffect } from "react";

const Views = ({ views }) => {
  console.log(views);
  const [Views, setViews] = useState(views || 0);

  return (
    <div className="md:ml-24 mr-20 md:mr-8 text-sm text-gray-500   px-4 py-2 rounded-full  t bg-gray-100 ">
      {Views} {Views === 1 ? "view" : "views"}
    </div>
  );
};

export default Views;
