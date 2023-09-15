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