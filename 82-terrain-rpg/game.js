/* global SimplexNoise */
import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {createFirs, createPlane, createTrees} from '../utils/three-helpers.js'
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
    const { color } = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = avgHeight
  return mesh
}

const createWater = size => {
  const resolution = 10
  const material = new THREE.MeshLambertMaterial({
    color: 0x6699ff,
    transparent: true,
    opacity: 0.5,
    vertexColors: THREE.FaceColors
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)
  geometry.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 2
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })
  return new THREE.Mesh(geometry, material)
}

const generateTerrain = function(size = 1000, avgHeight = 30) {
  const land = createHillTerrain(size, avgHeight)
  const water = createWater(size)
  const terrain = new THREE.Object3D()
  terrain.name = 'terrain'
  terrain.add(land)
  terrain.add(water)
  terrain.receiveShadow = true
  return terrain
}

const terrain = generateTerrain(size)
scene.add(terrain)
scene.add(createFirs(terrain))

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
