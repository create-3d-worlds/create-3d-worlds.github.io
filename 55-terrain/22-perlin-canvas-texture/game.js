import * as THREE from '/node_modules/three108/build/three.module.js'
import { ImprovedNoise } from '/node_modules/three108/examples/jsm/math/ImprovedNoise.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'

const perlin = new ImprovedNoise()

const planeSize = 7500
const worldSize = 256

createOrbitControls()
camera.position.y = 1500

const data = generateHeightData(worldSize, worldSize)

const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, worldSize - 1, worldSize - 1)
geometry.rotateX(- Math.PI / 2)

const vertices = geometry.attributes.position.array
for (let i = 0, j = 0; i < vertices.length; i ++, j += 3)
  vertices[j + 1] = data[i] * 10

const texture = new THREE.CanvasTexture(generateTexture(data, worldSize, worldSize))
texture.wrapS = THREE.ClampToEdgeWrapping
texture.wrapT = THREE.ClampToEdgeWrapping

const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }))
scene.add(mesh)

/* FUNCTIONS */

function generateHeightData(width, height) {
  const size = width * height
  const data = new Uint8Array(size)
  const z = Math.random() * 100
  let quality = 1
  for (let j = 0; j < 4; j ++) {
    for (let i = 0; i < size; i ++) {
      const x = i % width, y = ~ ~ (i / width)
      data[ i ] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= 5
  }
  return data
}

function generateTexture(data, width, height) {
  const vector3 = new THREE.Vector3(0, 0, 0)
  const sun = new THREE.Vector3(1, 1, 1)
  sun.normalize()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let context = canvas.getContext('2d')
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)
  let image = context.getImageData(0, 0, canvas.width, canvas.height)
  let imageData = image.data
  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {
    vector3.x = data[ j - 2 ] - data[ j + 2 ]
    vector3.y = 2
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ]
    vector3.normalize()
    const shade = vector3.dot(sun)
    imageData[ i ] = (96 + shade * 128) * (0.5 + data[ j ] * 0.007)
    imageData[ i + 1 ] = (32 + shade * 96) * (0.5 + data[ j ] * 0.007)
    imageData[ i + 2 ] = (shade * 96) * (0.5 + data[ j ] * 0.007)
  }
  context.putImageData(image, 0, 0)
  // Scaled 4x
  const canvasScaled = document.createElement('canvas')
  canvasScaled.width = width * 4
  canvasScaled.height = height * 4
  context = canvasScaled.getContext('2d')
  context.scale(4, 4)
  context.drawImage(canvas, 0, 0)
  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
  imageData = image.data
  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5)
    imageData[ i ] += v
    imageData[ i + 1 ] += v
    imageData[ i + 2 ] += v
  }
  context.putImageData(image, 0, 0)
  return canvasScaled
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
