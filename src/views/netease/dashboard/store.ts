/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-04-08 17:10:44
 * @LastEditors  : Vane
 * @LastEditTime : 2021-04-11 01:50:43
 * @FilePath     : /src/views/netease/dashboard/store.ts
 */
import { Mutation, Action, useStore } from 'vuex';

const initState = {
  currentSong: {}
}

const StoreModel = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveCurrentSong(state: { currentSong: {}; }, payload: any) {
      state.currentSong = payload
    },
  },
  actions: {
    async setCurrSong({ commit }: { commit: Function }, payload: Object) {
      commit('saveCurrentSong', payload)
    },
    
  }
}



export default StoreModel;