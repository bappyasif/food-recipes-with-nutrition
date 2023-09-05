import { HomeHero } from "@/components/HomeHero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100vh]">
      <h1>Home Page</h1>
      <HomeHero />
      <Button variant={"ghost"}>Button Here</Button>
    </div>
  )
}
