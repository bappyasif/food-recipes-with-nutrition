"use client"

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

// import './styles.css';
import styles from "./Swiper.module.css"

// import required modules
import { FreeMode, Navigation, Pagination } from 'swiper/modules';

export const VerticalCarousel = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        direction={"vertical"}
        // pagination={{
        //   clickable: true
        // }}
        loop={true}
        navigation={true}
        modules={[Navigation, FreeMode]}
        className={`${styles["mySwiper"]} ${styles["swiper"]}`}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>

      <Swiper
        style={{
        //   '--swiper-navigation-color': '#fff',
        //   '--swiper-pagination-color': '#fff',
        }}
        // direction={'vertical'}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation]}
        className={`${styles["mySwiper2"]} ${styles["swiper"]}`}
      >
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
        <SwiperSlide className={`${styles["swiper-slide"]}`}>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
