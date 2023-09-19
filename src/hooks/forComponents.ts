import { ChangeEvent, useEffect, useState } from "react";

export const useForPauseAndPlayMealScroll = () => {
    const [seconds, setSeconds] = useState(30);
    const [pause, setPause] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!pause) { //I used '!paused' because I set pause initially to false. 
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    });

    const handlePauseToggle = () => {
        setPause(!pause);
    }

    return {
        handlePauseToggle,
    }
}

export const useForTruthToggle = () => {
    const [isTrue, setIsTrue] = useState(false);

    const handleTruthy = () => setIsTrue(true)

    const handleFalsy = () => setIsTrue(false)

    return {isTrue, handleFalsy, handleTruthy}
}

export const useForInputTextChange = () => {
    const [text, setText] = useState("");

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => setText(e.target.value)

    return {text, handleTextChange}
}