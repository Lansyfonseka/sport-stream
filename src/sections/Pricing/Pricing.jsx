import Container from '../../components/Container/Container'
import Button from '../../components/Button/Button'


const plans = [
{ name: 'Старт', price: '0$', features: ['1 проект','Базовые блоки','E-mail поддержка'] },
{ name: 'Профи', price: '29$', features: ['Безлимит','Все секции','Приоритетная поддержка'] },
{ name: 'Бизнес', price: '99$', features: ['Команда','Дизайн‑система','SLA 99.9%'] }
]


export default function Pricing(){
return (
<section id="pricing" className="s-pricing" aria-labelledby="pricing-title">
<Container>
<h2 id="pricing-title" className="u-section-title">Тарифы</h2>
<div className="s-pricing__grid">
{plans.map((p) => (
<article key={p.name} className="s-pricing__card">
<h3 className="s-pricing__name">{p.name}</h3>
<div className="s-pricing__price">{p.price}<span>/мес</span></div>
<ul className="s-pricing__list">
{p.features.map((f) => <li key={f}>{f}</li>)}
</ul>
<Button className="s-pricing__cta" variant="primary">Выбрать</Button>
</article>
))}
</div>
</Container>
</section>
)
}