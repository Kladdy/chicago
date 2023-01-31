import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon, ExclamationCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import RadioGroupWithDisabledOptions, { RadioOption } from '@/components/RadioGroupWithDisabledOptions'

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

// Create a map with hands
const Hands : Hand[] = [
  { name: "Högst kort", value: 0 },
  { name: "Par", value: 1 },
  { name: "Tvåpar", value: 2 },
  { name: "Trepar", value: 3 },
  { name: "Stege", value: 4 },
  { name: "Färg", value: 5 },
  { name: "Kåk", value: 6 },
  { name: "Fyrtal", value: 7 },
  { name: "Färgstege", value: 8 },
  { name: "Royal Flush", value: 9 },
]

interface Hand {
  name: string,
  value: number,
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
  const [roundWinnerLastCard, setRoundWinnerLastCard] = useState<Player | null>(null)
  const [roundWinnerBestHand, setRoundWinnerBestHand] = useState<Player | null>(null)
  const [roundBestHand, setRoundBestHand] = useState<Hand | null>(null)
  const [clearGamePrompt, setClearGamePrompt] = useState<boolean>(false)
  const [clearRoundsPrompt, setClearRoundsPrompt] = useState<boolean>(false)

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

  function loadArchivedGames() {
    const g = localStorage.getItem('archivedGames')
    if (g) {
      return JSON.parse(g) as Game[]
    }
    return []
  }

  function archiveGame(g: Game) {
    const archivedGames = loadArchivedGames()
    archivedGames.push(g)
    localStorage.setItem('archivedGames', JSON.stringify(archivedGames))
  }

  function activateClearGamePrompt() {
    setClearGamePrompt(true)

    setTimeout(() => {
      setClearGamePrompt(false)
    }, 2000)
  }

  function activateClearRoundsPrompt() {
    setClearRoundsPrompt(true)

    setTimeout(() => {
      setClearRoundsPrompt(false)
    }, 2000)
  }

  return (
    <>
      <Head>
        <title>Poängpoker</title>
        <meta name="description" content="Håll koll på poängpoker" />
        <meta name="view  port" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className={styles.main}> */}
      <main className={styles.main}>
        <div className='grid grid-cols-1'>
          
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
            {/* <h2 className='pb-1 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Metadata</h2> */}
            <div className='flex flex-col space-y-2'>

              <div>
                <p className="block text-sm font-medium ">
                  Radera alla spelare och rundor
                </p>
                <button
                  type="button"
                  className="w-fit inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 "
                  onClick={() => {
                    if (clearGamePrompt) {
                      archiveGame(game)
                      const g : Game = {
                        players: [],
                        rounds: [],
                        created: new Date().toISOString()
                      }
                      setGame(g)
                      saveGame(g)
                      setClearGamePrompt(false)
                    } else {
                      activateClearGamePrompt()
                    }
                  }}
                >
                  <TrashIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                  {clearGamePrompt ? "Är du säker?" : "Radera spel..."}
                </button>
              </div>

              <div>
                <p className="block text-sm font-medium ">
                  Radera rundorna utan att radera spelarna
                </p>
                <button
                  type="button"
                  className="w-fit inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                  onClick={() => {
                    if (clearRoundsPrompt) {
                      archiveGame(game)
                      const g = copyGame(game)
                      g.rounds = []

                      // Clear player points
                      g.players.forEach(p => {
                        p.points = 0
                      })

                      setGame(g)
                      saveGame(g)
                      setClearRoundsPrompt(false)
                    } else {
                      activateClearRoundsPrompt()
                    }
                  }}
                >
                  <ArrowPathIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                  {clearRoundsPrompt ? "Är du säker?" : "Rensa rundor..."}
                </button>
              </div>
            </div>
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

          <hr className='border-gray-600 my-6'></hr>

          <div className=''>
            <h2 className='pb-4 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Rundor</h2>
            
            {game.players.length === 0 ? 
            <p className="my-4 block text-sm font-medium">
              Lägg till spelare för att kunna spela
            </p> : <>
              <div className='grid grid-cols-1 gap-4 mb-2'>
                {game.rounds.map((r, i) => (
                  <div key={i} className='grid grid-cols-1'>
                    <p className='font-bold text-sm'>Runda {i+1}: </p>
                    <p>Vinnare (sista kortet): {r.roundWinnerLastCard.name} {"(+2p)"}</p>
                    <p>Vinnare (bäst hand): {r.roundWinnerBestHand.name} {`(${r.roundBestHand.name}, +${r.roundBestHand.value}p)`}</p>
                    <button className='text-red-500 text-left' onClick={() => {
                      const g = copyGame(game)
                      
                      // Remove player scores
                      g.players.forEach(p => {
                        if (p.name === r.roundWinnerLastCard.name) {
                          p.points -= 2
                        }
                        if (p.name === r.roundWinnerBestHand.name) {
                          p.points -= r.roundBestHand.value
                        }
                      })

                      g.rounds.splice(i, 1)
                      setGame(g)
                      saveGame(g)
                    }}>
                      Ta bort
                    </button>
                  </div>
                ))}
              </div>

              <p className="my-4 block text-sm font-medium">
                Lägg till ny runda
              </p>
              <div className='flex flex-col gap-4'>
                
                <div>
                  <RadioGroupWithDisabledOptions<Player>
                    title="Vinnare (sista kortet):"
                    options={game.players.map(p => ({ value: p, disabled: false }))}
                    property="name"
                    value={{value: roundWinnerLastCard}}
                    setValue={(e: RadioOption<Player>) => {
                      setRoundWinnerLastCard(e.value)
                    }}
                  />
                </div>

                <div>
                  <RadioGroupWithDisabledOptions<Player>
                    title="Vinnare (bästa hand):"
                    options={game.players.map(p => ({ value: p }))}
                    property="name"
                    value={{value: roundWinnerBestHand}}
                    setValue={(e: RadioOption<Player>) => {
                      setRoundWinnerBestHand(e.value)
                    }}
                  />
                </div>

                <div>
                  <RadioGroupWithDisabledOptions<Hand>
                    title="Bästa hand:"
                    options={Hands.map(h => ({ value: h }))}
                    property="name"
                    value={{value: roundBestHand}}
                    setValue={(e: RadioOption<Hand>) => {
                      setRoundBestHand(e.value)
                    }}
                  />
                </div>

                {!!roundWinnerLastCard && !!roundWinnerBestHand && !!roundBestHand && 
                
                <button
                  type="button"
                  className="w-fit inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
                  onClick={() => {
                    setGame(g => {
                      const newGame = copyGame(g)
                      newGame.rounds.push({
                        roundWinnerLastCard,
                        roundWinnerBestHand,
                        roundBestHand
                      })
                      
                      newGame.players = newGame.players.map(p => {
                        if (p.name === roundWinnerLastCard.name) {
                          p.points += 2
                        }
                        if (p.name === roundWinnerBestHand.name) {
                          p.points += roundBestHand.value
                        }
                        return p
                      })

                      saveGame(newGame)
                      return newGame
                    })
                    setRoundWinnerLastCard(null)
                    setRoundWinnerBestHand(null)
                    setRoundBestHand(null)
                  }}
                >
                  <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                  Lägg till runda
                </button>

                }


              </div>

            </>}
          </div>

          <div className='text-md text-gray-400 text-center mt-20'>
            &copy; 2021 - <a className="underline" href="https://sigfrid.stjarnholm.com" target="_blank" rel="noopener noreferrer">Sigfrid Stjärnholm</a>
          </div>

        </div>
      </main>
    </>
  )
}
