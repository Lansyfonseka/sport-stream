import './_header.scss'

export default function Header() {

  const menu = [
    { titel: 'הימורים בשידור חי', icon: "boll", url: 'https://heylink.me/PrinceBet77' },
    { titel: 'ספורט אלקטרוני', icon: "rocket", url: 'https://heylink.me/PrinceBet77' },
    { titel: 'מבצעים', icon: "coins", url: 'https://heylink.me/PrinceBet77' },
    { titel: 'ערוץ מבצעים - טלגרם', icon: "diamond", url: 'https://heylink.me/PrinceBet77' },
    { titel: 'ווטסאפ - הרשמה 24/7', icon: "cash", url: 'https://heylink.me/PrinceBet77' }
  ]

  return (
    <header className="s-header" data-sticky>
      <div className="s-header__logo">
        <img src={'/princebet77_logo.svg'} alt="logo" />
      </div>
      <div className='s-header__menu'>
        {menu.map((item, index) =>
          <a key={index} href={item.url} className='c-link' target='_blank' rel="noopener noreferrer">
            <span className={'c-link__icon ' + item.icon}></span>
            <span className='c-link__title'>{item.titel}</span>
          </a>
        )}
        <div className='s-header__menu_item'>
        </div>
      </div>
    </header>
  )
}