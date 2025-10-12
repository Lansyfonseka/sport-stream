import Container from '../../components/Container/Container'


export default function Footer(){
return (
<footer className="s-footer" role="contentinfo">
<Container>
<div className="s-footer__row">
<p>© {new Date().getFullYear()} Brand. Все права защищены.</p>
<ul className="s-footer__links">
<li><a href="#">Политика конфиденциальности</a></li>
<li><a href="#">Условия</a></li>
</ul>
</div>
</Container>
</footer>
)
}