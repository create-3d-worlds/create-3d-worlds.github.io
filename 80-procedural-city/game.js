import { scene, camera, renderer, clock } from '../utils/three-scene.js'
import {createPlane} from '../utils/three-helpers.js'
import {randomInRange} from '../utils/helpers.js'
import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'

camera.position.y = 80

const controls = new FirstPersonControls(camera)
controls.movementSpeed = 20
controls.lookSpeed = 0.05

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createPlane(2000, 2000, 0x101018))

/* FUNCTIONS */

function generateBuilding() {
  const box = new THREE.CubeGeometry(1, 1, 1)
  box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))

  const building = new THREE.Mesh(box)
  building.position.x = randomInRange(-1000, 1000)
  building.position.z = randomInRange(-1000, 1000)
  building.rotation.y = Math.random()
  building.scale.x = building.scale.z = randomInRange(10, 20, false)
  building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8
  return building
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
      context.fillStyle = `rgb(${value}, ${value}, ${value})`
      context.fillRect(x, y, 2, 1)
    }
  return canvas
}

function createCity(num = 10000) {
  const cityGeo = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const building = generateBuilding()
    building.updateMatrix()
    cityGeo.merge(building.geometry, building.matrix)
  }
  const texture = new THREE.Texture(generateCityTexture())
  texture.needsUpdate = true
  const material = new THREE.MeshLambertMaterial({map: texture})
  return new THREE.Mesh(cityGeo, material)
}

/* INIT */

scene.add(createCity(10000))

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update(delta)
  renderer.render(scene, camera)
}()
