import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

export async function allCountryCase(params?: TableListQueryParams): Promise<any> {
  return request({
      url: '/cases',
      method: 'get',
      params
  });
}

