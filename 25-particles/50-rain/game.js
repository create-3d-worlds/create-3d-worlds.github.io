import { scene, camera, renderer, hemLight } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { createRain } from '/utils/particles.js'

hemLight()

const rain = createRain()
scene.add(rain)

rain.geometry.vertices.forEach(vertex => {
  vertex.speed = randomInRange(.5, 3) // add speed attribute
})

/* LOOP */

void function animate() {
  rain.geometry.vertices.forEach(vertex => {
    vertex.y -= vertex.speed
    if (vertex.y < -300) vertex.y = 300
  })
  rain.geometry.verticesNeedUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
