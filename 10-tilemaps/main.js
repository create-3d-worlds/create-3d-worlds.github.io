import level1 from './data/level1.js'

const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 450
canvas.style.backgroundColor = 'black'

const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

// https://mudroljub.github.io/igrica-partizani/#savo-mitraljezac

for (let y = 0; y < level1.length; y++) {
  for (let x = 0; x < level1[y].length; x++) {
    const tile = level1[y][x]
    console.log(y, x, tile)
    // render tile
  }
}
