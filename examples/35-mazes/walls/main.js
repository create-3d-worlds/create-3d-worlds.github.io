import Maze from '/utils/mazes/Maze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, createToonRenderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { SorceressPlayer } from '/utils/actor/derived/fantasy/Sorceress.js'
import GUI from '/utils/io/GUI.js'

const renderer = await createToonRenderer()

scene.add(createSun())
scene.add(createGround())

const maze = new Maze(4, 8, recursiveBacktracker, 5)
const walls = maze.toTiledMesh({ texture: 'walls/stonetiles.jpg', maxHeight: 6 })
scene.add(walls)

const player = new SorceressPlayer({ camera, solids: walls, cameraClass: 'rpgui-button' })
player.putInMaze(maze)
scene.add(player.mesh)

const gui = new GUI({ scoreTitle: 'Time', controlsClass: 'rpgui-button', player })
gui.showMessage('Find a way out!', true, 4000)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  player.update(dt)
  gui.renderTime()
  renderer.render(scene, camera)
}()
