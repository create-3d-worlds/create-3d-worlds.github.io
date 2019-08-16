import { scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import { roll, randomInRange } from '../utils/helpers.js'
import { createTreesOnTerrain, createWater } from '../utils/three-helpers.js'
import {createHillyTerrain} from '../utils/createHillyTerrain.js'
import '../node_modules/three/examples/js/loaders/deprecated/LegacyJSONLoader.js'

const size = 600

camera.position.y = 250
scene.add(createWater(1000))
const land = createHillyTerrain(1000, 30)
scene.add(land)
scene.add(createTreesOnTerrain(land))

const loader = new THREE.LegacyJSONLoader()
const clouds = new THREE.Group()

// TODO: create Cloud class

function createCloud(geometry, materials) {
  const cloud = new THREE.Mesh(geometry, materials)
  cloud.scale.set(roll(50) + 10, 15, roll(10) + 10)
  cloud.castShadow = true
  cloud.position.x = randomInRange(-size, size)
  cloud.position.z = randomInRange(-size, size)
  cloud.position.y = randomInRange(60, 100)
  return cloud
}

loader.load('../assets/models/cloud.json', (geometry, materials) => {
  for (let i = 0; i < 10; i++)
    clouds.add(createCloud(geometry, materials))
  scene.add(clouds)
})

createOrbitControls()

scene.add(createWater(1000))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  // update clouds
  if (clouds.children.length)
    clouds.children.forEach(cloud => {
      cloud.position.x += Math.random()
      if (cloud.position.x > size)
        cloud.position.x = -size
    })

  renderer.render(scene, camera)
}()
