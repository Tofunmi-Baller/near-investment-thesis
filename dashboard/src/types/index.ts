export interface NetworkGrowth {
  date: string
  dailyActiveAccounts: number
  newAccounts: number
  contractDeploys: number
  txCount: number
}

export interface ChainComparison {
  chain: string
  dailyActiveAccounts: number
  avgTxFee: number
  tps: number
  aiContracts: number
  intentVolume: number
}
