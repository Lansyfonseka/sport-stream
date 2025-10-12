export default function Container({ children, size = 'lg' }) {
return <div className={`c-container c-container--${size}`}>{children}</div>
}