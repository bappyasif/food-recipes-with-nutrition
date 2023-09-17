// import { CarouselVertical } from "@/components/forHome/CarouselVertical";
import { DuoCarousels } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { MouseWheelBasedCarouselBasic } from "@/components/forHome/MouseWheelBasedCarouselBasic";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100vh] bg-primary">
      <h1>Home Page</h1>
      <HomeHero />
      <Button variant={"ghost"} className="bg-primary-content hover:bg-primary-foreground">Button Here</Button>

      {/* <CarouselVertical /> */}
      <div className="flex justify-center relative z-20">
      <MouseWheelBasedCarouselBasic />
      </div>

      <div className="flex items-center gap-x-20 justify-center">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>
    </div>
  )
}
