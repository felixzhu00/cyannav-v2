import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqData } from '@/lib/const'
import HeadingRow from './heading-row'
import { lookup } from 'dns'

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
      <HeadingRow heading='F.A.Q.' subheading='Clear answers to your most common questions.' />
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