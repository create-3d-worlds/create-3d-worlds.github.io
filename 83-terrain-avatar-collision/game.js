import { scene, camera, renderer, clock, createOrbitControls } from '../utils/three-scene.js'
import {createFir, createTerrain, createFloor, createPlane, createTrees} from '../utils/three-helpers.js'
import {rndInt} from '../utils/helpers.js'
import Avatar from '../classes/Avatar.js'

const size = 1000

class Fir {
  constructor(pos) {
    this.name = 'tree'
    this.mesh = createFir()
    const {x, y, z} = pos
    this.mesh.position.set(x, y, z)
  }
}

const place = function(position) {
  const direction = new THREE.Vector3(0, -1, 0)
  const origin = { x: position.x, y: 100, z: position.z }

  const raycaster = new THREE.Raycaster()
  raycaster.set(origin, direction)

  const arrowHelper = new THREE.ArrowHelper(direction, origin, 100)
  scene.add(arrowHelper)

  const land = scene.getObjectByName('floor')
  const intersects = raycaster.intersectObject(land, true)
  console.log(intersects)
  if (intersects.length > 0) {
    console.log(intersects[0].point)
    return intersects[0].point
  }
  return null
}

const createFirs = function(numTrees = 50) {
  const group = new THREE.Group()
  for (let i = 0; i < numTrees; i++) {
    const rndPoint = new THREE.Vector3(rndInt(size / 2), 100, rndInt(size / 2))
    // console.log(rndPoint)
    // group.add(new Fir(rndPoint).mesh)
    const position = place(rndPoint)
    if (position) {
      console.log(position)
      // if (position.y > 0) {
      //   position.y -= 10
      // }
      group.add(new Fir(position).mesh)
    }
  }
  return group
}



const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)

const terrain = createFloor(size, size)
terrain.name = 'floor'
scene.add(terrain)
// scene.add(createTrees())
scene.add(createFirs())

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 75

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, null, terrain)
  controls.update()
  renderer.render(scene, camera)
}()
