import { defineStore } from 'pinia'

// 第一个参数是 store 名称（唯一），第二个是选项对象
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'My Blog'
  }),
  actions: {
    increment() {
      this.count++
    },
    setName(newName: string) {
      this.name = newName
    }
  }
})
