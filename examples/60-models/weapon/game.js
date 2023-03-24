import * as THREE from 'three'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

scene.add(createSun())
createOrbitControls()

camera.position.set(1, 1, 1)
camera.lookAt(new THREE.Vector3(0, 0.4, 0))

const barrel = await loadModel({ file: 'weapon/rifle.fbx', size: 1, fixColors: true, angle: Math.PI })

scene.add(barrel.mesh)

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
