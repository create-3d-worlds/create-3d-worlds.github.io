import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createBox } from '/utils/geometry.js'
import Lander from './Lander.js'
import { Stars } from '/utils/classes/Particles.js'

const stats = document.getElementById('stats')

/* CLASSES */

const platformRange = 30

let step = 2

function move(dt, platform, lander) {
  if (platform.position.x >= platformRange) step = -step
  if (platform.position.x <= -platformRange) step = step
  if (Math.random() > .997) step = -step
  platform.position.x += step * dt
  if (!lander.falling) lander.mesh.position.x += step * dt
}

/* INIT */

const sun = createSun()
sun.position.set(30, 0, 30)
scene.add(sun)
setBackground(0x000000)
camera.position.z = 20

const { mesh: landerMesh } = await loadModel({ file: 'space/lunar-module/model.fbx', size: 2.5 })
scene.add(landerMesh)
landerMesh.position.y = 5

const platform = createBox({ width: 5, height: 1, depth: 2.5 })
platform.position.y = -10
scene.add(platform)

const lander = new Lander(landerMesh)

const stars = new Stars()
scene.add(stars.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()

  move(dt, platform, lander)

  lander.handleInput(dt)
  lander.checkLanding(platform, dt)
  lander.update(dt)

  lander.showStats(stats)

  renderer.render(scene, camera)
}()
