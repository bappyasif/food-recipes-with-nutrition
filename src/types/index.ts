export type ViewedMealCardType = {
    name: string,
    category: string,
    picture: string,
    nutrition: number
}

export type CategoriesCuisinesCarouselType = {
    name: string,
    picture: string
}

export type ReuseableCarouselType = {
    title: string,
    items: CategoriesCuisinesCarouselType[]
}

type SlideTypes = {
    introline: string;
    id: string;
    content: {
        image: string;
        copy: string;
    };
}

export type CarouselDataType = {
    data: SlideTypes[],
    leadingText: string
}

export type MouseWheelBasedCarouselType = {
    rndNum: number,
    handleRandomNumber: () => void,
    handleResetRandomNumber: () => void,
    dataset:CategoriesCuisinesCarouselType[]
}