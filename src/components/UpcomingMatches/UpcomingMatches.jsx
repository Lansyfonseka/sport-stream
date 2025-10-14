import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "./_upcoming-matches.scss";

import "swiper/css";
import "swiper/css/navigation";

import { leftArrow } from "../../assets/leftArrow";
import { rightArrow } from "../../assets/rightArrow";

export default function UpcomingMatches({ matches }) {
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!matches || matches.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const handleNext = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  return (
    <section className="upcoming-matches">
      <button onClick={handlePrev} className="upcoming-matches__button">
        {leftArrow}
      </button>
      <Swiper
        onSwiper={setSwiperInstance}
        slidesPerView={5}
        centeredSlides={false}
        spaceBetween={15}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="upcoming-matches__swiper"
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 15 },
          1280: { slidesPerView: 5, spaceBetween: 15 },
        }}
      >
        {matches.map((match, index) => (
          <SwiperSlide key={index} className="upcoming-matches__slide">
            <div className="match-card">
              <div className="match-card__time">
                {match.date} {match.kickoff_local}
              </div>
              
              <div className="match-card__title">
                {match.home.name}-{match.away.name}
              </div>
              
              <div className="match-card__teams">
                <div className="match-card__team">
                  {match.home.logo_url ? (
                    <img 
                      src={match.home.logo_url} 
                      alt={match.home.name}
                      className="match-card__flag"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div className="match-card__flag-placeholder"></div>
                  )}
                </div>
                
                <div className="match-card__separator">-</div>
                
                <div className="match-card__team">
                  {match.away.logo_url ? (
                    <img 
                      src={match.away.logo_url} 
                      alt={match.away.name}
                      className="match-card__flag"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div className="match-card__flag-placeholder"></div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button onClick={handleNext} className="upcoming-matches__button">
        {rightArrow}
      </button>
    </section>
  );
}
