import { create } from 'zustand'

interface DetailTitleState {
  title: string
  setTitle: (title: string) => void
}

export const useDetailTitle = create<DetailTitleState>(set => ({
  title: '',
  setTitle: title => set({ title }),
}))
