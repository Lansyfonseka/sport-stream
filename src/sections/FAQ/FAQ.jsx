import Container from '../../components/Container/Container'


const items = [
{q:'Можно ли адаптировать под любой сайт?', a:'Да, меняем стили/контент, не копируя защищённые материалы.'},
{q:'Будет ли тёмная тема?', a:'Есть базовая поддержка через SASS темы и data-theme.'},
]


export default function FAQ(){
return (
<section id="faq" className="s-faq" aria-labelledby="faq-title">
<Container>
<h2 id="faq-title" className="u-section-title">FAQ</h2>
<div className="s-faq__list">
{items.map((it, i) => (
<details key={i} className="s-faq__item">
<summary>{it.q}</summary>
<p>{it.a}</p>
</details>
))}
</div>
</Container>
</section>
)
}