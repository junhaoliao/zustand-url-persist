import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {create} from "zustand/react";
import {persist, type StorageValue} from "zustand/middleware";

interface MyStore {
    count: number;
    anotherCount: number;
    increment: () => void;
}

const useMyStore = create<MyStore>()(
    persist(
        set => ({
            count: 0,
            anotherCount: 0,
            increment: () => set((state) => ({
                count: state.count + 1,
                anotherCount: state.anotherCount + 1
            })),
        }),
        {
            name: 'my-store',
            partialize: (state) => ({
                count: state.count,
                anotherCount: state.anotherCount
            }),
            storage: ({
                getItem: (): StorageValue<MyStore> => {
                    const searchParams = new URLSearchParams(location.hash.slice(1))
                    return {
                        state: {
                            count: parseInt(searchParams.get("count") || "0", 10),
                            anotherCount: parseInt(searchParams.get("anotherCount") || "0", 10)
                        } as MyStore,
                    }
                },
                setItem: (_, newValue): void => {
                    const searchParams = new URLSearchParams(location.hash.slice(1))
                    searchParams.set("count", newValue.state.count.toString())
                    searchParams.set("anotherCount", newValue.state.anotherCount.toString())
                    location.hash = searchParams.toString()
                },
                removeItem: (): void => {
                },
            })
        }
    )
)
window.addEventListener('hashchange', () => {
    const {rehydrate} = useMyStore.persist;
    rehydrate()
})

const App = () => {
    const count = useMyStore(state => state.count)
    const anotherCount = useMyStore(state => state.anotherCount)

    const handleClick = () => {
        const {increment} = useMyStore.getState();
        increment()
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={handleClick}>
                    <div>count is {count}</div>
                    <div>anotherCount is {anotherCount}</div>
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
};

export default App
