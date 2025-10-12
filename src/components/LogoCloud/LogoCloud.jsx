export default function LogoCloud() {
const items = ['logo-1.svg','logo-2.svg','logo-3.svg','logo-4.svg']
return (
<ul className="c-logocloud" aria-label="Компании, которые нам доверяют">
{items.map((src, i) => (
<li key={i} className="c-logocloud__item">
<img src={`/images/logos/${src}`} alt="Логотип компании" loading="lazy" />
</li>
))}
</ul>
)
}