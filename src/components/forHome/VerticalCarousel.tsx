"use client"

import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
// import { ReactComponent as Next } from "./assets/chevronDown.svg";
// import { ReactComponent as Prev } from "./assets/chevronUp.svg";
// import "./styles.css";
import styles from "@/app/Home.module.css"
import { CarouselDataType } from "@/types";

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({data, leadingText}: CarouselDataType) => {
  const [activeIndex, setActiveIndex] = useState(0);

//   const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Used to determine the height/spacing of each item
  const itemHeight = 52;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex:number) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(data.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (data.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }
  };

  const handleClick = (direction:string) => {
    setActiveIndex((prevIndex) => {
      if (direction === "next") {
        if (prevIndex + 1 > data.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      }

      if (prevIndex - 1 < 0) {
        return data.length - 1;
      }

      return prevIndex - 1;
    });
  };

  return (
    <div className={styles.container}>
      <section className={styles["outer-container"]}>
        <div className={styles["carousel-wrapper"]}>
          <button
            type="button"
            className={`${styles["carousel-button"]} prev`}
            onClick={() => handleClick("prev")}
          >
            {/* <Prev /> */}
            "Prev"
          </button>

          <div className={styles["carousel"]}>
            {/* <div className="leading-text">
              <p>{leadingText}</p>
            </div> */}
            <div className={styles["slides"]}>
              <div className={styles["carousel-inner"]}>
                {data.map((item, i) => (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(styles["carousel-item"], {
                      active: activeIndex === i,
                      visible:
                        Math.abs(determinePlacement(i) as number) <= visibleStyleThreshold
                    })}
                    key={item.id}
                    style={{
                      transform: `translateY(${determinePlacement(i)}px)`
                    }}
                  >
                    {item.introline}
                    {/* {item} */}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`${styles["carousel-button"]} next`}
            onClick={() => handleClick("next")}
          >
            {/* <Next /> */}
            "Next"
          </button>
        </div>
        <div className={styles["content"]}>
          <img
            src={data[activeIndex].content.image}
            // alt={data[activeIndex].content.introline}
          />
          <p>{data[activeIndex].content.copy}</p>
          {/* "Card Content" */}
        </div>
      </section>
    </div>
  );
};

VerticalCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  leadingText: PropTypes.string.isRequired
};

export default VerticalCarousel;