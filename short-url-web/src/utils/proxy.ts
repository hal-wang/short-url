import { ProxyOptions } from 'vite';

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];
type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);
    console.log('prefix', prefix);
    console.log('target', target);

    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
