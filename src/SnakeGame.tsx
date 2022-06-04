import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./SnakeGame.scss"

type SnakeGameProps = {
    size: number
    tickDuration: number,
    onGameOver(score: number): void
}

export default function SnakeGame(props: SnakeGameProps) {
    const { size, tickDuration, onGameOver } = props

    const [snake, updateSnake] = useState([0, 1, 2])
    const [food, updateFood] = useState<number>(Math.floor((size**2)/2))

    const timerID = useRef<NodeJS.Timer|undefined>(undefined)
    const direction = useRef<ArrowKey>("ArrowRight"); 
    const directionQueue = useRef<ArrowKey|null>(null);

    type ArrowKey = keyof typeof keyMappings
    const keyMappings = useMemo(() => ({
        ArrowUp: -size,
        ArrowDown: size,
        ArrowLeft: -1,
        ArrowRight: 1
    }), [size])

    const moveSnake = useCallback(() => {
        if (directionQueue.current) {
            direction.current = directionQueue.current
            directionQueue.current = null
        }

        const oldHead = snake[snake.length - 1];
        const distance = keyMappings[direction.current]
        const newHead = oldHead + distance

        const outOfBounds = newHead < 0 || newHead >= size ** 2
        const illegalMove = Math.abs(distance) === 1 && ~~(newHead / size) !== ~~(oldHead / size)
        if (snake.includes(newHead) || outOfBounds || illegalMove) {
            clearInterval(timerID.current)
            onGameOver(snake.length - 3)
            return
        }

        if (newHead === food) {
            updateSnake([...snake, newHead]);
            const slots = Array.from({ length: size ** 2 }, (_, i) => i).filter(it => !snake.includes(it));
            const randomSlot = slots[Math.floor((Math.random() * slots.length))];
            updateFood(randomSlot);
        }

        else {
            updateSnake([...snake.filter((_, i) => i !== 0), newHead]);
        }
    }, [keyMappings, snake, food, size, onGameOver]);

    useEffect(() => {
        timerID.current = setInterval(moveSnake, tickDuration);
        return () => clearInterval(timerID.current);
    }, [tickDuration, moveSnake]);

    return (
        <div className="game-board"
            tabIndex={-1}
            style={{ "--board-size": size } as any}
            onKeyDown={(event) => {
                if (event.key in keyMappings) {
                    const oldDist = keyMappings[direction.current];
                    const newDist = keyMappings[event.key as ArrowKey];
                    //Snake can't move backwards!
                    if (newDist !== -oldDist) {
                        directionQueue.current = event.key as ArrowKey;
                    } 
                }
            }}>

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
