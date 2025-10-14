import { useState } from "react";
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
import { useIPTVData } from "./hooks/useIPTVData";

export default function App() {
  const { data, loading, error } = useIPTVData();
  console.log(data);
  const [selectedStream, setSelectedStream] = useState(
    "https://cf.1anonsports.online/x/17417718.m3u8"
  );

  const handleStreamSelect = (match) => {
    const proxyUrl = `http://localhost:3001/proxy/${match.stream_url}`;

    setSelectedStream(proxyUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <PreHeader />
      <Header />
      <main>
        <Channels />
        <AdBanner link="https://heylink.me/nextbet7/" imgUrl={AdBannerImg} />
        {/* <img src={AdBanner} alt='Ad banner' className='s-ad'/> */}
        <EmbeddedStream src="https://nextbet7.tv/kanal-izle/yes5" />
        <Player src={selectedStream} className="hls-player--fluid" />

        {loading && <div className="loading">Загрузка каналов...</div>}
        {error && <div className="error">Ошибка загрузки: {error}</div>}
        {data && (
          <SportsBrowser data={data} onStreamSelect={handleStreamSelect} />
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
        {/* <Banner side='left'/>
    <Banner side='right'/> */}
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
