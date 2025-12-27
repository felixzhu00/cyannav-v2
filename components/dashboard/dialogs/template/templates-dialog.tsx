import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TemplateCard from '@/components/dashboard/dialogs/template/template-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { MapFields } from '@/core/_entities/types/map.types'
import { UserFields } from '@/core/_entities/types/user.types'
import MapPreviewPage from './map-preview'
import { useRouter } from 'next/navigation'
import { handleUseTemplate } from '@/lib/utils'

function isUser(owner: any): owner is UserFields {
  return owner && typeof owner === 'object' && 'username' in owner
}

export default function TemplateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  // data form api call
  const [mapList, setMapList] = useState<MapFields[]>()
  // either index in mapList or null
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<
    number
  >(-1)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/map?view=templates', {
        method: 'GET',
        credentials: 'include', // ensures cookies are sent
        cache: 'no-store',
      })

      // Get the list of maps to display
      const maps = await response.json()

      // set the maplist state
      setMapList(maps.payload)
    }

    fetchData()
  }, [])

  const handleLearnMore = (index: number) => {
    setSelectedTemplateIndex(index)
  }

  const handleBackToGrid = () => {
    setSelectedTemplateIndex(-1)
  }

  if (!isOpen) return null

  const displayTemplateGrid = mapList && selectedTemplateIndex === null
  const displayTemplatePreview = !displayTemplateGrid && mapList

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[100vh] overflow-y-auto p-6 md:max-w-4xl lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {displayTemplatePreview ? (
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

        {displayTemplatePreview && (
          <div className="flex flex-col space-y-10 p-8 lg:space-y-16">
            {/* Top section with title and image */}
            <div className="flex w-full flex-col items-center justify-center space-y-6 text-left">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="flex-1 text-2xl font-semibold lg:text-3xl">
                  {mapList[selectedTemplateIndex || 0].title}
                </h1>
                <Button
                  onClick={async () => {
                    const res = await handleUseTemplate(
                      mapList[selectedTemplateIndex].geojson as any,
                      mapList[selectedTemplateIndex || 0].title as any,
                      mapList[selectedTemplateIndex].thumbnail as any,
                    )
                    if (res) router.push(res)
                  }}
                  className="w-full bg-cyan-200 text-black sm:w-auto lg:w-40"
                >
                  Use template
                </Button>
              </div>
              <div className="aspect-[4/3] w-full rounded-lg bg-pf sm:aspect-video">
                <MapPreviewPage
                  geojson={mapList[selectedTemplateIndex].geojson as any}
                />
              </div>
            </div>
          </div>
        )}

        {displayTemplateGrid && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mapList.length === 0 ? (
              <p className="mx-0 my-auto h-full w-full select-none justify-center p-20 text-center text-3xl text-muted-foreground">
                Currently There Is No Template
              </p>
            ) : (
              mapList.map((mapElement, i) => (
                <TemplateCard
                  key={i}
                  id={mapElement._id as string}
                  creatorName={(mapElement.owner as any).username || ''}
                  title={mapElement.title || ''}
                  geojson={mapElement.geojson as any}
                  thumbnail={mapElement.thumbnail as Buffer}
                  onLearnMore={() => {
                    handleLearnMore(i)
                  }}
                />
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
