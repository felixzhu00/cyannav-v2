'use client'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqData } from '@/lib/const'

interface FAQProps {
  question: string
  answer: string
}

const FAQAccordion: React.FC<FAQProps> = ({ question, answer }) => (
  <AccordionItem value={question}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent>{answer}</AccordionContent>
  </AccordionItem>
)

export default function Faq() {
  return (
    <section className="flex flex-col space-y-10">
      <div className="space-between flex h-full w-full flex-row items-end">
        <h1 className="flex-grow text-4xl font-bold">F.A.Q.</h1>
        <p className="text-2xl opacity-50">
          Clear answers to your most common questions.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((item, index) => (
          <FAQAccordion
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </Accordion>
    </section>
  )
}
