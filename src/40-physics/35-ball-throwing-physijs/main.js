import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'

import { renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import {translateMouse} from '/utils/helpers.js'

const scene = new Physijs.Scene
scene.setGravity(new THREE.Vector3(0, -10, 0))

const ambientLight = new THREE.AmbientLight(0x707070)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-10, 18, 5)
light.castShadow = true
scene.add(light)

const raycaster = new THREE.Raycaster()

const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 })
const pos = new THREE.Vector3()

camera.position.z = 20
camera.position.y = 5

const controls = createOrbitControls()

const textureLoader = new THREE.TextureLoader()

const mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
mat.map = textureLoader.load('/assets/textures/crate.gif')
const geom = new THREE.CubeGeometry(1, 1, 1)
let y = 1
for (let j = 1; j <= 7; ++j) {
  for (let i = -5; i <= 5; ++i) {
    const box = new Physijs.BoxMesh(geom, mat)
    box.castShadow = true
    box.position.x = i
    box.position.y = y + 0.5
    scene.add(box)
  }
  y++
}

const floor = new Physijs.BoxMesh(
  new THREE.CubeGeometry(20, 0.1, 20),
  new THREE.MeshPhongMaterial({ color: 0x666666 }),
  0 // mass
)
floor.receiveShadow = true
floor.position.set(0, 0, 0)
scene.add(floor)

function onMouseDown(event) {
  const mouseCoords = translateMouse(event)
  raycaster.setFromCamera(mouseCoords, camera)

  const ballMass = 35
  const ballRadius = 0.4
  const ball = new Physijs.SphereMesh(
    new THREE.SphereGeometry(ballRadius, 10, 10),
    ballMaterial,
    ballMass
  )

  ball.castShadow = true

  ball.position.copy(raycaster.ray.direction)
  ball.position.add(raycaster.ray.origin)

  scene.add(ball)

  pos.copy(raycaster.ray.direction)
  pos.multiplyScalar(80)
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

window.addEventListener('mousedown', onMouseDown)
