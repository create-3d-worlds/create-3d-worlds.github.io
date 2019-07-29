import level1 from './data/level1.js'

for (let y = 0; y < level1.length; y++) {
  for (let x = 0; x < level1[y].length; x++) {
    const tile = level1[y][x]
    console.log(y, x, tile)
    // render tile
  }
}
