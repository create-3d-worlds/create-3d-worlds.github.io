import Maze from '/core/mazes/Maze.js'
import { recursiveBacktracker } from '/core/mazes/algorithms.js'
import { scene, createToonRenderer, camera, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createGround } from '/core/ground.js'
import { SorceressPlayer } from '/core/actor/derived/fantasy/Sorceress.js'
import GUI from '/core/io/GUI.js'

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
