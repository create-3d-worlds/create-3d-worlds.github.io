import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

createOrbitControls()
hemLight()

function createRain({ num = 10000, size = 1, opacity = 0.8, minRange = -1000, maxRange = 1000, color = 0x9999ff } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const rainDrop = new THREE.Vector3()
    rainDrop.x = randomInRange(minRange, maxRange)
    rainDrop.y = randomInRange(minRange, maxRange)
    rainDrop.z = randomInRange(minRange, maxRange)
    rainDrop.velocity = randomInRange(5, 10)
    geometry.vertices.push(rainDrop)
  }

  const material = new THREE.PointsMaterial({
    color,
    transparent: true,
    opacity,
    size
  })
  const rain = new THREE.Points(geometry, material)
  return rain
}

const rain = createRain()
scene.add(rain)

/* LOOP */

void function animate() {
  rain.geometry.vertices.forEach(p => {
    p.y -= p.velocity
    if (p.y < -200) p.y = 200
  })
  rain.geometry.verticesNeedUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
