import { useEffect, useMemo, useRef, useState } from "react"

export type ArrowKey = typeof acceptedKeys[number]
export const acceptedKeys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"] as const

export default function useSnakeGame(boardSize: number, tickDuration: number) {
    const [isAlive, setAlive] = useState(true)
    const [snake, updateSnake] = useState([0, 1, 2])
    const [food, updateFood] = useState(Math.floor((boardSize**2) / 2))

    const keyMappings = useMemo(() => ({
        ArrowUp: -boardSize,
        ArrowDown: boardSize,
        ArrowLeft: -1,
        ArrowRight: 1
    }), [boardSize])

    //Queue for direction (because the snake can only move once per tick)
    const nextDirection = useRef<ArrowKey>() 
    const direction = useRef<ArrowKey>("ArrowRight")
    const moveSnake = useRef<() => void>()

    useEffect(() => {
        if (!isAlive) return

        const timerID = setInterval(() => moveSnake.current?.(), tickDuration)
        return () => clearInterval(timerID)
    }, [tickDuration, isAlive])

    useEffect(() => {
        moveSnake.current = () => {
            if (nextDirection.current) {
                direction.current = nextDirection.current
                nextDirection.current = undefined
            }
    
            const oldHead = snake[snake.length - 1];
            const distance = keyMappings[direction.current]
            const newHead = oldHead + distance
    
            const outOfBounds = newHead < 0 || newHead >= boardSize ** 2
            const illegalMove = Math.abs(distance) === 1 && ~~(newHead / boardSize) !== ~~(oldHead / boardSize)
            if (snake.includes(newHead) || outOfBounds || illegalMove) {
                setAlive(false)
                return
            }
    
            if (newHead === food) {
                const newSnake = [...snake, newHead]
                const slots = Array.from({ length: boardSize ** 2 }, (_, i) => i).filter(it => !newSnake.includes(it));
                const randomSlot = slots[Math.floor((Math.random() * slots.length))];

                updateSnake(newSnake)
                updateFood(randomSlot)
            }
    
            else {
                updateSnake([...snake.filter((_, i) => i !== 0), newHead]);
            }
        }
    })

    const changeDirection = (newDirection: ArrowKey) => {
        const oldDist = keyMappings[direction.current]
        const newDist = keyMappings[newDirection]
        //Snake can't move backwards!
        if (oldDist !== -newDist) {
            nextDirection.current = newDirection
        }
    }

    return [snake, food, isAlive, changeDirection] as const
}