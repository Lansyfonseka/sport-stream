export default function Card({ title, text, icon }) {
return (
<article className="c-card">
{icon && <div className="c-card__icon" aria-hidden>{icon}</div>}
<h3 className="c-card__title">{title}</h3>
<p className="c-card__text">{text}</p>
</article>
)
}