import {scene, camera, renderer, clock} from '../utils/scene.js'
import {createStair} from '../utils/boxes.js'
import {createTerrain} from '../utils/floor.js'
import Avatar from '../classes/Avatar.js'

const terrain = createTerrain()
scene.add(terrain)

function createSpiralStairs() {
  const stairs = new THREE.Group
  const radius = 100
  const CIRCLE = Math.PI * 2
  const stairsInCirle = 40
  const step = CIRCLE / stairsInCirle
  const yDistance = 80

  for (let i = 0; i <= CIRCLE * 5; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createStair(x, i * yDistance, z)
    block.rotateY(Math.PI / 2 -i)
    stairs.add(block)
  }
  return stairs
}

const stairs = createSpiralStairs()
scene.add(stairs)

camera.position.z = 30
camera.position.y = 20

const avatar = new Avatar(100, 50, -50, 10, false)
avatar.mesh.rotateY(Math.PI)
avatar.add(camera)
avatar.addGround(terrain, stairs)
avatar.addSurrounding(stairs)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
