import { Member, MemberRole, MemberSpeciality, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all members, optionally filtered by role and/or speciality.
 */
export function getMembers(filters?: {
  role?: MemberRole
  speciality?: MemberSpeciality
}): Member[] {
  let members = getAll<Member>(STORAGE_KEYS.MEMBERS)

  if (filters?.role) {
    members = members.filter((m) => m.role === filters.role)
  }

  if (filters?.speciality) {
    members = members.filter((m) => m.speciality === filters.speciality)
  }

  return members
}

/**
 * Find a single member by ID.
 */
export function getMemberById(id: string): Member | undefined {
  return getById<Member>(STORAGE_KEYS.MEMBERS, id)
}

/**
 * Create a new member and persist it.
 */
export function createMember(
  data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>
): Member {
  const now = new Date().toISOString()
  const member: Member = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const members = getAll<Member>(STORAGE_KEYS.MEMBERS)
  members.push(member)
  save(STORAGE_KEYS.MEMBERS, members)
  return member
}

/**
 * Partially update an existing member by ID.
 * Returns the updated member.
 */
export function updateMember(
  id: string,
  data: Partial<Omit<Member, 'id' | 'createdAt'>>
): Member {
  const members = getAll<Member>(STORAGE_KEYS.MEMBERS)
  let updated: Member | undefined

  const updatedMembers = members.map((member) => {
    if (member.id === id) {
      updated = { ...member, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return member
  })

  save(STORAGE_KEYS.MEMBERS, updatedMembers)
  return updated!
}

/**
 * Delete a member by ID.
 */
export function deleteMember(id: string): void {
  const members = getAll<Member>(STORAGE_KEYS.MEMBERS)
  save(
    STORAGE_KEYS.MEMBERS,
    members.filter((m) => m.id !== id)
  )
}
