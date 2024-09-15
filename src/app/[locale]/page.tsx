import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";

export default function Home() {

  return (
    <div
      className="flex flex-col gap-y-20"
    >
      <section className="text-content/80 font-bold xxs:w-2/3 lg:w-5/6 mt-4 mx-auto space-y-6" role="presentation">
        <p className="text-center text-2xl leading-relaxed">Introducing Whats Cooking App, your ultimate companion for discovering and preparing delicious recipes with ease!</p>

        <p className="font-light w-3/4 mx-auto text-lg px-4 leading-relaxed">Whether you're a seasoned chef or just starting out in the kitchen, our app is designed to inspire and guide you through a wide variety of dishes from around the world. Save your favorite recipes within app calender scheduler and share them on social media. Checkout both drawer on each side of your device screen right below. Start your culinary journey today!</p>

        {/* <p>Save your favorite recipes and share them on social media or save within app calender scheduler. Checkout both drawer on each side of your device screen right below.</p> */}

        {/* <p className="text-center">Start your culinary journey today!</p> */}
      </section>

      <HomeHero />

      {/* <section className="text-gray-700 font-bold text-lg max-w-4xl mx-auto mt-8 px-4 py-6 space-y-6" role="presentation">
        <p className="text-center text-xl leading-relaxed">
          Welcome! Here you can use our randomizers to discover extraordinary recipes you might not have heard of before.
        </p>

        <p className="leading-relaxed">
          Simply try out at least four of our randomizers to find amazing recipes that you’ll enjoy preparing and serving to yourself and others.
        </p>

        <p className="leading-relaxed">
          Once recipes are found, you will be directed to a modal where you can view recipes based on the filters you used for this search.
        </p>

        <p className="text-center text-xl font-semibold">
          Start exploring!
        </p>
      </section> */}

      <section className="text-content/80 font-bold text-lg xxs:w-2/3 lg:w-5/6 mt-4 mx-auto space-y-6" role="presentation">
        <p className="text-center text-2xl leading-relaxed">Welcome, try our fancy Randomly Recipe Finding Game to discover many extra-ordinary, rare and  exclusive recipes!</p>

        <p className="leading-relaxed font-light w-3/4 mx-auto text-lg px-4">Simply make use of our randomizers (at least four of them) to help you find many awesome recipes that you might enjoy preparing, serving for yourself and others. When recipes are found you will be directed to a modal to view recipes based on your filters used for this search. <span className="">Start playing!</span></p>

        {/* <p className="leading-relaxed font-light  w-2/3 mx-auto">When recipes are found you will be directed to a modal to view recipes based on your filters used for this search.</p> */}

        {/* <p className="text-center">Start playing!</p> */}
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