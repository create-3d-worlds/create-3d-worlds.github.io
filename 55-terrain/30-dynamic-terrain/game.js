/* global dat */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain } from '../../utils/dynamic-terrain/index.js'
import { dirLight } from '/utils/light.js'

scene.remove(scene.getObjectByName('hemisphereLight')) // remove bug
scene.add(dirLight({ position: [500, 2000, 0], intensity: 2 }))

createOrbitControls()
camera.position.set(-1200, 800, 1200)

scene.add(terrain)

const gui = new dat.GUI()
const pos = { x: 2, y: 2 }
gui.add(pos, 'x', -20, 20).name('x')
gui.add(pos, 'y', -20, 20).name('y')

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  updateTerrain(pos.x, pos.y)
  renderer.render(scene, camera)
}()