"use client"
import styles from "@/app/Home.module.css"

// tryout #02
export const MouseWheelBasedVertical = () => {

    const divs = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    const renderDivs = () => divs.map(v => <CardItem key={v} val={v} />)

    return (
        <div className="absolute top-[50%] flex justify-center h-96 w-60 bg-primary-focus">
            <div 
                className="flex flex-col items-center justify-center outerDiv"
            >
                {renderDivs()}
            </div>
        </div>
    )
}

const CardItem = ({val}: {val: string}) => {
    return (
        <div
            className={`w-full flex items-center justify-between rounded-xl p-5 opacity-0 drop-shadow-2xl ${styles.carouselCardItem}`}
        >
            <h2 className="text-primary-content">{val}</h2>
        </div>
    )
}



// tryout #01
// export const MouseWheelBasedVertical = () => {

//     const divs = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

//     const renderDivs = () => divs.map(v => <CardItem key={v} val={v} />)

//     return (
//         <div className="absolute top-[50%] flex justify-center h-96 w-60 bg-primary-focus">
//             <div 
//                 className="relative w-full flex flex-col justify-center"
//             >
//                 {renderDivs()}
//             </div>
//         </div>
//     )
// }

// const CardItem = ({val}: {val: string}) => {
//     return (
//         <div
//             className={`absolute w-full flex items-center p-0 drop-shadow-2xl ${styles.carouselItem}`}
//         >
//             <h2 className="text-primary-content">{val}</h2>
//         </div>
//     )
// }