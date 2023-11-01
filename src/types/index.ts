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
  items?: CategoriesCuisinesCarouselType[]
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
  // dataset: CategoriesCuisinesCarouselType[]
  dataset: string[]
}

export type DynamicStringKeyType = {
  [key: string]: string
}

export type IngredientsType = {
  ingredients: DynamicStringKeyType[]
}

export type MeasurmentsType = {
  measurements: DynamicStringKeyType[]
}

export type RecipeTypes = {
  idMeal: string,
  strMeal: string,
  strCategory: string,
  strArea: string,
  strInstructions: string,
  strMealThumb: string,
  strTags: string,
  strYoutube: string,
  ingredients: IngredientsType,
  measurements: MeasurmentsType
  strSource?: string,
  count?: number
}

export type NavType = {
  name: string,
  path: string,
  icon: string | React.ReactNode
}

export type CategoryTypes = {
  strCategory: string,
  count: number
}

export type CuisineTypes = {
  strArea: string,
  count: number
}

export type ShallowRoutingTypes = {
  type?: string,
  q?: string,
  app_id?: string,
  app_key?: string,
  health?: string,
  cuisineType?: string,
  mealType?: string,
  dishType?: string
}

export type FiltersTypes = {
  q?: string,
  health?: string[],
  cuisineType?: string[],
  mealType?: string[],
  dishType?: string[],
  diet?: string[],
  co2EmissionsClass?: string[]
}

export type ViewedMealType = {
  images: ImageItemType,
  id: string,
  uri: string,
  label: string,
  calories: number,
  co2EmissionsClass: string,
  cuisineType: string,
  count: number
}

export type RecipeMealType = {
  "lastUpdated"?: Date,
  "uri": string,
  "label": string,
  "cautions": [string],
  "images": {
    "THUMBNAIL": ImageItemType,
    "SMALL": ImageItemType,
    "REGULAR": ImageItemType,
    "LARGE": ImageItemType
  },
  "source": string,
  "url": string,
  "shareAs": string,
  "yield": number,
  "dietLabels": [
    string
  ],
  "healthLabels": [
    string
  ],
  "ingredients": [
    IngredientItemType
  ],
  "calories": number,
  "co2EmissionsClass": string,
  "totalWeight": number,
  "cuisineType": [
    string
  ],
  "mealType": [
    string
  ],
  "dishType": [
    string
  ],
  "tags": [
    string
  ],
  "digest": [
    DigestItemType
  ],
  count?: number
}

export type ImageItemType = {
  "url": string,
  "width": number,
  "height": 0
}

export type IngredientItemType = {
  "text": string,
  "quantity": number,
  "measure": string,
  "food": string,
  "weight": number,
  "foodId": string,
  "image": string,
  "foodCategory": string
}

export type DigestItemType = {
  "label": string,
  "tag": string,
  "schemaOrgTag": string,
  "total": number,
  "hasRDI": true,
  "daily": number,
  "unit": string,
  "sub": {}
}

export type Props = {
  params: { "slug-id": string, [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined },
  // searchParams: { [key: string]: string | string[] },
}