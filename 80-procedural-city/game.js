import { scene, camera, renderer, clock } from '../utils/three-scene.js'
import {createPlane} from '../utils/three-helpers.js'
import {randomInRange} from '../utils/helpers.js'
import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'

camera.position.y = 80

const controls = new FirstPersonControls(camera)
controls.movementSpeed = 20
controls.lookSpeed = 0.05

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1)
scene.add(light)

scene.add(createPlane(2000, 2000, 0x101018))

/* FUNCTIONS */

function generateBuilding() {
  const lightColor = new THREE.Color(0xffffff)
  const shadow = new THREE.Color(0x303050)
  const box = new THREE.CubeGeometry(1, 1, 1)
  box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))

  const building = new THREE.Mesh(box)

  const value = 1 - Math.random() * Math.random()
  const color = new THREE.Color().setRGB(value + Math.random() * 0.1, value, value + Math.random() * 0.1)

  const top = color.clone().multiply(lightColor)
  const bottom = color.clone().multiply(shadow)

  building.position.x = randomInRange(-1000, 1000)
  building.position.z = randomInRange(-1000, 1000)
  building.rotation.y = Math.random()
  building.scale.x = building.scale.z = randomInRange(10, 20, false)
  building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8

  const {geometry} = building
  for (let j = 0, jl = geometry.faces.length; j < jl; j++)
    if (j === 2)
      geometry.faces[j].vertexColors = [color, color, color, color]
    else
      geometry.faces[j].vertexColors = [top, bottom, bottom, top]

  return building
}

function generateCityGeometry(num = 10000) {
  const city = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const building = generateBuilding()
    building.updateMatrix()
    city.merge(building.geometry, building.matrix)
  }
  return city
}

function generateCityTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 32, 64)
  for (let y = 2; y < 64; y += 2)
    for (let x = 0; x < 32; x += 2) {
      const value = Math.floor(Math.random() * 64)
      context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')'
      context.fillRect(x, y, 2, 1)
    }

  const canvas2 = document.createElement('canvas')
  canvas2.width = 512
  canvas2.height = 1024
  const context2 = canvas2.getContext('2d')
  context2.imageSmoothingEnabled = false
  context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)
  return canvas2
}

function createCity(num = 10000) {
  const cityGeo = generateCityGeometry(num)
  const texture = new THREE.Texture(generateCityTexture())
  texture.needsUpdate = true
  const cityMesh = new THREE.Mesh(cityGeo, new THREE.MeshLambertMaterial({map: texture}))
  return cityMesh
}

/* INIT */

scene.add(createCity(10000))

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update(delta)
  renderer.render(scene, camera)
}()
