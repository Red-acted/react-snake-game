import { useRef, useState } from "react"
import "./App.scss"
import SnakeGame from "./SnakeGame"

type GameState = "MAIN_SCREEN"|"GAME"|"GAME_OVER"

export default function App() {
    const [score, setScore] = useState(0)
    const [gameState, setGameState] = useState<GameState>("MAIN_SCREEN")
    const [key, setKey] = useState(0)
    
    const tickDuration = useRef(250)
    const size = useRef(11)

    if (gameState === "MAIN_SCREEN") {
        return (
            <div className="main-screen">
                <h1>Epic Snake Game</h1>
                <button className="main-screen__button"
                    onClick={() => setGameState("GAME")}>
                    Play!
                </button>

                <div className="main-screen__options-menu">
                    <span>Size</span>
                    <select className="main-screen__selection"
                        onChange={(event) => {
                            size.current = Number(event.target.value)
                        }}>
                        <option value={11}>11x11</option>
                        <option value={13}>13x13</option>
                        <option value={15}>15x15</option>
                        <option value={17}>17x17</option>
                    </select>

                    <span>Speed</span>
                    <select className="main-screen__selection"
                        onChange={(event) => {
                            tickDuration.current = Number(event.target.value)
                        }}>
                        <option value={250}>Slow</option>
                        <option value={150}>Normal</option>
                        <option value={75}>Fast</option>
                    </select>
                </div>        
            </div>
        )
    }

    return (
        <div className={gameState === "GAME" ? "game" : "game--lost"}>
            {gameState === "GAME_OVER" &&
                <div className="game__pop-up"> 
                    <span>Você perdeu. 💀</span>
                    <span>🍎: {score}</span>
                    <button className="game__button"
                        onClick={() => {
                            setKey(key + 1)
                            setGameState("GAME")
                        }}>
                        Jogar Novamente
                    </button>
                    <button className="game__button"
                        onClick={() => setGameState("MAIN_SCREEN")}>
                        Menu Principal
                    </button>
                </div>
            }
            <SnakeGame 
                key={key}
                size={size.current}
                tickDuration={tickDuration.current}
                onGameOver={(newScore) => {
                    setScore(newScore)
                    setGameState("GAME_OVER")   
                }}
            />
        </div>
    )
}



