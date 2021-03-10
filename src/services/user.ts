/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-03-09 17:51:07
 * @FilePath     : \src\services\user.ts
 */
import request from '@/utils/request';

export async function queryCurrent(id: number): Promise<any> {
    return request({
        url: '/user/detail?uid=' + id,
        method: 'get'
    });
}

export async function queryMessage(): Promise<any> {
    return request({
        url: '/user/message'
    });
}