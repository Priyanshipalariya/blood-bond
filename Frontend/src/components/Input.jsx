import React from "react";

const Input = ({type, className, ...props }) => (
    <input type={type} className={`flex h-10 w-full rounded-md border border-gray-400  px-3 py-2 ${className}`} {...props} />
  );

  const TextArea = ({ className,children, ...props }) => (
    <textarea className={`flex min-h-[80px] w-full rounded-md border  border-input px-3 py-2 text-md  ${className}`} {...props}>
        {children}
    </textarea>
  );

 

export {Input, TextArea}