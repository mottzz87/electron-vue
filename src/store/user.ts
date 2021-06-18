/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-03-11 14:57:38
 * @FilePath     : \src\store\user.ts
 */
import { Mutation, Action, useStore } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { computed } from "vue";
import { ResponseData } from '@/utils/request';
import { queryCurrent, queryMessage } from "@/services/user";
import { StateType as UserStateType } from "@/store/user";
import { removeToken } from "@/utils/localToken";

export interface CurrentUser {
  userId: number;
  name: string;
  avatar: string;
  roles: string[];
}

export interface StateType {
  currentUser: CurrentUser;
  message: number;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
    saveMessage: Mutation<StateType>;
  };
  actions: {
    fetchCurrent: Action<StateType, StateType>;
    fetchMessage: Action<StateType, StateType>;
    logout: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  currentUser: {
    userId: 0,
    name: '',
    avatar: '',
    roles: [],
  },
  message: 0,
}

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveCurrentUser(state, payload) {
      state.currentUser = {
        ...initState.currentUser,
        ...payload,
      }
    },
    saveMessage(state, payload) {
      state.message = payload;
    }
  },
  actions: {
    async fetchCurrent({ commit }, payload: number) {
      const store = useStore();
      // try {
      //   const response: ResponseData = await queryCurrent(payload);
      //   console.log(response)
      //   const { data } = response;
        commit('saveCurrentUser', store.state.userlogin.userAccount.profile || {});
      //   return true;
      // } catch (error) {
      //   return false;
      // }
    },
    async fetchMessage({ commit }) {
      try {
        const response: ResponseData = await queryMessage();
        const { data } = response;        
        commit('saveMessage', data || 0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      console.log(111111111)
      try {
        await removeToken();
        commit('saveCurrentUser', { ...initState.currentUser });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}



export default StoreModel;
  