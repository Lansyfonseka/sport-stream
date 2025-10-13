import Container from '../../components/Container/Container'
import './_preHeader.scss';
import { InstagramLogo } from '../../assets/instagram';
import { TwitterLogo } from '../../assets/twitter';
import { TelegramLogo } from '../../assets/telegram';
import { YoutubeLogo } from '../../assets/youtube';


export default function PreHeader(){
return (
<div className="s-preHeader" role="contentinfo">
  <div className='s-preHeader__link'>
    הכתובת העדכנית שלנו: 
    <a href="https://nextbet7.net/" target="_blank" rel="noopener">https://nextbet7.net/</a>
  </div>
  <div className='s-preHeader__social'>
    <a href='https://www.instagram.com/nextbetsport7' target='_blank' rel='noopener' aria-label='Instagram' className='s-preHeader__social_icon'>{InstagramLogo}</a>
    <a href='https://www.twitter.com/nextbet7' target='_blank' rel='noopener' aria-label='Instagram' className='s-preHeader__social_icon'>{TwitterLogo}</a>
    <a href='https://www.youtube.com/@nextbet7' target='_blank' rel='noopener' aria-label='Instagram' className='s-preHeader__social_icon'>{YoutubeLogo}</a>
    <a href='https://t.me/+wBRqrYtFvFQ4NzA0' target='_blank' rel='noopener' aria-label='Instagram' className='s-preHeader__social_icon'>{TelegramLogo}</a>
  </div>
</div>
)
}