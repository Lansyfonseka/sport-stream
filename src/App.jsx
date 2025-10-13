import Header from './sections/Header/Header'
import Footer from './sections/Footer/Footer'
import PreHeader from './sections/PreHeader/PreHeader'
import Channels from './sections/Channels/Channels'
import AdBannerImg from './assets/next-1000-100-1.gif'
import Player from './sections/Player/Player'
import SportsBrowser from './sections/StreamsList/SportsBrowser'

import data from "./test/test-matches-from-screenshot-extended-with-categories.json";
import Banner from './components/Banner/Banner'
import AdBanner from './components/AdBanner/AdBanner'
import Offers from './sections/Offers/Offers'
import GlobalContextMenu from './components/GlobalContextMenu/GlobalContextMenu'

export default function App(){
   const items = [
    { id: "reload", label: "Reload", onSelect: () => location.reload() },
    { id: "copy-url", label: "Copy page URL", onSelect: () => navigator.clipboard.writeText(location.href) },
    { divider: true },
    { id: "inspect", label: "Open DevTools (hint)", onSelect: () => alert("Press F12 🙂") },
  ];
return (
<>
  <PreHeader/>
  <Header />
  <main>
    <Channels/>
    <AdBanner link='https://heylink.me/nextbet7/' imgUrl={AdBannerImg}/>
    {/* <img src={AdBanner} alt='Ad banner' className='s-ad'/> */}
    <Player 
    src="https://cf.1anonsports.online/x/17417718.m3u8"
    className="hls-player--fluid"
    />
    <SportsBrowser data={data} />
    <AdBanner link='https://heylink.me/nextbet7/' imgUrl={AdBannerImg}/>
    <h1 className='h1'>מבצעים</h1>
    <Offers/>
    {/* <RtlMenu/> */}
    <GlobalContextMenu
        items={items}
        disableOnSelectors={["input", "textarea", "[contenteditable=true]", ".allow-native-menu"]}
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
)
}