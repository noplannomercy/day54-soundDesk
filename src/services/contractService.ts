import { Contract, ContractType, ContractStatus, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all contracts, optionally filtered by artistId, type, and/or status.
 */
export function getContracts(filters?: {
  artistId?: string
  type?: ContractType
  status?: ContractStatus
}): Contract[] {
  let contracts = getAll<Contract>(STORAGE_KEYS.CONTRACTS)

  if (filters?.artistId) {
    contracts = contracts.filter((c) => c.artistId === filters.artistId)
  }

  if (filters?.type) {
    contracts = contracts.filter((c) => c.type === filters.type)
  }

  if (filters?.status) {
    contracts = contracts.filter((c) => c.status === filters.status)
  }

  return contracts
}

/**
 * Find a single contract by ID.
 */
export function getContractById(id: string): Contract | undefined {
  return getById<Contract>(STORAGE_KEYS.CONTRACTS, id)
}

/**
 * Create a new contract and persist it.
 */
export function createContract(
  data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>
): Contract {
  const now = new Date().toISOString()
  const contract: Contract = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const contracts = getAll<Contract>(STORAGE_KEYS.CONTRACTS)
  contracts.push(contract)
  save(STORAGE_KEYS.CONTRACTS, contracts)
  return contract
}

/**
 * Partially update an existing contract by ID.
 * Returns the updated contract.
 */
export function updateContract(
  id: string,
  data: Partial<Omit<Contract, 'id' | 'createdAt'>>
): Contract {
  const contracts = getAll<Contract>(STORAGE_KEYS.CONTRACTS)
  let updated: Contract | undefined

  const updatedContracts = contracts.map((contract) => {
    if (contract.id === id) {
      updated = { ...contract, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return contract
  })

  save(STORAGE_KEYS.CONTRACTS, updatedContracts)
  return updated!
}

/**
 * Delete a contract by ID.
 */
export function deleteContract(id: string): void {
  const contracts = getAll<Contract>(STORAGE_KEYS.CONTRACTS)
  save(
    STORAGE_KEYS.CONTRACTS,
    contracts.filter((c) => c.id !== id)
  )
}

/**
 * Calculate the number of days until a contract expires.
 * Positive values mean the contract is still active; negative values mean it has expired.
 */
export function getDaysUntilExpiry(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
}
