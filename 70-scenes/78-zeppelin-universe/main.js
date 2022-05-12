import { scene, camera, renderer, createOrbitControls, addControlUI } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createStars } from '/utils/stars.js'
import { createGradientSky } from '/utils/sky.js'
import { createGround } from '/utils/ground.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import Zeppelin from '/classes/Zeppelin.js'
import keyboard from '/classes/Keyboard.js'
import {hemLight} from '/utils/light.js'

hemLight({ intensity: .25 })
const controls = createOrbitControls()
const commands = {
  '←': 'levo',
  '→': 'desno',
  '↑': 'gore',
  '↓': 'dole',
  'PgUp': 'ubrzanje',
  'PgDn': 'kočenje',
}
addControlUI({ commands })

const stars = createStars({ radiusMin: 5000, radius: 10000, numberOfStars: 200000 })
scene.add(stars)

scene.add(createGradientSky({ r: 5000, bottomColor: 0x000000, topColor: 0x002266 }))
const water = createGround({ color: 0x003133 })
scene.add(water)

const ground = createHillyTerrain(
  { size: 10000, y: 100, color: 0x030303, factorX: 5, factorZ: 2.5, factorY: 200, file: 'grasslight-big.jpg' })
scene.add(ground)

const zeppelin = new Zeppelin(mesh => {
  scene.add(mesh)
  mesh.position.y = 256
  controls.target = mesh.position
  zeppelin.addSolids(ground, water)
})

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()

  if (!keyboard.pressed.mouse)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()
