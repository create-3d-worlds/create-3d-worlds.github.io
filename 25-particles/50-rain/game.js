import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

createOrbitControls()
hemLight()

const dropsNum = 10000
const geometry = new THREE.Geometry()

for (let i = 0; i < dropsNum; i++) {
  const rainDrop = new THREE.Vector3()
  rainDrop.x = randomInRange(-1000, 1000)
  rainDrop.y = randomInRange(-1000, 1000)
  rainDrop.z = randomInRange(-1000, 1000)
  rainDrop.velocity = randomInRange(5, 10)
  geometry.vertices.push(rainDrop)
}

const material = new THREE.PointsMaterial({
  color: 0x9999ff,
  transparent: true,
  opacity: 0.8
})
const rain = new THREE.Points(geometry, material)
scene.add(rain)

/* LOOP */

void function animate() {
  geometry.vertices.forEach(p => {
    p.y -= p.velocity
    if (p.y < -200) p.y = 200
  })
  geometry.verticesNeedUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()