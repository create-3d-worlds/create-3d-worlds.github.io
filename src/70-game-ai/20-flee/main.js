/* global THREE, SteeringEntity */
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { randomInRange, getMouseIntersects } from '/utils/helpers.js'
import { loadModel, getMixer } from '/utils/loaders.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 100, 100)

const floor = createFloor({ size: 1000 })
scene.add(floor)

const { mesh, animations } = await loadModel({ file: 'character/girl/girl.glb', size: .4 })
const runnerMixer = getMixer(mesh, animations, animations.length - 1)
const runner = new SteeringEntity(mesh)
runner.maxSpeed = 1.5
runner.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
scene.add(runner)

const { mesh: ghostMesh, mixer: ghostMixer } = await loadModel({ file: '/character/fantasma/scene.gltf' })
const pursuer = new SteeringEntity(ghostMesh)
pursuer.maxSpeed = 1
pursuer.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
scene.add(pursuer)

const boundaries = new THREE.Box3(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 0, 500))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update()

  const distance = runner.position.distanceTo(pursuer.position)
  if (distance > 5) {
    runner.flee(pursuer.position)
    runner.lookWhereGoing(true)
    pursuer.seek(runner.position)
    pursuer.lookWhereGoing(true)
  } else {
    runner.idle()
    runner.lookAt(pursuer.position)
    pursuer.idle()
    pursuer.lookAt(runner.position)
  }
  runner.update()
  pursuer.update()
  runner.bounce(boundaries)
  pursuer.bounce(boundaries)

  ghostMixer.update(delta)
  runnerMixer.update(delta)
  renderer.render(scene, camera)
}()

/* EVENT */

document.addEventListener('mousedown', onClick, true)

function onClick(e) {
  const intersects = getMouseIntersects(e, camera, scene)
  if (intersects.length > 0)
    runner.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
}
