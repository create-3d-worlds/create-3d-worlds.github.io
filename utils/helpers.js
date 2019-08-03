export const $ = s => document.querySelector(s)

export function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
