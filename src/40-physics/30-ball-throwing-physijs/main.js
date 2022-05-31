import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { translateMouse } from '/utils/helpers.js'
import { ambLight, dirLight } from '/utils/light.js'
import { createGround, createBall } from '/utils/physics.js'

const scene = new Physijs.Scene
scene.setGravity({ x: 0, y: -10, z: 0 })

ambLight({ scene, color: 0x707070 })
dirLight({ scene })

const raycaster = new THREE.Raycaster()

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

const throwBall = ({ target, scalar = 60 } = {}) => {
  raycaster.setFromCamera(target, camera)

  const ball = createBall()
  ball.position.copy(raycaster.ray.direction)
  ball.position.add(raycaster.ray.origin)
  scene.add(ball)

  const pos = new THREE.Vector3()
  pos.copy(raycaster.ray.direction)
  pos.multiplyScalar(scalar)
  ball.setLinearVelocity(new THREE.Vector3(pos.x, pos.y, pos.z))
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
  const target = translateMouse(e)
  throwBall({ target })
})
