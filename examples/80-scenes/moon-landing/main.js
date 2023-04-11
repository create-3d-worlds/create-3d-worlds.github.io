import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { createMoon } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createBox } from '/utils/geometry.js'
import Lander from './Lander.js'
import { Stars } from '/utils/classes/Particles.js'
import Score from '/utils/ui/Score.js'

const score = new Score({ subtitle: 'Fuel' })

/* CLASSES */

class Platform {
  constructor() {
    this.step = 2
    this.range = 30
    this.mesh = createBox({ width: 5, height: 1, depth: 2.5 })
    this.mesh.position.y = -10
  }

  updateStep() {
    if (this.mesh.position.x >= this.range) this.step = -this.step
    if (this.mesh.position.x <= -this.range) this.step = this.step
    if (Math.random() > .997) this.step = -this.step
  }

  move(dt) {
    this.updateStep()
    this.mesh.position.x += this.step * dt
  }

  sync(mesh, dt) {
    mesh.position.x += this.step * dt
  }
}

/* INIT */

const moon = createMoon()
moon.position.set(30, 0, 30)
scene.add(moon)
setBackground(0x000000)
camera.position.z = 18

const { mesh: landerMesh } = await loadModel({ file: 'space/lunar-module/model.fbx', size: 2.5 })
scene.add(landerMesh)
landerMesh.position.y = 5

const platform = new Platform()
scene.add(platform.mesh)

const lander = new Lander(landerMesh)

const stars = new Stars()
scene.add(stars.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()

  platform.move(dt)
  if (lander.hasLanded) {
    platform.sync(lander.mesh, dt)
    score.renderText(lander.failure ? 'Landing failure!' : 'Nice landing!')
  }
  lander.handleInput(dt)
  lander.checkLanding(platform.mesh, dt)
  lander.update(dt)

  score.renderPoints(0, null, lander.fuel)

  renderer.render(scene, camera)
}()
