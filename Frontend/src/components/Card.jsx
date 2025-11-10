import React from "react";

const Card = ({ className, ...props }) => (
  <div className={`rounded-lg border-2 border-gray-300 shadow-sm ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6" ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight" ${className}`} {...props} />
);

const CardDescription = ({ className, ...props }) => (
  <p className={`text-sm" ${className}`} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={`p-6 " ${className}`} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={`flex items-center px-6 " ${className}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };