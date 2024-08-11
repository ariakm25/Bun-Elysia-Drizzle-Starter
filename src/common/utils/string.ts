export const interpolate = (tpl: string, args: { [k: string]: any }) =>
  tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);
