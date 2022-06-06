import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") return initial
        
        try {
            const jsonString = window.localStorage.getItem(key)
            if (!jsonString) return initial
            const item = JSON.parse(jsonString)
            if (typeof item !== typeof initial) return initial
            return item 
        }
        catch (error) {
            console.log(error)
            return initial
        }
    })

    const saveValue = (valueToStore: (T|null)) => {
        setStoredValue(valueToStore ?? initial)

        if (typeof window === "undefined") return
        
        if (valueToStore !== null) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        else {
            window.localStorage.removeItem(key)
        }
    }

    return [storedValue, saveValue] as const
}