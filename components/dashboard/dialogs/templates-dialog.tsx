import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TemplateCard from '@/components/dashboard/template-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import logo from '@/public/cyannav cyan.svg'
import Image from 'next/image'

interface Template {
  creatorName: string
  title: string
  description: string
}

export default function TemplateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  )

  const handleLearnMore = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleBackToGrid = () => {
    setSelectedTemplate(null)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[100vh] overflow-y-auto p-6 md:max-w-4xl lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {selectedTemplate ? (
              <button
                className="flex items-center space-x-3.5 text-sm font-normal"
                onClick={handleBackToGrid}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Templates</span>
              </button>
            ) : (
              'All Templates'
            )}
          </DialogTitle>
        </DialogHeader>

        {selectedTemplate ? (
          <div className="flex flex-col space-y-10 lg:space-y-16">
            {/* Top section with title and image */}
            <div className="flex flex-col items-center space-y-6 lg:flex-row lg:space-x-16">
              <div className="flex flex-col space-y-6 lg:w-1/2">
                <h1 className="text-2xl lg:text-3xl">
                  {selectedTemplate.title}
                </h1>
                <Button className="w-full bg-cyan-200 text-black lg:w-40">
                  Use template
                </Button>
              </div>
              <div className="h-[200px] w-full max-w-full rounded-lg bg-zinc-800 lg:h-[367px] lg:w-1/2">
                {/* Placeholder Box */}
              </div>
            </div>

            {/* About this template section */}
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-16 lg:space-y-0">
              <div className="flex-1">
                <h2 className="text-lg font-semibold lg:text-xl">
                  About this template
                </h2>
                <p className="text-muted-foreground mt-2 text-base">
                  Lorem ipsum dolor sit amet consectetur. Quam turpis sed ac
                  odio leo suspendisse phasellus viverra. Amet vitae natoque
                  lorem sodales magna. Sed sapien facilisis proin sed suscipit
                  justo habitant vitae.
                </p>
              </div>

              <div className="w-full space-y-6 lg:w-1/3">
                <div className="flex flex-row items-center space-x-3">
                  <Image
                    className="h-14 w-14"
                    src={logo}
                    alt="Creator logo"
                    width={60}
                    height={60}
                  />
                  <div>
                    <h3 className="text-base font-bold">CyanNav</h3>
                    <p className="text-muted-foreground text-base">
                      Redefining Map Creativity
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Lorem ipsum dolor sit amet consectetur. Quam turpis sed ac
                  odio leo suspendisse phasellus viverra. Amet vitae natoque
                  lorem sodales magna.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <TemplateCard
                  key={i}
                  creatorName="CyanNav"
                  title="Custom Map Template Name"
                  description="The description should be at maximum 3 lines. If it goes over 3 lines, put ... right after the last word. This only pops up when on hover."
                  onLearnMore={handleLearnMore}
                />
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
