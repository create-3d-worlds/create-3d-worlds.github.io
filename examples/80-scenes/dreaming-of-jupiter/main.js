import { camera, scene, renderer, setBackground } from '/utils/scene.js'
import { createMoon, createJupiter, orbiting } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { pointLight } from '/utils/light.js'

setBackground(0x000000)
camera.position.set(0, 9, 40)

pointLight({ pos: [0, 30, 30] })

const planet = createJupiter()
planet.position.set(0, 8, 0)
scene.add(planet)

const moon = createMoon()
moon.position.set(0, 8, 0)
scene.add(moon)

const terrain = createTerrain() // { colorParam: 'purple' }
terrain.material.wireframe = true
scene.add(terrain)

const stars = new Stars({ num: 1000 })
scene.add(stars.mesh)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)

  planet.rotation.y += 0.002
  moon.rotation.y -= 0.007
  orbiting(moon, time, 15, 0, 20)

  shake({ geometry: terrain.geometry, time }) // shake
  stars.update()

  time += 0.015
  renderer.render(scene, camera)
}()
