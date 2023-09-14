import { HomeHero } from "@/components/forHome/HomeHero";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100vh] bg-primary">
      <h1>Home Page</h1>
      <HomeHero />
      <Button variant={"ghost"} className="bg-primary-content hover:bg-primary-foreground">Button Here</Button>
      <RecentlyViewedMealsScroller />
    </div>
  )
}
