import Container from '../Container/Container'
import AuthButtons from '../AuthButtons/AuthButtons'


export default function Navbar(){
return (
<nav className="c-navbar" aria-label="Главная навигация">
<Container size="xl">
<div className="c-navbar__row">
<a className="c-navbar__brand" href="#hero" aria-label="На главную">NextLike</a>
<ul className="c-navbar__links">
<li><a href="#live">Live</a></li>
<li><a href="#sports">Спорт</a></li>
<li><a href="#casino">Казино</a></li>
<li><a href="#promo">Бонусы</a></li>
</ul>
<AuthButtons />
</div>
</Container>
</nav>
)
}