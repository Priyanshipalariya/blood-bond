import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FaChevronDown } from "react-icons/fa";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({className, ...props}) => <AccordionPrimitive.Item className={`border-b border-gray-200 ${className}`} {...props} />;

const AccordionTrigger = ({ className,children, ...props }) => (
    <AccordionPrimitive.Header className="flex">
  <AccordionPrimitive.Trigger className = {`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-red-400 [&[data-state=open]>svg]:rotate-180 ${className}`} {...props}>
    {children}
    <FaChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent = ({className, children, ...props }) => (
  <AccordionPrimitive.Content className={`overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down`} {...props}>
    <div className={`pb-4 pt-0 ${className}`}>{children}</div>
  </AccordionPrimitive.Content>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };