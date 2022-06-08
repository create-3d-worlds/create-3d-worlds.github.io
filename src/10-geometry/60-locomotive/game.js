import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene, renderer, hemLight, createOrbitControls } from '/utils/scene.js'
import { createLocomotive } from '/utils/shapes.js'

createOrbitControls()
camera.position.set(0, 2, 6)

hemLight()

scene.background = new THREE.Color(0x8FBCD4)
scene.add(createLocomotive())

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})
