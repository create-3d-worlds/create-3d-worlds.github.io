/* global SimplexNoise */
import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {createFirs, createWater} from '../utils/three-helpers.js'
import {randomInRange} from '../utils/helpers.js'

const size = 1000

createOrbitControls()
camera.position.y = 250
camera.position.z = 250

const createHillTerrain = (size, avgHeight = 30) => {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
    vertexColors: THREE.FaceColors,
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)

  const noise = new SimplexNoise()
  const factorX = 50
  const factorZ = 25
  const factorY = 60
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-factorX, factorX)
    vertex.z += randomInRange(-factorZ, factorZ)
    const dist = noise.noise(vertex.x / resolution / factorX, vertex.z / resolution / factorZ)
    vertex.y = (dist - 0.2) * factorY
  })
  geometry.faces.forEach(face => {
    const {color} = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = avgHeight
  return mesh
}

scene.add(createWater(size))
const land = createHillTerrain(size, 30)
scene.add(land)
scene.add(createFirs(land))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
