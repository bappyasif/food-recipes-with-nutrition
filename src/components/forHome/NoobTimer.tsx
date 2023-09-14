import React, { useEffect, useState } from 'react'

export const NoobTimer = () => {
    const [countdown, setCountdown] = useState(20);

    const [pause, setPause] = useState(false)
    
    // const tick = () => setCountdown(prev => prev > 0 ? prev - 1 : 0)
    const tick = () => setCountdown(countdown > 0 ? countdown - 1 : 0)

    useEffect(() => {
        const timer = setInterval(() => {
            if(!pause) {
                console.log("up tick")
                if(countdown > 0) {
                    tick()
                } else {
                    clearInterval(timer);
                }
            } else {
                console.log("clear time")
                clearInterval(timer)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown, pause])

  return (
    <div>
        NoobTimer - {countdown}
        <button onClick={() => setPause(true)}>pause</button>
        <button onClick={() => setPause(false)}>play</button>
    </div>
  )
}
