import { useEffect } from "react";
import "./SnakeGame.scss"

import useSnakeGame, { acceptedKeys, ArrowKey } from "../hooks/useSnakeGame";

type SnakeGameProps = {
    size: number
    tickDuration: number,
    onGameOver(score: number): void
}

export default function SnakeGame({ size, tickDuration, onGameOver }: SnakeGameProps) {
    const [snake, food, isAlive, setDirection] = useSnakeGame(size, tickDuration)

    useEffect(() => {
        if (typeof window === "undefined") return

        const listener = (event: KeyboardEvent) => {
            if (acceptedKeys.includes(event.key as any)) {
                setDirection(event.key as ArrowKey)
            }
        }

        window.addEventListener("keydown", listener)
        
        return () => {
            window.removeEventListener("keydown", listener)
        }
    })

    useEffect(() => {
        if (!isAlive) {
            onGameOver(snake.length - 3)
        }
    })

    return (
        <div className="game-board"
            style={{ "--board-size": size } as any}>

            {Array.from({ length: size ** 2 }, (_, index) => {
                const percentage = (snake.indexOf(index) + 1) / snake.length
                const opacity = (snake.includes(index)) ? (percentage + 0.5) / 1.5 : 1
                const hueRotation = (snake.includes(index)) ? (1 - percentage) * 75 : 0
                const modifier = (() => {
                    if (snake.includes(index)) {
                        return "--snake"
                    }
                    else if (food === index) {
                        return "--food"
                    }
                    else {
                        return ""
                    }
                })()
                
                return (
                    <div
                        className={`game-board__cell${modifier}`}
                        style={{ opacity, "--hue-rotation": hueRotation + "deg" } as any}
                        key={index}>
                    </div>
                );
            })}
        </div>
    );
}