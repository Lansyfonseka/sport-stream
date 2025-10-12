export default function PaymentsStrip(){
const items = ['visa','mastercard','btc','usdt','skrill']
return (
<ul className="c-payments" aria-label="Способы оплаты">
{items.map((it)=> (
<li key={it} className={`c-payments__item c-payments__item--${it}`}>
<img src={`/images/logos/${it}.svg`} alt={it} loading="lazy" />
</li>
))}
</ul>
)
}