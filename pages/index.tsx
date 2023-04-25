import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon, ExclamationCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import RadioGroupWithDisabledOptions, { RadioOption } from '@/components/RadioGroupWithDisabledOptions'
import { Switch } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import { FireworksContainer } from '@/components/FireworksContainer'
import { Game, Player, Hand, Hands } from '@/lib/types'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const inter = Inter({ subsets: ['latin'] })

export const FADE_IN_TIME = 2000;
export const FADE_OUT_TIME = 2000;
export const WAIT_TIME = 8000;

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
  const [showChangeLog, setShowChangeLog] = useState<boolean>(false);
  const [illegalTraders, setIllegalTraders] = useState<Player[]>([])
  const [showFireworks, setShowFireworks] = useState<boolean>(false)
  const [renderFireworksComponent, setRenderFireworksComponent] = useState<boolean>(false)

  const NAME_LENGTH_LIMIT = 10;

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
    // Check if game has any rounds
    if (g.rounds.length === 0) {
      console.log("Game has no rounds, not archiving")
      return
    }

    // Send game to archive api
    fetch('/api/archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(g)
      })
      .then(res => {
        console.log("Archived game")
      })

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

  function activateFireworks() {

    // setShowFireworks(true)
    setRenderFireworksComponent(true)
    setShowFireworks(true);

    setTimeout(() => {
      setShowFireworks(false);

      setTimeout(() => {
        setRenderFireworksComponent(false)
      }, FADE_OUT_TIME + 1000)
    }, WAIT_TIME);

    
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
        <Toaster/>
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

                      // Set new date
                      g.created = new Date().toISOString()

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
                <div key={p.name} className='grid grid-cols-11 gap-x-1 items-baseline'>
                  <p className='col-span-3 whitespace-nowrap'>{p.name}</p>
                  <p className='col-span-1'>{p.points}p</p>
                  <p className='text-blue-400 col-span-2 text-center text-sm '>{p.dealer ? "Dealer" : ""}</p>
                  <p className='text-orange-400 col-span-2 text-right text-sm '>{p.points >= 17 ? "Köpstopp" : ""}</p>
                  <button className='text-red-500 col-span-3 text-right' onClick={() => {
                    const g = copyGame(game)

                    // If the player is the dealer, set the next player as dealer
                    if (g.players[i].dealer) {
                      g.players[(i + 1) % g.players.length].dealer = true
                    }

                    g.players.splice(i, 1)
                    setGame(g)
                    saveGame(g)
                  }}>Ta bort</button>
                </div>  
              ))}
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault()

                if (!!game.players.find(p => p.name === newPlayerName)) return
                if (newPlayerName === "") return

                setGame(g => {
                  // Create a new player. If it is the first player, make it dealer
                  const newGame = copyGame(g)
                  newGame.players.push({name: newPlayerName, points: 0, dealer: game.players.length === 0})
                  saveGame(newGame)
                  return newGame
                })
                setNewPlayerName("")
              }}
            >
              <label htmlFor="newName" className="mt-4 block text-sm font-medium">
                Lägg till ny spelare (i sittningsordning)
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
                      placeholder="Namn"
                      value={newPlayerName}
                      onChange={(e) => {
                        setNewPlayerName(e.target.value || "")
                      }}
                    />
                    {(!!game.players.find(p => p.name === newPlayerName) || newPlayerName.length > NAME_LENGTH_LIMIT) &&
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    }
                    
                  </div>
                  {!!game.players.find(p => p.name === newPlayerName) &&
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      En spelare har redan det namnet
                    </p>
                  }
                  {newPlayerName.length > NAME_LENGTH_LIMIT &&
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      Namnet är för långt (max {NAME_LENGTH_LIMIT} bokstäver)
                    </p>
                  }
                </div>

                {!!newPlayerName && !game.players.find(p => p.name === newPlayerName) && !(newPlayerName.length > NAME_LENGTH_LIMIT) &&
                  <button
                    type="submit"
                    className="h-10 w-10 inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                }
              </div>
              <input type="submit" hidden />
            </form>
          </div>

          <hr className='border-gray-600 my-6'></hr>

          <div className=''>
            
            {game.players.length === 0 ? 
            <p className="my-4 block text-sm font-medium">
              Lägg till spelare för att kunna spela
            </p> : <>

            {/* <p className="my-4 block text-sm font-medium">
              Lägg till ny runda
            </p> */}
            <h2 className='pb-4 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Lägg till runda</h2>
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
              
              {/* Question for players who might have accidentally traded their cards when they had at least 17 points */}
              {game.players.filter(p => p.points >= 17).length > 0 && <>
                <div className="mt-2 -mb-2">
                  <h2 className="text-sm font-medium">Spelare med minst 17p som har gjort ett byte:</h2>
                </div>
                {game.players.filter(p => p.points >= 17).map(p => (
                  <div key={p.name} className="flex items-center"> 
                    <Switch.Group as="div" className="flex items-center">
                      <Switch
                        checked={illegalTraders.includes(p)}
                        onChange={(e: boolean) => {
                          if (e) {
                            setIllegalTraders(illegalTraders => [...illegalTraders, p])
                          } else {
                            setIllegalTraders(illegalTraders => illegalTraders.filter(p2 => p2 !== p))
                          }
                        }}
                        className={classNames(
                          illegalTraders.includes(p) ? 'bg-indigo-600' : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            illegalTraders.includes(p) ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                      <Switch.Label as="span" className="ml-3">
                        <p className="text-sm font-medium">{`${p.name} (${p.points}p)`}{' har gjort ett byte'}</p>
                        <p className="text-sm text-gray-400">(Nollställer poängen för {p.name})</p>
                      </Switch.Label>
                    </Switch.Group>
                  </div>
                ))}
              </>}

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
                      roundBestHand,
                      illegalTraders
                    })

                    // Remove points for any illegal traders
                    newGame.players = newGame.players.map(p => {
                      if (illegalTraders.find(p2 => p2.name === p.name)) {
                        p.points = 0
                      }
                      return p
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

                    let anyNewWinner = false
                    const previousRoundWinners = game.players.filter(p => p.points >= 21).map(p => p.name)
                    if (newGame.players.filter(p => p.points >= 21 && !previousRoundWinners.includes(p.name)).length > 0) {
                      anyNewWinner = true
                    }

                    // For each player that was not over the 17 point limit last time, but is now, make an announcement info
                    newGame.players.filter(p => p.points >= 17).forEach(p => {
                      if (game.players.find(p2 => p2.name === p.name)!.points < 17) {
                        if (!anyNewWinner) toast(`${p.name} har ${p.points}p → får ej byta kort`, { icon: '⚠️', duration: 5000 })
                      }
                    })

                    // Make the next player the dealer
                    const dealerIndex = newGame.players.findIndex(p => p.dealer)
                    newGame.players[dealerIndex].dealer = false
                    const newDealerIndex = (dealerIndex + 1) % newGame.players.length
                    newGame.players[newDealerIndex].dealer = true

                    // Announce next dealer
                    if (!anyNewWinner) toast(`${newGame.players[newDealerIndex].name} är dealer`, { icon: '🎲', duration: 5000 })

                    // If any player has 21 or more points, but did not have it the last time, print out and display fireworks
                    if (anyNewWinner) {
                      activateFireworks()
                      const winners = newGame.players.filter(p => p.points >= 21 && !previousRoundWinners.includes(p.name))
                      
                      // If one winner, simply announce it
                      if (winners.length === 1) {
                        const p = winners[0]
                        toast(`${p.name} har ${p.points}p!`, { icon: '🎉', duration: 10000 })
                      }

                      // If 2 winners, the winner is the one who won the round (roundWinnerLastCard)
                      const roundWinner = winners.find(p => p.name === roundWinnerLastCard.name)
                      if (roundWinner) {
                        toast(`${roundWinner.name} har ${roundWinner.points}p!`, { icon: '🎉', duration: 10000 })
                      }
                      else {
                        winners.forEach(p => {
                          toast(`${p.name} har ${p.points}p!`, { icon: '🎉', duration: 10000 })
                        })
                      }
                    }

                    saveGame(newGame)
                    return newGame
                  })
                  setRoundWinnerLastCard(null)
                  setRoundWinnerBestHand(null)
                  setRoundBestHand(null)
                  setIllegalTraders([])
                }}
              >
                <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Lägg till runda
              </button>

              }


            </div>

            <hr className='border-gray-600 my-6'></hr>

            <h2 className='pb-4 font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>Rundor</h2>

            <div className='grid grid-cols-1 gap-4 mb-2'>
              {game.rounds.map((r, i) => (
                <div key={i} className='grid grid-cols-1'>
                  <p className='font-bold text-sm'>Runda {i+1}: </p>
                  <p>Vinnare (sista kortet): {r.roundWinnerLastCard.name} {"(+2p)"}</p>
                  <p>Vinnare (bäst hand): {r.roundWinnerBestHand.name} {`(${r.roundBestHand.name}, +${r.roundBestHand.value}p)`}</p>
                  {r.illegalTraders?.length > 0 && <p>Illegala byten: {r.illegalTraders?.map(p => p.name).join(', ')}</p>}
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
            </>}
          </div>

          <div className='text-md text-gray-400 text-center mt-20'>
            &copy; {new Date().getFullYear()} - <a className="underline" href="https://sigfrid.stjarnholm.com" target="_blank" rel="noopener noreferrer">Sigfrid Stjärnholm</a>
          </div>

          <div className='text-md text-gray-400 text-center mt-20'>
            {showChangeLog ? (<div>
              <p className='underline cursor-pointer' onClick={() => {setShowChangeLog(false)}}>Dölj ändringslogg</p>
              <ul className='list-disc list-inside max-w-xs'>
                <li>2023-01-31: Initial version</li>
                <li>2023-02-01: Trepar → Triss, begränsa spelarnamnslängd</li>
                <li>2023-02-02: Alternativ för illegala byten, visa vem som är dealer, notifikationer vid ny dealer eller nytt bytstopp, fyrverkerier</li>
                <li>2023-04-25: Bytstopp → Köpstopp, visa bara den som vann sista kortet som vinnare om två personer vinner, flyttade Lägg till runda till ovanför Rundor</li>
              </ul>
            </div>) : (<div>
              <p className='underline cursor-pointer' onClick={() => {setShowChangeLog(true)}}>Visa ändringslogg</p>
            </div>)}
          </div>


          <div style={{
            opacity: showFireworks ? 1 : 0,
            transition: 'opacity 2s ease-in-out'
          }}>
            <FireworksContainer />
          </div>
        </div>
      </main>
    </>
  )
}
