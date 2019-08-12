/* global SimplexNoise */
import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {createFirs, createPlane, createTrees} from '../utils/three-helpers.js'

const size = 1000

createOrbitControls()
camera.position.y = 250
camera.position.z = 250

const generateTerrain = function(size = 1000, avgHeight = 30) {
  const resolution = 20
  const landMaterial = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
    vertexColors: THREE.FaceColors
  })
  const landGeo = new THREE.PlaneGeometry(size, size, resolution, resolution)

  const noise = new SimplexNoise()
  const factorX = 50
  const factorY = 25
  const factorZ = 60

  landGeo.vertices.forEach(vertex => {
    let n = noise.noise(vertex.x / resolution / factorX, vertex.y / resolution / factorY)
    n -= 0.25
    vertex.z = n * factorZ
  })
  landGeo.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })

  const land = new THREE.Mesh(landGeo, landMaterial)
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.set(0, avgHeight, 0)

  const waterMaterial = new THREE.MeshLambertMaterial({
    color: 0x6699ff,
    transparent: true,
    opacity: 0.5,
    vertexColors: THREE.FaceColors
  })
  const waterGeo = new THREE.PlaneGeometry(size, size, resolution, resolution)
  waterGeo.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 2
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })

  const water = new THREE.Mesh(waterGeo, waterMaterial)
  water.rotateX(-Math.PI / 2)

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
