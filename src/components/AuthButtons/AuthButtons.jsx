import Button from '../Button/Button'
export default function AuthButtons(){
return (
<div className="c-auth">
<Button as="a" href="#login" variant="ghost" size="md" className="c-auth__login">Вход</Button>
<Button as="a" href="#signup" variant="primary" size="md" className="c-auth__signup">Регистрация</Button>
</div>
)
}