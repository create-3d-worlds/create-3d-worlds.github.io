import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { normalizeMouse } from '/utils/helpers.js'
import { ambLight, dirLight } from '/utils/light.js'
import { createGround, createBall } from '/utils/physics.js'

const scene = new Physijs.Scene
scene.setGravity({ x: 0, y: -10, z: 0 })

ambLight({ scene, color: 0x707070 })
dirLight({ scene })

camera.position.z = 20
camera.position.y = 5

const controls = createOrbitControls()

const textureLoader = new THREE.TextureLoader()

function createCrate() {
  const mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
  mat.map = textureLoader.load('/assets/textures/crate.gif')
  const geom = new THREE.CubeGeometry(1, 1, 1)
  const box = new Physijs.BoxMesh(geom, mat)
  box.castShadow = true
  return box
}

for (let j = 1; j <= 7; ++j)
  for (let i = -5; i <= 5; ++i) {
    const box = createCrate()
    box.position.set(i, j, 0)
    scene.add(box)
  }

const floor = createGround({ size: 20 })
scene.add(floor)

const throwBall = ({ coords, scalar = 60 } = {}) => {
  const ball = createBall()
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(coords, camera)
  ball.position.copy(raycaster.ray.direction).add(raycaster.ray.origin)

  scene.add(ball)

  const velocity = new THREE.Vector3()
  velocity.copy(raycaster.ray.direction).multiplyScalar(scalar)
  ball.setLinearVelocity(velocity)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  controls.update(deltaTime)
  scene.simulate()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()

window.addEventListener('mousedown', e => {
  const coords = normalizeMouse(e)
  throwBall({ coords })
})
