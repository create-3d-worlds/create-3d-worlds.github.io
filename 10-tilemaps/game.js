import model from '../maps/small-map.js'
import Tilemap from '../models/Tilemap.js'
import Player from '../models/Player.js'

const map = new Tilemap(model)
const player = new Player(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  map.render()
  player.render()
}()
