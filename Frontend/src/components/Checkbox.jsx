import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

const Checkbox = ({ className, ...props }) => (
    <CheckboxPrimitive.Root
      className={`h-5 w-5 shrink-0 rounded-sm border disabled:cursor-not-allowed disabled:opacity-50 
                  data-[state=checked]:bg-red-600 data-[state=checked]:text-white flex items-center justify-center ${className || ""}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <FaCheck className="h-3 w-3 text-white " />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  export {Checkbox}
