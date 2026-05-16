"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-xl border border-[#e8edf2] dark:border-[#3a3f45] bg-gray-50/50 dark:bg-[#32383f]",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const chevronStyle = 'h-4 w-4 shrink-0 text-[#537393] dark:text-gray-400 transition-transform duration-200'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        `flex flex-1 cursor-pointer items-center gap-4 px-4 py-4 text-left text-lg font-extrabold text-[#0f141a] dark:text-white transition-all ${props.lang === 'ar' ? '[&[data-state=open]>svg]:-rotate-90' : '[&[data-state=open]>svg]:rotate-90'}`,
        className
      )}
      {...props}
    >
     { props.lang === 'ar' ?
      <ChevronLeft className={cn(chevronStyle)} />:
      <ChevronRight className={chevronStyle} />
    }
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn(
        "px-12 pb-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

