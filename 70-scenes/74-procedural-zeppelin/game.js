import { camera, createWorldScene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain } from '/utils/dynamic-terrain/index.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/aircrafts/Zeppelin.js'
import { loadModel } from '/utils/loaders.js'
import { dirLight } from '/utils/light.js'

const scene = createWorldScene()
scene.remove(scene.getObjectByName('hemisphereLight')) // remove bug
dirLight({ scene })

const controls = createOrbitControls()

scene.add(terrain)

const adjust = model => {
  model.translateX(15)
}

const { mesh } = await loadModel({ file: 'santos-dumont-9/model.dae', size: 8, rot: { axis: [0, 1, 0], angle: Math.PI / 2 }, shouldCenter: false, shouldAdjustHeight: false, adjust })

const zeppelin = new Zeppelin({ mesh, shouldMove: false })
scene.add(mesh)
mesh.position.y = 256

controls.target = mesh.position
scene.getObjectByName('sunLight').target = mesh

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()
  if (zeppelin.mesh) updateTerrain(zeppelin.direction.x, -zeppelin.direction.z)
  if (!keyboard.pressed.mouse) cameraFollowObject(camera, zeppelin.mesh, { y: 0 })
  renderer.render(scene, camera)
}()