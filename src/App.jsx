import { useEffect, useState } from "react"
import AdBannerImg from "./assets/next-1000-100-1.gif"
import Channels from "./sections/Channels/Channels"
import Footer from "./sections/Footer/Footer"
import Header from "./sections/Header/Header"
import Player from "./sections/Player/Player"
import PreHeader from "./sections/PreHeader/PreHeader"
import SportsBrowser from "./sections/StreamsList/SportsBrowser"

import AdBanner from "./components/AdBanner/AdBanner"
import Banner from "./components/Banner/Banner"
import EmbeddedStream from "./components/EmbeddedStream/EmbeddedStream"
import GlobalContextMenu from "./components/GlobalContextMenu/GlobalContextMenu"
import UpcomingMatches from "./components/UpcomingMatches/UpcomingMatches"
import { AppConfig } from "./config/app.config"
import { useIPTVData } from "./hooks/useIPTVData"
import Offers from "./sections/Offers/Offers"

export default function App() {
  const { data, loading, error } = useIPTVData()
  console.log(data)
  const [selectedStream, setSelectedStream] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [isChannelLoading, setIsChannelLoading] = useState(false)
  const [isScheduledMatch, setIsScheduledMatch] = useState(false)
  const [showInitialMessage, setShowInitialMessage] = useState(true)

  const handleStreamSelect = (match) => {
    setShowInitialMessage(false)
    if (match.status === "scheduled") {
      setIsScheduledMatch(true)
      setSelectedChannel(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const proxyUrl = `${AppConfig.baseBackUrl}/proxy/${match.stream_url}`
      setSelectedStream(proxyUrl)
      setSelectedChannel(null)
      setIsScheduledMatch(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleChannelSelect = (channelUrl) => {
    setShowInitialMessage(false)
    setSelectedChannel(channelUrl)
    setIsChannelLoading(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Таймер для скрытия loader через 5 секунд
  useEffect(() => {
    if (isChannelLoading) {
      const timer = setTimeout(() => {
        setIsChannelLoading(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [isChannelLoading])
  return (
    <>
      <PreHeader />
      <Header />
      <main>
        <Channels onChannelSelect={handleChannelSelect} />
        <AdBanner link="https://heylink.me/PrinceBet77" imgUrl={AdBannerImg} />
        {/* <img src={AdBanner} alt='Ad banner' className='s-ad'/> */}

        {/* Показываем iframe если выбран канал, иначе плеер */}
        {selectedChannel ? (
          <EmbeddedStream src={selectedChannel} showLoader={isChannelLoading} />
        ) : (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
            {selectedStream && <Player src={selectedStream} className="hls-player--fluid" />}
            {showInitialMessage && (
              <div className="scheduled-overlay">
                <div className="scheduled-overlay__content">
                  <p>בחר ערוץ או משחק</p>
                </div>
              </div>
            )}
            {isScheduledMatch && (
              <div className="scheduled-overlay">
                <div className="scheduled-overlay__content">
                  <p>השידור טרם החל</p>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && <div className="loading">...טוען ערוצים</div>}
        {error && <div className="error">שגיאת טעינה: {error}</div>}
        {data && (
          <>
            <SportsBrowser data={data} onStreamSelect={handleStreamSelect} />
            {data.scheduledMatches && data.scheduledMatches.length > 0 && (
              <UpcomingMatches matches={data.scheduledMatches} />
            )}
          </>
        )}

        <AdBanner link="https://heylink.me/PrinceBet77" imgUrl={AdBannerImg} />
        <h1 className="h1">מבצעים</h1>
        <Offers />
        {/* <RtlMenu/> */}
        <GlobalContextMenu
          // items={}
          disableOnSelectors={[
            "input",
            "textarea",
            "[contenteditable=true]",
            ".allow-native-menu",
          ]}
        />
        <Banner side="left" />
        <Banner side="right" />
        {/* <Hero />
  <Features />
  <HowItWorks />
  <Payments />
  <Pricing />
  <FAQ /> */}
      </main>
      <Footer />
    </>
  )
}
