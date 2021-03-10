/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-03-09 17:58:47
 * @FilePath     : \src\views\user\login\service.ts
 */
import request from '@/utils/request';
import { LoginParamsType } from './data.d';

export async function accountLogin(params: LoginParamsType): Promise<any> {
    return request({
        url: '/login/cellphone',
        method: 'POST',
        data: params,
    });
}