import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { FiChevronUp, FiChevronDown, FiCheck } from "react-icons/fi";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = (props) => (
  <SelectPrimitive.Trigger
    className="flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  >
    {props.children}
    <SelectPrimitive.Icon>
      <FiChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({ children, position = "popper", ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className="relative my-1 z-50 bg-gray-100 max-h-60 min-w-[8rem] overflow-auto rounded-md border shadow-md"
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
        <FiChevronUp className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
        <FiChevronDown className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ children, ...props }) => (
  <SelectPrimitive.Item
    className="relative flex w-full cursor-pointer items-center py-1.5 px-8 text-sm hover:bg-gray-100 focus:bg-gray-200"
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="absolute left-2">
      <FiCheck className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectSeparator = (props) => (
  <SelectPrimitive.Separator className="my-1 h-px bg-gray-300" {...props} />
);

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectSeparator };