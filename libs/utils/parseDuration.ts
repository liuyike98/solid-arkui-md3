/** 解析 CSS 时间值 (s/ms) 为毫秒数, 无效时返回 0 */
export const parseDuration = (value: string) => {
  const match = value.trim().match(/^([\d.]+)(s|ms)$/);
  if (!match) return 0;
  const number = Number(match[1]);
  return match[2] === 's' ? number * 1000 : number;
};
