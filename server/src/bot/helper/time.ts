export const sleep = (delay: number) =>
  new Promise(accept => {
    setTimeout(accept, delay);
  });

export const timestamp = () => Math.floor(Date.now() / 1000);
