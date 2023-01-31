import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const inter = Inter({ subsets: ['latin'] })

interface Game {
  players: Player[],
  rounds: Round[],
  created?: string,
}

interface Round {
  roundWinnerLastCard: Player,
  roundWinnerBestHand: Player,
  roundBestHand: Hand,
}

enum Hand {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9,
}

interface Player {
  name: string,
  points: number
}

const dateOptions = { year: "numeric", month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

export default function Home() {

  const [game, setGame] = useState<Game>({
    players: [],
    rounds: [],
    created: undefined
  })
  const [newPlayerName, setNewPlayerName] = useState<string>("")

  // Set game on load, if exists
  useEffect(() => {
    const g = loadGame()
    if (g) {
      setGame(g)  
    }
    else {
      const g : Game = {
        players: [],
        rounds: [],
        created: new Date().toISOString()
      }
      setGame(g)
      saveGame(g)
    }
  }, [])

  function saveGame(g: Game) {
    localStorage.setItem('game', JSON.stringify(g))
  }

  function loadGame() {
    const g = localStorage.getItem('game')
    if (g) {
      return JSON.parse(g)
    }
    return null
  }

  function copyGame(g: Game) {
    return JSON.parse(JSON.stringify(g)) as Game
  }

  return (
    <>
      <Head>
        <title>Poängpoker</title>
        <meta name="description" content="Håll koll på poängpoker" />
        <meta name="view  port" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className='max-w-lg grid grid-cols-1'>
          
          <div>
            <h1 className='pb-2 text-center font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Poängpoker</h1>
          </div>

          <hr className='border-gray-600 my-6'></hr>

          <div className=''>
            <h2 className='pb-1 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Metadata</h2>
            <p>Spel skapades: {new Date(game.created || "").toLocaleString("sv-SE")}</p>
            <p>Antal spelare: {game.players.length}</p>
            <p>Antal rundor: {game.rounds.length}</p>
          </div>

          <hr className='border-gray-600 my-6'></hr>

          <div className=''>
            <h2 className='pb-1 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Spelare</h2>
            <div className='grid grid-cols-1 gap-2 mb-2'>
              {game.players.map((p, i) => (
                <div key={p.name} className='grid grid-cols-3'>
                  <p>{p.name}</p>
                  <p>{p.points} poäng</p>
                  <button className='text-red-500' onClick={() => {
                    const g = copyGame(game)
                    g.players.splice(i, 1)
                    setGame(g)
                    saveGame(g)
                  }}>Ta bort</button>
                </div>  
              ))}
            </div>
            
            <label htmlFor="newName" className="mt-4 block text-sm font-medium ">
              Lägg till ny spelare
            </label>
            <div className='flex flex-row gap-2 items-center'>
              
              <div className='w-64'>
                
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    name="newName"
                    id="newName"
                    className={classNames("block w-full rounded-md  pr-10 focus:outline-none sm:text-sm", 
                      game.players.find(p => p.name === newPlayerName) ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 text-gray-800"
                    )}
                    placeholder="Namn Namnsson"
                    value={newPlayerName}
                    onChange={(e) => {
                      setNewPlayerName(e.target.value || "")
                    }}
                  />
                  {game.players.find(p => p.name === newPlayerName) &&
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  }
                </div>
                {game.players.find(p => p.name === newPlayerName) &&
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    En spelare har redan det namnet
                  </p>
                }
              </div>

              {!!newPlayerName && !game.players.find(p => p.name === newPlayerName) &&
                <button
                  onClick={() => {
                    setGame(g => {
                      const newGame = copyGame(g)
                      newGame.players.push({name: newPlayerName, points: 0})
                      saveGame(newGame)
                      return newGame
                    })
                    setNewPlayerName("")
                  }}
                  type="button"
                  className="h-10 w-10 inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              }
            </div>
          </div>
          
        </div>
      </main>
    </>
  )
}
