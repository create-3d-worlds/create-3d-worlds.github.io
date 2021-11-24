import * as THREE from '/node_modules/three108/build/three.module.js'
import { createBlueSky, createSunLight } from './sky.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'

scene.background = new THREE.Color().setHSL(0.6, 0, 1)

scene.fog = new THREE.Fog(scene.background, 1, 5000)
scene.fog.color.set(0xffffff)

scene.add(createBlueSky())
scene.add(createSunLight())

export {
  scene,
  renderer,
  camera,
  clock,
  createOrbitControls,
}
