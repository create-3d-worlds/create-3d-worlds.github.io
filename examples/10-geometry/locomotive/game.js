import * as THREE from 'three'
import { camera, scene, renderer, createOrbitControls } from '/core/scene.js'
import { createLocomotive } from '/core/geometry/shapes.js'
import { createGround } from '/core/ground.js'
import { hemLight } from '/core/light.js'

createOrbitControls()
camera.position.set(0, 2, 6)

hemLight()

scene.background = new THREE.Color(0x8FBCD4)
scene.add(createLocomotive())

scene.add(createGround({ size: 50 }))

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})
