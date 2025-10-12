import Container from '../../components/Container/Container'


export default function Footer(){
return (
<footer className="s-footer" role="contentinfo">
<Container>
<div className="s-footer__row">
<p>© {new Date().getFullYear()} NextLike. Все права защищены.</p>
<ul className="s-footer__links">
<li><a href="#">Условия</a></li>
<li><a href="#">Ответственная игра</a></li>
</ul>
</div>
<p className="s-footer__legal u-muted">Операционная информация и номер лицензии — здесь поместите ваши юридические данные.</p>
</Container>
</footer>
)
}