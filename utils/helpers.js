export function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}

export const $ = s => document.querySelector(s)