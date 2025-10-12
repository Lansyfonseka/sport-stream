import { useForm } from 'react-hook-form'
import Container from '../../components/Container/Container'
import Button from '../../components/Button/Button'


export default function Contact(){
const { register, handleSubmit, reset } = useForm()
const onSubmit = (data) => { alert(JSON.stringify(data, null, 2)); reset(); }


return (
<section id="contact" className="s-contact" aria-labelledby="contact-title">
<Container>
<h2 id="contact-title" className="u-section-title">Связаться с нами</h2>
<form className="s-contact__form" onSubmit={handleSubmit(onSubmit)}>
<label>
<span>Имя</span>
<input {...register('name', { required: true })} placeholder="Ваше имя" />
</label>
<label>
<span>Email</span>
<input type="email" {...register('email', { required: true })} placeholder="you@example.com" />
</label>
<label className="s-contact__full">
<span>Сообщение</span>
<textarea rows="4" {...register('message', { required: true })} placeholder="Чем можем помочь?" />
</label>
<Button variant="primary" size="lg">Отправить</Button>
</form>
</Container>
</section>
)
}