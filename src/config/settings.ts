/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-03-09 17:43:30
 * @FilePath     : \src\config\settings.ts
 */
/**
 * 站点配置
 * @author 
 */
export interface SettingsType {
    /**
     * 站点名称
     */
    siteTitle: string;
  
    /**
     * 顶部菜单开启
     */
    topNavEnable: boolean;
  
    /**
     * 头部固定开启
     */
    headFixed: boolean;
  
    /**
     * 站点本地存储Token 的 Key值
     */
    siteTokenKey: string;
  
    /**
     * Ajax请求头发送Token 的 Key值
     */
    ajaxHeadersTokenKey: string;
  
    /**
     * Ajax返回值不参加统一验证的api地址
     */
    ajaxResponseNoVerifyUrl: string[];

    /**
     * iconfont.cn 项目在线生成的 js 地址
     */
    iconfontUrl: string[];
}
  
const settings: SettingsType = {
    siteTitle: 'ADMIN-ELEMENT-VUE',
    topNavEnable: false,
    headFixed: true,
    siteTokenKey: 'admin_element_vue_token',
    ajaxHeadersTokenKey: 'x-token',
    ajaxResponseNoVerifyUrl: [
        '/login/cellphone', // 用户登录
        '/user/detail', // 获取用户信息
    ],
    iconfontUrl: [],
};

export default settings;
  