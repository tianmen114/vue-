// src/store/dongman.ts
import { defineStore } from 'pinia'

export const useBangumiStore = defineStore('dongman', {
  state: () => ({
    bangumiList: [] as { title: string; time: string; cover: string }[]
  }),
  actions: {
    async loadBangumiList() {
      const res = await fetch('/bangumi.json')
      this.bangumiList = await res.json()
    }
  }
})
