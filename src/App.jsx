import { useState, useEffect } from "react";
import Header from "./sections/Header/Header";
import Footer from "./sections/Footer/Footer";
import PreHeader from "./sections/PreHeader/PreHeader";
import Channels from "./sections/Channels/Channels";
import AdBannerImg from "./assets/next-1000-100-1.gif";
import Player from "./sections/Player/Player";
import SportsBrowser from "./sections/StreamsList/SportsBrowser";

import Banner from "./components/Banner/Banner";
import AdBanner from "./components/AdBanner/AdBanner";
import Offers from "./sections/Offers/Offers";
import GlobalContextMenu from "./components/GlobalContextMenu/GlobalContextMenu";
import EmbeddedStream from "./components/EmbeddedStream/EmbeddedStream";
import UpcomingMatches from "./components/UpcomingMatches/UpcomingMatches";
import { useIPTVData } from "./hooks/useIPTVData";
import { AppConfig } from "./config/app.config";

export default function App() {
  const { data, loading, error } = useIPTVData();
  console.log(data);
  const [selectedStream, setSelectedStream] = useState(
    "https://cf.1anonsports.online/x/17417718.m3u8"
  );
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [isScheduledMatch, setIsScheduledMatch] = useState(false);

  const handleStreamSelect = (match) => {
    if (match.status === "scheduled") {
      setIsScheduledMatch(true);
      setSelectedChannel(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const proxyUrl = `${AppConfig.baseBackUrl}/proxy/${match.stream_url}`;
      setSelectedStream(proxyUrl);
      setSelectedChannel(null);
      setIsScheduledMatch(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChannelSelect = (channelUrl) => {
    setSelectedChannel(channelUrl);
    setIsChannelLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Таймер для скрытия loader через 5 секунд
  useEffect(() => {
    if (isChannelLoading) {
      const timer = setTimeout(() => {
        setIsChannelLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isChannelLoading]);
  return (
    <>
      <PreHeader />
      <Header />
      <main>
        <Channels onChannelSelect={handleChannelSelect} />
        <AdBanner link="https://heylink.me/nextbet7/" imgUrl={AdBannerImg} />
        {/* <img src={AdBanner} alt='Ad banner' className='s-ad'/> */}

        {/* Показываем iframe если выбран канал, иначе плеер */}
        {selectedChannel ? (
          <EmbeddedStream src={selectedChannel} showLoader={isChannelLoading} />
        ) : (
          <div style={{ position: "relative" }}>
            <Player src={selectedStream} className="hls-player--fluid" />
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

        <AdBanner link="https://heylink.me/nextbet7/" imgUrl={AdBannerImg} />
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
  );
}
