/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-03-10 14:16:29
 * @FilePath     : \src\views\user\login\store.ts
 */
import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { setToken } from '@/utils/localToken';
import { accountLogin } from './service';
import { LoginParamsType } from "./data.d";


export interface UserAccount {
    profile: any;
}
export interface StateType {
    loginStatus?: 'ok' | 'error';
    userAccount: UserAccount;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        changeLoginStatus: Mutation<StateType>;
        userAccount: Mutation<StateType>;
    };
    actions: {
        login: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    loginStatus: undefined,
    userAccount: {
        profile:{
            userId: 0,
            nickname: '',
            avatar: '',
        }
    },
}

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'userlogin',
    state: {
        ...initState
    },
    mutations: {
        changeLoginStatus(state, payload) {
            state.loginStatus = payload;
        },
        userAccount(state, payload = {}) {
            state.userAccount = payload;
        },
    },
    actions: {
        async login({ commit }, payload: LoginParamsType) {
            let status = undefined;
            console.log(payload)
            try {
                const response: ResponseData = await accountLogin(payload);
                setToken(response.token || '');
                commit('userAccount',response);
                status = 'ok';
            } catch (error) {
                if (error.message && error.message === 'CustomError') {
                    status = 'error';
                }
            }

            commit('changeLoginStatus',status);

            if (status === 'ok') {
                return true;
            } else if (status === 'error') {
                return false;
            }
            return undefined;
        }
    }
}

export default StoreModel;