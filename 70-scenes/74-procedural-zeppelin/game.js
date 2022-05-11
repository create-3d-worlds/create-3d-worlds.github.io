import { camera, createWorldScene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain } from '/utils/dynamic-terrain/index.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'

const scene = createWorldScene()
const controls = createOrbitControls()

scene.remove(scene.getObjectByName('hemisphereLight')) // remove bug
scene.add(dirLight({ position: [500, 2000, 0], intensity: 2 }))

scene.add(terrain)

const zeppelin = new Zeppelin(mesh => {
  scene.add(mesh)
  mesh.position.y = 256
  controls.target = mesh.position
  scene.getObjectByName('sunLight').target = mesh
}, { shouldMove: false })

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()
  if (zeppelin.mesh)
    updateTerrain(zeppelin.direction.x, -zeppelin.direction.z)
  if (!keyboard.pressed.mouse)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()