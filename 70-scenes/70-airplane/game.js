import * as THREE from '/node_modules/three108/build/three.module.js'

import { scene, renderer, camera, createOrbitControls, createGround, createGradientSky, createSunLight } from '/utils/scene.js'
import { createTerrain } from '/utils/ground/index.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/Airplane.js'

scene.add(createGround({ color:0xFFC880 }))
scene.add(createGradientSky())
const light = createSunLight()
// const helper = new THREE.CameraHelper(light.shadow.camera)
// scene.add(helper)
scene.add(light)
scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)

scene.add(createTerrain(4000, 200))

const controls = createOrbitControls()

const avion = new Airplane(() => {
  scene.add(avion.mesh)
  controls.target = avion.mesh.position
  scene.getObjectByName('sunLight').target = avion.mesh
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avion.update()
  if (!keyboard.mouseDown)
    cameraFollowObject(camera, avion.mesh)

  renderer.render(scene, camera)
}()
