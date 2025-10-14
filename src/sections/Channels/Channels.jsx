import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "./_channels.scss";

import "swiper/css";
import "swiper/css/navigation";

import ChannelYes1 from "../../assets/channels/yes1-1.webp";
import ChannelYes2 from "../../assets/channels/yes2-2.webp";
import ChannelYes3 from "../../assets/channels/yes3-3.webp";
import ChannelYes4 from "../../assets/channels/yes4-4.webp";
import ChannelYes5 from "../../assets/channels/yes5.png";
import ChannelOne1 from "../../assets/channels/One-1.png";
import ChannelOne2 from "../../assets/channels/One-2.png";

import { leftArrow } from "../../assets/leftArrow";
import { rightArrow } from "../../assets/rightArrow";

export default function Channels({ onChannelSelect }) {
  const channels = [
    {
      channelName: "Yes 1",
      channelLogo: ChannelYes1,
      url: "https://nextbet7.tv/kanal-izle/yes1",
    },
    {
      channelName: "Yes 2",
      channelLogo: ChannelYes2,
      url: "https://nextbet7.tv/kanal-izle/yes2",
    },
    {
      channelName: "One 1",
      channelLogo: ChannelOne1,
      url: "https://nextbet7.tv/kanal-izle/one1",
    },
    {
      channelName: "One 2",
      channelLogo: ChannelOne2,
      url: "https://nextbet7.tv/kanal-izle/one2",
    },
    {
      channelName: "Yes 3",
      channelLogo: ChannelYes3,
      url: "https://nextbet7.tv/kanal-izle/yes3",
    },
    {
      channelName: "Yes 4",
      channelLogo: ChannelYes4,
      url: "https://nextbet7.tv/kanal-izle/yes4",
    },
    // { channelName: "5 Live", channelLogo: ChannelYes1, url: "https://nextbet7.tv/kanal-izle/5live" },
    {
      channelName: "Yes 5",
      channelLogo: ChannelYes5,
      url: "https://nextbet7.tv/kanal-izle/yes5",
    },
    // { channelName: "5 Plus", channelLogo: ChannelYes1, url: "https://nextbet7.tv/kanal-izle/5plus" },
    // { channelName: "5 Gold", channelLogo: ChannelYes1, url: "https://nextbet7.tv/kanal-izle/5gold" },
    // { channelName: "5 Stars", channelLogo: ChannelYes1, url: "https://nextbet7.tv/kanal-izle/5stars" },
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const slidesPerView = channels.length > 5 ? 5 : channels.length - 1;
  const spaceBetween = 10;

  return (
    <section className="s-channels">
      <button
        ref={prevRef}
        className="s-channels__button"
        style={{ display: "block" }}
      >
        {leftArrow}
      </button>
      <Swiper
        slidesPerView={slidesPerView}
        centeredSlides={false}
        spaceBetween={spaceBetween}
        loop={true}
        watchSlidesProgress={false}
        modules={[Navigation, Pagination]}
        className="mySwiper"
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.update();
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        {channels.map((item, index) => (
          <SwiperSlide
            key={index}
            className="s-channels__item"
            style={{
              width: `calc((100% - ${
                slidesPerView - 1
              }*${spaceBetween}px)/${slidesPerView})`,
              cursor: "pointer",
            }}
            onClick={() => onChannelSelect && onChannelSelect(item.url)}
          >
            <img src={item.channelLogo} alt={item.channelName}></img>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        ref={nextRef}
        className="s-channels__button"
        style={{ display: "block" }}
      >
        {rightArrow}
      </button>
    </section>
  );
}
