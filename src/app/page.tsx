import { CarouselVertical } from "@/components/forHome/CarouselVertical";
import { DuoCarousels } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { HorizontalCarousel } from "@/components/forHome/HorizontalCarousel";
import { MouseWheelBasedCarouselBasic } from "@/components/forHome/MouseWheelBasedCarouselBasic";
import { MouseWheelBasedVertical } from "@/components/forHome/MouseWheelBasedVertical";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";
import VerticalCarousel from "@/components/forHome/VerticalCarousel";
import { VerticalCarouselAttemptOne } from "@/components/forHome/VerticalCarouselAttemptOne";
import { VerticalCarouselAttemptTwo } from "@/components/forHome/VerticalCarouselAttemptTwo";
import { Button } from "@/components/ui/button";
import data from "@/utils/data.json"

export default function Home() {
  return (
    <div className="h-[100vh] bg-primary">
      <h1>Home Page</h1>
      <HomeHero />
      <Button variant={"ghost"} className="bg-primary-content hover:bg-primary-foreground">Button Here</Button>

      <CarouselVertical />

      {/* <HorizontalCarousel /> */}

      {/* <VerticalCarouselAttemptTwo /> */}

      {/* <VerticalCarouselAttemptOne /> */}
      
      {/* <VerticalCarousel data={data.slides} leadingText={data.leadingText} /> */}

      <div className="flex items-center gap-x-20 justify-center">
      <RecentlyViewedMealsScroller />
      {/* <MouseWheelBasedCarouselBasic /> */}
      {/* <MouseWheelBasedVertical /> */}
      <DuoCarousels />
      </div>
    </div>
  )
}
