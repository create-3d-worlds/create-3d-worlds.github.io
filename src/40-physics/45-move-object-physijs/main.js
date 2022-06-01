import { camera, renderer } from '/utils/scene.js'
import { scene, createGround, createCrate } from '/utils/physics.js'
import { mouseToWorld } from '/utils/helpers.js'
import { dirLight, ambLight } from '/utils/light.js'

let mousePos

camera.position.set(30, 25, 30)
camera.lookAt(scene.position)

dirLight({ scene, opacity: .6, position: [20, 40, -15] })
ambLight({ scene, intensity: .3 })

const ground = createGround({ size: 100 })
scene.add(ground)

const box = createCrate({ size: 4, mass: 64 })
scene.add(box)

const updateMousePosition = function(e) {
  const mouse3D = mouseToWorld(e)
  mouse3D.sub(camera.position).normalize()

  const coefficient = (box.position.y - camera.position.y) / mouse3D.y
  mousePos = camera.position.clone().add(mouse3D.multiplyScalar(coefficient))
}

const applyForce = function() {
  if (!mousePos) return
  const strength = 35
  const distance = mousePos.distanceTo(box.position)
  const effect = mousePos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate()
  const offset = mousePos.clone().sub(box.position)
  box.applyImpulse(effect, offset)
}

/* LOOP */

scene.simulate()

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

scene.addEventListener('update', () => {
  applyForce()
  scene.simulate(undefined, 1)
})

/* EVENT */

document.addEventListener('click', updateMousePosition)
