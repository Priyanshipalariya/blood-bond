import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const Tabs = TabsPrimitive.Root;

const TabsList = ({className, ...props}) => <TabsPrimitive.List className={`inline-flex h-10 justify-between border-transparent bg-gray-200 text-gray-400 rounded-md  p-1  ${className}`} {...props} />;

const TabsTrigger = ({className, ...props}) => <TabsPrimitive.Trigger className={`rounded-sm  bg-white px-2 py-1.5 whitespace-nowrap text-sm sm:text-md font-medium 
     data-[state=active]:text-black data-[state=active]:shadow-lg`} {...props} />;

const TabsContent = ({className, ...props}) => <TabsPrimitive.Content className={`mt- ${className}`} {...props} />;

export { Tabs, TabsList, TabsTrigger, TabsContent };