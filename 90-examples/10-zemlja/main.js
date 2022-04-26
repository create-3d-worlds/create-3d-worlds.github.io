import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'

const rotationSpeed = 0.001

const textureLoader = new THREE.TextureLoader()

const sphereGeometry = new THREE.SphereGeometry(15, 60, 60)
const sphereMaterial = createEarthMaterial()
const earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
earthMesh.name = 'earth'
scene.add(earthMesh)

const cloudGeometry = new THREE.SphereGeometry(15.2, 60, 60)
const cloudMaterial = createCloudMaterial()
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
cloudMesh.name = 'clouds'
scene.add(cloudMesh)

const ambientLight = new THREE.AmbientLight(0x111111)
ambientLight.name = 'ambient'
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(100, 10, -50)
directionalLight.name = 'directional'
scene.add(directionalLight)

camera.position.set(40, 0, 0)
camera.lookAt(scene.position)

const controls = createOrbitControls()

document.body.appendChild(renderer.domElement)

function createEarthMaterial() {
  // 4096 is the maximum width for maps
  const texture = textureLoader.load('textures/earthmap4k.jpg')
  const bumpMap = textureLoader.load('textures/earthbump4k.jpg')
  const specularMap = textureLoader.load('textures/earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial()
  material.map = texture
  material.specularMap = specularMap // reflection
  material.specular = new THREE.Color(0x262626)
  material.bumpMap = bumpMap // izbocine
  return material
}

function createCloudMaterial() {
  const cloudTexture = textureLoader.load('textures/fair_clouds_4k.png')
  const cloudMaterial = new THREE.MeshPhongMaterial()
  cloudMaterial.map = cloudTexture
  cloudMaterial.transparent = true
  return cloudMaterial
}

/* LOOP */

void function render() {
  controls.update()

  scene.getObjectByName('earth').rotation.y += rotationSpeed
  scene.getObjectByName('clouds').rotation.y += rotationSpeed * 1.1

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
