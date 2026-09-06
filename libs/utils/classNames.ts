export function classNames(...names: (string | false | undefined | Record<string, boolean>)[]) {
  const results: string[] = [];
  for (const name of names) {
    if (typeof name === 'string') {
      if (name) results.push(name);
    } else if (name) {
      for (const key in name) {
        if (name[key]) results.push(key);
      }
    }
  }
  return results.join(' ');
}
