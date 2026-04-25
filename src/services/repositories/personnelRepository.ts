import { personnelUsers, type PersonnelUser } from '../../components/personnel/personnelUsers'

const PERSONNEL_STORAGE_KEY = 'pm-personnel-state-v1'

const createInitialState = (): PersonnelUser[] =>
  personnelUsers.map(user => ({
    ...user,
    skills: [...user.skills],
    skillProfiles: user.skillProfiles.map(skill => ({ ...skill })),
    certs: user.certs.map(cert => ({ ...cert })),
  }))

const readLocalState = (): PersonnelUser[] => {
  try {
    const raw = window.localStorage.getItem(PERSONNEL_STORAGE_KEY)
    if (!raw) {
      return createInitialState()
    }

    const parsed = JSON.parse(raw) as PersonnelUser[]
    return Array.isArray(parsed) ? parsed : createInitialState()
  } catch {
    return createInitialState()
  }
}

const persistLocalState = (users: PersonnelUser[]) => {
  try {
    window.localStorage.setItem(PERSONNEL_STORAGE_KEY, JSON.stringify(users))
  } catch {
    // ignore local storage errors
  }
}

const normalizeNumber = (id: string): number => {
  const matched = id.match(/\d+/g)
  if (!matched?.length) {
    return 0
  }

  return Number(matched.join('')) || 0
}

export const personnelRepository = {
  loadUsers(): PersonnelUser[] {
    return readLocalState()
  },

  saveUsers(users: PersonnelUser[]) {
    persistLocalState(users)
  },

  getNextUserId(users: PersonnelUser[]): string {
    const maxId = users.reduce((max, user) => Math.max(max, normalizeNumber(user.id)), 1000)
    return `U${String(maxId + 1)}`
  },
}
