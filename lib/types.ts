export interface Game {
  players: Player[],
  rounds: Round[],
  created?: string,
}

export interface Round {
  roundWinnerLastCard: Player,
  roundWinnerBestHand: Player,
  roundBestHand: Hand,
  illegalTraders: Player[],
}

// Create a map with hands
export const Hands : Hand[] = [
  { name: "Högst kort", value: 0 },
  { name: "Par", value: 1 },
  { name: "Tvåpar", value: 2 },
  { name: "Triss", value: 3 },
  { name: "Stege", value: 4 },
  { name: "Färg", value: 5 },
  { name: "Kåk", value: 6 },
  { name: "Fyrtal", value: 7 },
  { name: "Färgstege", value: 8 },
  { name: "Royal Flush", value: 9 },
]

export interface Hand {
  name: string,
  value: number,
}

export interface Player {
  name: string,
  points: number,
  dealer: boolean,
}