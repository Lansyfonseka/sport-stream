import Container from '../../components/Container/Container'
import Card from '../../components/Card/Card'


export default function Features(){
const items = [
{ title: 'Модульность', text: 'Компоненты и SASS по 7-1 схеме.' },
{ title: 'Производительность', text: 'Vite, кодсплиттинг, lazy-loading.' },
{ title: 'Доступность', text: 'Правильные роли и aria-атрибуты.' }
]
return (
<section id="features" className="s-features" aria-labelledby="features-title">
<Container>
<h2 id="features-title" className="u-section-title">Преимущества</h2>
<div className="s-features__grid">
{items.map((it, i) => (<Card key={i} title={it.title} text={it.text} />))}
</div>
</Container>
</section>
)
}