import * as THREE from '/node_modules/three108/build/three.module.js'

import { scene, renderer, camera, createOrbitControls, createGround, createGradientSky, createSunLight } from '/utils/scene.js'
import { createTerrain } from '/utils/ground/index.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/Airplane.js'
import { createFirTrees } from '/utils/trees.js'

const ground = createGround({ color:0xFFC880 })
const trees = createFirTrees(500, 4000, 25)
scene.add(ground, trees)
scene.add(createGradientSky())
const light = createSunLight()
// const helper = new THREE.CameraHelper(light.shadow.camera)
// scene.add(helper)
scene.add(light)
scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)

const terrain = createTerrain(8000, 200)
scene.add(terrain)

const controls = createOrbitControls()

const avion = new Airplane(() => {
  scene.add(avion.mesh)
  controls.target = avion.mesh.position
  scene.getObjectByName('sunLight').target = avion.mesh
  avion.addSolids(ground, terrain)
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
