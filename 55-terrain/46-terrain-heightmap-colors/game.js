import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import terrainFromHeightmap from '/utils/ground/terrainFromHeightmap.js'

const light = new THREE.DirectionalLight()
light.position.set(300, 250, 300)
scene.add(light)

createOrbitControls()
camera.position.y = 150

terrainFromHeightmap('/assets/heightmaps/wiki.png', mesh => {
  scene.add(mesh)
})

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
