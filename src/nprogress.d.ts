declare module 'nprogress' {
  export function start(): void;
  export function done(): void;
  export function configure(options: { [key: string]: any }): void;
}
//放报错