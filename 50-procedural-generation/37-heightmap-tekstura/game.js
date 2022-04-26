/* global Plane */
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const FLOOR = -1000

let r = 0

const camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000)
camera.position.y = FLOOR + 2750

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x34583e, 0, 10000)

const light = new THREE.AmbientLight(0xffffff)
scene.addLight(light)

const renderer = new THREE.WebGLRenderer({ scene, clearColor: 0x34583e, clearAlpha: 0.5 })
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
document.body.appendChild(renderer.domElement)

const img = new Image()
img.onload = function() {
  const data = getHeightData(img)
  const terrain = new Plane(100, 100, 127, 127)

  for (let i = 0, l = terrain.vertices.length; i < l; i++)
    terrain.vertices[i].position.z = data[i]

  addMesh(terrain, 100, 0, FLOOR, 0, -1.57, 0, 0, getTerrainMaterial())
}
img.src = 'heightmap_128.jpg'

function addMesh(geometry, scale, x, y, z, rx, ry, rz, material) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.x = mesh.scale.y = mesh.scale.z = scale
  mesh.position.x = x
  mesh.position.y = y
  mesh.position.z = z
  mesh.rotation.x = rx
  mesh.rotation.y = ry
  mesh.rotation.z = rz
  mesh.overdraw = true
  mesh.doubleSided = false
  mesh.updateMatrix()
  scene.addObject(mesh)
  return mesh
}

function getHeightData(img, size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  const yData = new Float32Array(size * size)
  context.drawImage(img, 0, 0)
  const {data} = context.getImageData(0, 0, size, size)

  let j = 0
  for (let i = 0, n = data.length; i < n; i += (4)) {
    const all = data[i]
    yData[j++] = all / 10
  }
  return yData
}

function getTerrainMaterial() {
  const terrainMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping),
    ambient: 0xaaaaaa,
  })
  const img = new Image()
  terrainMaterial.map.image = img
  img.onload = function() {
    terrainMaterial.map.image.loaded = 1
  }
  img.src = 'terrain.jpg'
  return terrainMaterial
}

/* INIT */

void function update() {
  requestAnimationFrame(update)
  const dist = 4000
  camera.position.x = dist * Math.cos(r)
  camera.position.z = dist * Math.sin(r)
  r += 0.001
  renderer.render(scene, camera)
}()
