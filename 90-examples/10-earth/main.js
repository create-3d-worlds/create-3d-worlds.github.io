import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'

const rotationSpeed = 0.001
const textureLoader = new THREE.TextureLoader()

const controls = createOrbitControls()
camera.position.set(40, 0, 0)

const sphereGeometry = new THREE.SphereGeometry(15, 60, 60)
const sphereMaterial = createEarthMaterial()
const earth = new THREE.Mesh(sphereGeometry, sphereMaterial)
earth.name = 'earth'
scene.add(earth)

const cloudGeometry = new THREE.SphereGeometry(15.2, 60, 60)
const cloudMaterial = createCloudMaterial()
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
scene.add(clouds)

const ambientLight = new THREE.AmbientLight(0x111111)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(100, 10, -50)
scene.add(directionalLight)

function createEarthMaterial() {
  // 4096 is the maximum width for maps
  const map = textureLoader.load('textures/earthmap4k.jpg')
  const bumpMap = textureLoader.load('textures/earthbump4k.jpg')
  const specularMap = textureLoader.load('textures/earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial({ map, specularMap, bumpMap })
  return material
}

function createCloudMaterial() {
  const map = textureLoader.load('textures/fair_clouds_4k.png')
  const cloudMaterial = new THREE.MeshPhongMaterial({ map, transparent: true })
  return cloudMaterial
}

/* LOOP */

void function render() {
  controls.update()

  earth.rotation.y += rotationSpeed
  clouds.rotation.y += rotationSpeed * 1.1

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
