import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";

export default function Home() {

  return (
    <div
      className="flex flex-col gap-y-20"
    >
      <section className="text-content/80 font-bold w-full lg:w-5/6 mt-4 mx-auto space-y-6" role="presentation">
        <p className="text-center text-lg sm:text-xl lg:text-2xl leading-relaxed">Introducing Whats Cooking App, your ultimate companion for discovering and preparing delicious recipes with ease!</p>

        <p className="font-light text-left lg:text-center w-5/6 lg:w-3/4 mx-auto text-sm lg:text-lg lg:px-4 leading-relaxed">Whether you&apos;re a seasoned chef or just starting out in the kitchen, our app is designed to inspire and guide you through a wide variety of dishes from around the world. Save your favorite recipes within app calender scheduler and share them on social media. Checkout both drawer on each side of your device screen right below. Start your culinary journey today!</p>
      </section>

      <HomeHero />

      <section className="text-content/80 font-bold text-lg w-full lg:w-5/6 mt-4 mx-auto space-y-6" role="presentation">
        <p className="text-center text-lg sm:text-xl lg:text-2x leading-relaxed">Welcome, try our fancy Randomly Recipe Finding Game to discover many extra-ordinary, rare and  exclusive recipes!</p>

        <p className="leading-relaxed text-left lg:text-center font-light w-5/6 lg:w-3/4 mx-auto text-sm lg:text-lg lg:px-4">Simply make use of our randomizers (at least four of them) to help you find many awesome recipes that you might enjoy preparing, serving for yourself and others. When recipes are found you will be directed to a modal to view recipes based on your filters used for this search. <span className="">Start playing!</span></p>
      </section>

      <RandomizeSelection />

      {/* smaller screen */}
      <div className="xxs:flex xxs:flex-col xl:hidden items-center gap-y-20 justify-between text-content mb-10 px-1">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>

      {/* bigger screen */}
      <div className="xxs:hidden xl:flex flex-row items-center gap-x-20 justify-between text-content mb-16 px-4">
        <ReusableCarousel title='Dish' />
        <RecentlyViewedMealsScroller />
        <ReusableCarousel title='Cuisine' />
      </div>
    </div>
  )
}