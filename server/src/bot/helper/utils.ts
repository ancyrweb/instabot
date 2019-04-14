export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;

export const prob = (value: number, winValue: any, loseValue: any) =>
  rand(0, 100) < value ? winValue : loseValue;

export const boolProb = (value: number) => prob(value, true, false);

export const shuffle = (a: any[]) => {
  a = a.slice();

  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};
