import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createSketchTrees } from '/utils/trees.js'

scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

camera.position.y = 100
createOrbitControls()

scene.add(createSketchTrees())
scene.add(createGround())

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
