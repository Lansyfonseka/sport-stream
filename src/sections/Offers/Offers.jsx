import OfferImg1 from '../../assets/1.png'
import OfferImg2 from '../../assets/2.png'
import OfferImg3 from '../../assets/3.png'
import OfferImg4 from '../../assets/4.png'
import OfferImg5 from '../../assets/5.png'
import OfferImg6 from '../../assets/6.png'

import './_offers.scss'

export default function Offers() {
  return (
    <div className='s-offers'>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg1} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg2} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg3} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg4} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg5} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
      <a href="https://heylink.me/PrinceBet77" target="_blank" className='s-offers__link'>
        <img src={OfferImg6} alt="Kampanya 1" className='s-offers__link_img' />
      </a>
    </div>
  )
}