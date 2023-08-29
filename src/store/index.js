import { defineStore } from 'pinia'

export const useStore = defineStore('data', {
  state: () => ({
    type: null,

  }),
  getters: {
    double: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
