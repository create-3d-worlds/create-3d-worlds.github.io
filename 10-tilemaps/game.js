import model from '../data/small-map.js'
import Tilemap from '../classes/Tilemap.js'
import Player from '../classes/Player.js'

const map = new Tilemap(model)
const player = new Player(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  map.render()
  player.render()
}()
