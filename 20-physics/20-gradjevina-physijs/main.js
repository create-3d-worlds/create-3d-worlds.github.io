/* global THREE, Physijs */
import {camera, renderer, createOrbitControls} from '/utils/scene.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativno u odnosu na worker

const blocks = []

createOrbitControls()
const scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 })
scene.setGravity(new THREE.Vector3(0, -30, 0))

camera.position.set(5, 10, -15)
camera.lookAt(new THREE.Vector3(0, 10, 0))
scene.add(camera)

const dir_light = new THREE.DirectionalLight(0xFFFFFF)
dir_light.position.set(20, 30, -5)
dir_light.target.position.copy(scene.position)
scene.add(dir_light)

const table_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ color: 0xFFFFFF }),
  .9, // high friction
  .2 // low restitution
)

const block_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  .4, // medium friction
  .4 // medium restitution
)

const table = new Physijs.BoxMesh(
  new THREE.BoxGeometry(50, 1, 50),
  table_material,
  0, // mass
  { restitution: .2, friction: .8 }
)
scene.add(table)

createTower()

function createTower() {
  const block_height = 1, block_offset = 2
  const block_geometry = new THREE.BoxGeometry(6, block_height, 1.5)

  const rows = 16
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < 3; j++) {
      const block = new Physijs.BoxMesh(block_geometry, block_material)
      block.position.y = (block_height / 2) + block_height * i
      if (i % 2 === 0) {
        block.rotation.y = Math.PI / 2.01 // #TODO: There's a bug somewhere when this is to close to 2
        block.position.x = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      } else
        block.position.z = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      scene.add(block)
      blocks.push(block)
    }
}

/* LOOPS */

void function render() {
  requestAnimationFrame(render)
  scene.simulate()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('click', () => {
  scene.setGravity(new THREE.Vector3(0, -30, 10))
})