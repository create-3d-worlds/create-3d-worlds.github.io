import * as THREE from 'three'
import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createFloor } from '/core/ground.js'
import { createTexturedCity } from '/core/city.js'
import { hemLight } from '/core/light.js'

const mapSize = 2000

hemLight()
const controls = await createOrbitControls()
camera.position.set(0, 100, 400)
camera.lookAt(new THREE.Vector3(0, 100, 0))

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)

scene.add(createFloor({ size: mapSize }))

scene.add(createTexturedCity({ mapSize }))

/* INIT */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
