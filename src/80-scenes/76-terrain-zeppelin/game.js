import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene, renderer, createOrbitControls, addUIControls } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSunLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/aircrafts/Zeppelin.js'
import { loadZeppelin } from '/utils/loaders.js'

scene.add(createSkySphere({ r: 5000 }))
const light = createSunLight({ x: 500, y: 2000, z: 100, far: 5000 })
scene.add(light)
scene.remove(scene.getObjectByName('hemisphereLight')) // BUG: sa svetlom puca terrain
scene.fog = new THREE.Fog(0xffffff, 1, 5000)

const water = createGround({ color: 0x003133 })
scene.add(water)

const controls = createOrbitControls()

const ground = createHillyTerrain({ size: 10000, y: 100, factorX: 5, factorZ: 2.5, factorY: 200 })
scene.add(ground)

const { mesh } = await loadZeppelin()
const zeppelin = new Zeppelin({ mesh })
scene.add(zeppelin.mesh)
mesh.position.y = 256
controls.target = mesh.position

scene.getObjectByName('sunLight').target = mesh
zeppelin.addSolids(ground, water)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()

  if (!keyboard.pressed.mouse) cameraFollowObject(camera, zeppelin.mesh)
  renderer.render(scene, camera)
}()

/* UI */

const commands = {
  '←': 'levo',
  '→': 'desno',
  '↑': 'gore',
  '↓': 'dole',
  'PgUp': 'ubrzavanje',
  'PgDn': 'usporavanje',
}
addUIControls({ commands })
