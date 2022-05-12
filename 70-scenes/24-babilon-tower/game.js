import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createStair } from '/utils/boxes.js'
import { createTerrain } from '/utils/ground.js'
import { Kamenko } from '/classes/index.js'
import { dirLight, hemLight } from '/utils/light.js'

dirLight()
hemLight({ intensity: .75 })

camera.position.z = 20
camera.position.y = 10

function createCircle(radius = 100, y = 0) {
  const blocks = []
  const CIRCLE = Math.PI * 2
  const stairsInCirle = 20
  const step = CIRCLE / stairsInCirle
  for (let i = 0; i <= CIRCLE; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createStair(x, y, z)
    block.rotateY(-i)
    blocks.push(block)
  }
  return blocks
}

function createTower(floors = 5) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle(100 - i * 10, i * 20))
  return group
}

const tower = createTower(6)
const terrain = createTerrain()
scene.add(terrain, tower)

const avatar = new Kamenko({ size: 5, skin: 0 })
avatar.position.set(120, 10, 0)
avatar.add(camera)
avatar.addSolids(terrain, tower)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
