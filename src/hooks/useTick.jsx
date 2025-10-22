import { useEffect, useState } from 'react'

export function useTickWithAction(
	time,
	callback,
	args
) {
	const [state, setState] = useState(() => callback(...args))

	useEffect(() => {
		const id = setInterval(() => {
			setState(callback(...args))
		}, time)

		return () => clearInterval(id)
	}, [time, callback, ...args])

	return state
}
