import { scene, camera, renderer, hemLight } from '/utils/scene.js'
import { createRain, addVelocity } from '/utils/particles.js'

hemLight()

const rain = createRain()
scene.add(rain)

addVelocity({ particles: rain, min: 0.5, max: 3 })

/* LOOP */

void function animate() {
  rain.geometry.vertices.forEach(vertex => {
    vertex.y -= vertex.velocity
    if (vertex.y < -300) vertex.y = 300
  })
  rain.geometry.verticesNeedUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
