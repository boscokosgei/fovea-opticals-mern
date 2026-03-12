// frontend/src/components/Skeleton.js
import React from 'react';

export const ServiceSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="skeleton h-48 rounded-t-xl -mt-6 -mx-6 mb-6"></div>
    <div className="skeleton h-8 w-3/4 mb-4"></div>
    <div className="skeleton h-4 w-full mb-2"></div>
    <div className="skeleton h-4 w-5/6 mb-2"></div>
    <div className="skeleton h-4 w-4/6 mb-6"></div>
    <div className="skeleton h-10 w-full rounded-lg"></div>
  </div>
);

export const OpticianSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="skeleton h-48 rounded-full w-48 mx-auto mb-6"></div>
    <div className="skeleton h-8 w-3/4 mx-auto mb-4"></div>
    <div className="skeleton h-4 w-2/3 mx-auto mb-2"></div>
    <div className="skeleton h-4 w-1/2 mx-auto mb-6"></div>
    <div className="skeleton h-10 w-full rounded-lg"></div>
  </div>
);