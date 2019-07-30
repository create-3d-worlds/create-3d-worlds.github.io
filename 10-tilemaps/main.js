import model from '../maps/small-map.js'
import Tilemap from '../utils/Tilemap.js'
import Player from '../utils/Player.js'

const map = new Tilemap(model)
const player = new Player(map, 4, 4)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  map.render()
  player.update()
  player.render()
}()
