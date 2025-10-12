import Header from './sections/Header/Header'
import Footer from './sections/Footer/Footer'
import PreHeader from './sections/PreHeader/PreHeader'
import Channels from './sections/Channels/Channels'
import AdBanner from './assets/next-1000-100-1.gif'
import Player from './sections/Player/Player'
import SportsBrowser from './sections/StreamsList/SportsBrowser'

import data from "./test/test-matches-from-screenshot-extended-with-categories.json";

export default function App(){
return (
<>
  <PreHeader/>
  <Header />
  <main>
    <Channels/>
    <img src={AdBanner} alt='Ad banner' className='s-ad'/>
    <Player 
    src="https://cf.1anonsports.online/x/17417718.m3u8"
    className="hls-player--fluid"
    />
    <SportsBrowser data={data} />
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