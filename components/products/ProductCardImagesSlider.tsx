import { Image as ImageType } from '@/types/product.types'
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from 'next/image'

export const ProductCardImagesSlider = ({ images }: { images: ImageType[] }) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel 
      className="w-full h-full max-w-full" 
      style={{ width: '100%', height: '100%' }}
      setApi={setApi}
    >
      <CarouselContent className="">
        {images?.map((image, index) => (
          <CarouselItem key={index}>
            <div className="">
              <Image
                src={image?.original}
                alt={image?.original}
                width={360}
                height={360}
                className="object-cover h-[218px] w-[218px]"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      
      {/* Carousel Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2 absolute bottom-[8px] left-0 right-0">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all rounded-full ${
                index === current
                  ? 'w-2.5 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-white dark:bg-white hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Carousel>
  )
}