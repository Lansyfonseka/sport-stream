import Logo from '../../assets/NEXTBETLOGO.png';
import './_header.scss'

export default function Header(){

  const menu = [
    {titel: 'Live betting', icon: "boll", url: 'https://heylink.me/nextbet7/'},
    {titel: 'E-sports', icon: "rocket", url: 'https://heylink.me/nextbet7/'},
    {titel: 'Specials', icon: "coins", url: 'https://heylink.me/nextbet7/'},
    {titel: 'Telegram', icon: "diamond", url: 'https://heylink.me/nextbet7/'},
    {titel: 'WhatsApp', icon: "cash", url: 'https://heylink.me/nextbet7/'}
  ]

return (
<header className="s-header" data-sticky>
  <div className="s-header__logo">
    <img src={Logo} alt="logo" />
  </div>
  <div className='s-header__menu'>
    {menu.map((item, index) => 
      <a key={index} href={item.url} className='c-link' target='_blank' rel="noopener noreferrer">
        <span className={'c-link__icon '+item.icon}></span>
        <span className='c-link__title'>{item.titel}</span>
      </a>
    )}
    <div className='s-header__menu_item'>
    </div>
  </div>
</header>
)
}