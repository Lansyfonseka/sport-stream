import './_banner.scss';
// import BannerGif from '../../assets/banner.gif';
import { useState } from 'react';

export default function Banner({side = 'left'}) {
  const [display, setDisplay] = useState('block')

  return (
    <div className={'c-banner' + (side ? ' '+side : '')} style={{display: display}}>
      <button className='c-banner__close' onClick={() => setDisplay('none')}>x</button>
      <a href="https://heylink.me/nextbet7/" className='c-banner__link' target="_blank" rel="nofollow noopener">
        <img src='../../assets/banner.gif' alt="banner"/>
      </a>
    </div>
  )
}