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
    dataset: CategoriesCuisinesCarouselType[]
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
    icon: string
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

export type RecipeMealType = {
    "label": string,
    "images": {
      "THUMBNAIL": {
        "url": string,
        "width": number,
        "height": 0
      },
      "SMALL": {
        "url": string,
        "width": number,
        "height": 0
      },
      "REGULAR": {
        "url": string,
        "width": number,
        "height": 0
      },
      "LARGE": {
        "url": string,
        "width": number,
        "height": 0
      }
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
      {
        "text": string,
        "quantity": number,
        "measure": string,
        "food": string,
        "weight": number,
        "foodId": string
      }
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
    "instructions": [
      string
    ],
    "tags": [
      string
    ],
    "digest": [
      {
        "label": string,
        "tag": string,
        "schemaOrgTag": string,
        "total": number,
        "hasRDI": true,
        "daily": number,
        "unit": string,
        "sub": {}
      }
    ]
  }