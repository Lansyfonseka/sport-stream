import { useEffect, useState } from 'react'

export const useTick = (time) => {
	const [tickRef, setTickRef] = useState(false)
	useEffect(() => {
		const id = setInterval(() => setTickRef(prev => !prev), time)
		return () => clearInterval(id)
	})

	return tickRef
}
