import clsx from 'clsx'


export default function Button({ as: Tag = 'button', variant = 'primary', size = 'md', className, children, ...props }) {
return (
<Tag
className={clsx(
'c-button',
`c-button--${variant}`,
`c-button--${size}`,
className
)}
{...props}
>
{children}
</Tag>
)
}