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
import RtlMenu from './components/RtlMenu/RtlMenu'
import Demo from './components/RtlMenu/Demo'

export default function App(){
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
    <Demo/>
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