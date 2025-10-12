import Logo from '../../assets/NEXTBETLOGO.png';
import './_header.scss'

export default function Header(){

  const menu = [
    {titel: 'Live betting', icon: "boll", url: ''},
    {titel: 'E-sports', icon: "rocket", url: ''},
    {titel: 'Specials', icon: "coins", url: ''},
    {titel: 'Telegram', icon: "diamond", url: ''},
    {titel: 'WhatsApp', icon: "cash", url: ''}
  ]

return (
<header className="s-header" data-sticky>
  <div className="s-header__logo">
    <img src={Logo} alt="logo" />
  </div>
  <div className='s-header__menu'>
    {menu.map(item => 
      <a href={item.url} className='c-link'>
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