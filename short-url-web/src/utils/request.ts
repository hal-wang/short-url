import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import { message } from 'ant-design-vue';

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface ReqParams {
  url?: string;
  data?: any;
  params?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
  errorMessageMode?: ErrorMessageMode;
}

const apiUrl = import.meta.env.VITE_GLOB_API_URL;
const apiProxyPrefix = import.meta.env.VITE_GLOB_API_PROXY_PREFIX;

console.log('url', apiUrl, apiProxyPrefix);
const baseRequest = axios.create({
  baseURL: apiUrl + (apiProxyPrefix || ''),
  timeout: 10 * 1000,
});

export async function request<T = any>(method: Method, params?: ReqParams): Promise<T | null> {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'short-url-origin': `${window.location.protocol}//${window.location.host}`,
  };
  const cfg: AxiosRequestConfig<T> = {
    method: method,
    url: params?.url,
    headers: Object.assign(baseHeaders, params?.headers ?? {}),
    params: params?.params,
    data: params?.data,
  };

  try {
    const res = await baseRequest.request(cfg);
    return (res.data ?? {}) as T;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      const res = error.response;
      message.error(res.data?.message ?? `${res.status} ${res.statusText}`);
    } else {
      message.error((err as Error)?.message ?? '网络连接错误，请检查网络后重试');
    }
    return null;
  }
}

export const post = <T = any>(ps?: ReqParams): Promise<T | null> => request('post', ps);
export const get = <T = any>(ps?: ReqParams): Promise<T | null> => request('get', ps);
export const patch = <T = any>(ps?: ReqParams): Promise<T | null> => request('patch', ps);
export const delete_ = <T = any>(ps?: ReqParams): Promise<T | null> => request('delete', ps);
export const put = <T = any>(ps?: ReqParams): Promise<T | null> => request('put', ps);
