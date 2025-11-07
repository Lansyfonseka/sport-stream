import { useRef } from "react"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "./_channels.scss"

import "swiper/css"
import "swiper/css/navigation"

import Channel5Gold from "../../assets/channels/5gold.png"
import ChannelOne1 from "../../assets/channels/One-1.png"
import ChannelOne2 from "../../assets/channels/One-2.png"
import ChannelYes5Live from "../../assets/channels/yes-5-Live.webp"
import ChannelYes5Plus from "../../assets/channels/yes-5-Plus.webp"
import ChannelYes5Stars from "../../assets/channels/yes-5-Stars.webp"
import ChannelYes1 from "../../assets/channels/yes1-1.webp"
import ChannelYes2 from "../../assets/channels/yes2-2.webp"
import ChannelYes3 from "../../assets/channels/yes3-3.webp"
import ChannelYes4 from "../../assets/channels/yes4-4.webp"
import ChannelYes5 from "../../assets/channels/yes5.png"

import { leftArrow } from "../../assets/leftArrow"
import { rightArrow } from "../../assets/rightArrow"
import { AppConfig } from '../../config/app.config'
const config = AppConfig
export default function Channels({ onChannelSelect, selectedChannel }) {
  const channels = [
    {
      channelName: "Yes 1",
      channelLogo: ChannelYes1,
      url: `${config.baseBackUrl}/hls/Sport_1/index.m3u8`,
    },
    {
      channelName: "Yes 2",
      channelLogo: ChannelYes2,
      url: `${config.baseBackUrl}/hls/Sport_2/index.m3u8`,
    },
    {
      channelName: "One 1",
      channelLogo: ChannelOne1,
      url: `${config.baseBackUrl}/hls/ONE_HD/index.m3u8`,
    },
    {
      channelName: "One 2",
      channelLogo: ChannelOne2,
      url: `${config.baseBackUrl}/hls/ONE2_HD/index.m3u8`,
    },
    {
      channelName: "Yes 3",
      channelLogo: ChannelYes3,
      url: `${config.baseBackUrl}/hls/Sport_3/index.m3u8`,
    },
    {
      channelName: "Yes 4",
      channelLogo: ChannelYes4,
      url: `${config.baseBackUrl}/hls/Sport_4/index.m3u8`,
    },
    {
      channelName: "5 Live",
      channelLogo: ChannelYes5Live,
      url: `${config.baseBackUrl}/hls/Sport_5_Live/index.m3u8`,
    },
    {
      channelName: "Yes 5",
      channelLogo: ChannelYes5,
      url: `${config.baseBackUrl}/hls/Sport_5/index.m3u8`,
    },
    {
      channelName: "5 Plus",
      channelLogo: ChannelYes5Plus,
      url: `${config.baseBackUrl}/hls/Sport_5_PLUS/index.m3u8`,
    },
    {
      channelName: "5 Gold",
      channelLogo: Channel5Gold,
      url: `${config.baseBackUrl}/hls/Sport_5_GOLD/index.m3u8`,
    },
    {
      channelName: "5 Stars",
      channelLogo: ChannelYes5Stars,
      url: `${config.baseBackUrl}/hls/Sport_5_Stars/index.m3u8`,
    },
  ]

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const slidesPerView = channels.length > 5 ? 5 : channels.length - 1
  const spaceBetween = 10

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
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 8 },
          480: { slidesPerView: 3, spaceBetween: 8 },
          670: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 5, spaceBetween: 10 },
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current
          swiper.params.navigation.nextEl = nextRef.current
          swiper.navigation.update()
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        {channels.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`s-channels__item ${selectedChannel === item.url ? 's-channels__item--active' : ''}`}
            style={{
              width: `calc((100% - ${slidesPerView - 1
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
  )
}
