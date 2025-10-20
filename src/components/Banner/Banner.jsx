import { useState } from 'react'
import BannerGif from '../../assets/side-banner.gif'
import './_banner.scss'

export default function Banner({ side = 'left' }) {
  const [display, setDisplay] = useState('block')

  return (
    <div className={'c-banner' + (side ? ' ' + side : '')} style={{ display: display }}>
      <button className='c-banner__close' onClick={() => setDisplay('none')}>x</button>
      <a href="https://heylink.me/PrinceBet77" className='c-banner__link' target="_blank" rel="nofollow noopener">
        <img src={BannerGif} alt="banner" />
      </a>
    </div>
  )
}