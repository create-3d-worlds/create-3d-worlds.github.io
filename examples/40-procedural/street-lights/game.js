import * as THREE from 'three'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createLampposts } from '/utils/city.js'
import { hemLight } from '/utils/light.js'

hemLight({ intensity: .4 })
renderer.setClearColor(0x000000)

const mapSize = 200

camera.position.set(160, 40, 10)
createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

scene.add(createGround({ size: mapSize }))
scene.add(createLampposts({ mapSize, numLampposts: 10 }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()