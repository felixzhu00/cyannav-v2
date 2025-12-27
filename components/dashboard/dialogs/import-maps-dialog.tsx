import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  convertToCustomFeatureCollection,
  encodeGeo,
  handleUseTemplate,
  parseKML,
  parseShapefile,
} from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { importMapSchema } from '@/core/_entities/z-schemas/form.schema'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { genImageBuffer } from '@/lib/generate-image'

interface ImportMapDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface ImportMapFormValues {
  title: string
  file: FileList
}

export default function ImportMapDialog({
  isOpen,
  onClose,
}: ImportMapDialogProps) {
  const form = useForm<ImportMapFormValues>({
    resolver: zodResolver(importMapSchema),
    defaultValues: {
      title: '',
      file: undefined as unknown as FileList,
    },
  })

  const router = useRouter()
  const onSubmit = async (data: ImportMapFormValues) => {
    // TODO zod validation
    // const file = data.file
    // if (!file) {
    //   console.error('No file uploaded')
    //   return
    // }

    const file = data.file[0]
    const title = data.title
    const fileData = await file.text()

    // Set geosjon base on import type
    let geojson

    const ext = file.name.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'geojson':
      case 'json':
        geojson = JSON.parse(fileData)
        break
      case 'kml':
        geojson = parseKML(fileData)
        break
      case 'zip':
        geojson = await parseShapefile(file)
        break
      case 'navjson':
        geojson = JSON.parse(fileData)
        break
      default:
        console.error('Unsupported file type')
    }

    if (!geojson) {
      toast({
        description: 'Imported not supported',
      })
      return
    }

    // covert to custom format before storing
    const cutsomGeoJson = convertToCustomFeatureCollection(geojson)

    // Generate a thumbnail for this new map
    const newThumbnail = await genImageBuffer(cutsomGeoJson)

    // convert geojson to buffer
    const encodedGeojson = encodeGeo(cutsomGeoJson)

    // do api call
    const res = await handleUseTemplate(encodedGeojson, title, newThumbnail)
    // Success or fails
    if (res) router.push(res)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Map</DialogTitle>
          <DialogDescription>
            Enter and select information to import your .navjson map.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Map Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ref, value, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".zip,.json,.kml,.navjson"
                      ref={ref}
                      onChange={(e) => onChange(e.target.files)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Import
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
