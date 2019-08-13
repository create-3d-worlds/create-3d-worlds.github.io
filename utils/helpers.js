export const $ = s => document.querySelector(s)

export function randomInRange(min, max, roundDown = true) {
  const rand = Math.random() * (max - min + 1) + min
  return roundDown ? Math.floor(rand) : rand
}

export const isCollide = (bounds1, bounds2) =>
  bounds1.xMin <= bounds2.xMax && bounds1.xMax >= bounds2.xMin &&
  bounds1.yMin <= bounds2.yMax && bounds1.yMax >= bounds2.yMin &&
  bounds1.zMin <= bounds2.zMax && bounds1.zMax >= bounds2.zMin

/**
 * roll a random positive integer <= n
 * @param n
 * @returns {number}
 */
export function roll(n) {
  return Math.random() * n | 0
}

/**
 * roll a random integer between -n and n
 * @param n
 * @returns {number}
 */
export function rndInt(n) {
  return (Math.random() * n | 0) - n / 2
}
