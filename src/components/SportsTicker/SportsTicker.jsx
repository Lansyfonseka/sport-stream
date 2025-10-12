import { useEffect, useRef } from 'react'


const data = [
{ t:"UEFA Qualifiers", m:"Netherlands vs France", time:"22:45" },
{ t:"La Liga", m:"Real Madrid vs Girona", time:"23:00" },
{ t:"Eredivisie", m:"PSV vs AZ", time:"21:30" }
]


export default function SportsTicker(){
const ref = useRef(null)
useEffect(()=>{ /* при желании можно добавить автоскролл */ },[])
return (
<div className="c-ticker" role="region" aria-label="Лента матчей">
<div className="c-ticker__track" ref={ref}>
{data.map((it,i)=> (
<span key={i} className="c-ticker__item">
<b>{it.t}</b> · {it.m} · <time>{it.time}</time>
</span>
))}
</div>
</div>
)
}