import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'

const loader = new THREE.TextureLoader()

renderer.setClearColor('#121212', 1)
camera.position.set(30, 5, 35)

const controls = createOrbitControls()
controls.target.set(30, 0, 0)

/* MESH */
const geometry = new THREE.SphereGeometry(1, 32, 16)
const material = file => new THREE.MeshStandardMaterial({ map: loader.load(`assets/${file}`) })

const sunMesh = new THREE.Mesh(geometry, material('sun.jpg'))
sunMesh.position.set(0, 0, 0)
sunMesh.scale.setScalar(10)
scene.add(sunMesh)

const mercuryGroup = new THREE.Group()
const mercuryMesh = new THREE.Mesh(geometry, material('mercury.jpg'))
createPlanet(scene, mercuryMesh, mercuryGroup, 25, 0.8)

const venusGroup = new THREE.Group()
const venusMesh = new THREE.Mesh(geometry, material('venus.jpg'))
createPlanet(scene, venusMesh, venusGroup, 28, 0.9)

const earthGroup = new THREE.Group()
const earthMesh = new THREE.Mesh(geometry, material('earth.jpg'))
createPlanet(scene, earthMesh, earthGroup, 31, 1)

const marsGroup = new THREE.Group()
const marsMesh = new THREE.Mesh(geometry, material('mars.jpg'))
createPlanet(scene, marsMesh, marsGroup, 34, 0.8)

const jupiterGroup = new THREE.Group()
const jupiterMesh = new THREE.Mesh(geometry, material('jupiter.jpg'))
createPlanet(scene, jupiterMesh, jupiterGroup, 42, 3.5)

const saturnGroup = new THREE.Group()
const saturnMesh = new THREE.Mesh(geometry, material('saturn.jpg'))
createPlanet(scene, saturnMesh, saturnGroup, 50, 2.9)

const uranusGroup = new THREE.Group()
const uranusMesh = new THREE.Mesh(geometry, material('uranus.jpg'))
createPlanet(scene, uranusMesh, uranusGroup, 56, 1.7)

const neptuneGroup = new THREE.Group()
const neptuneMesh = new THREE.Mesh(geometry, material('neptune.jpg'))
createPlanet(scene, neptuneMesh, neptuneGroup, 60, 1.65)

const plutoGroup = new THREE.Group()
const plutoMesh = new THREE.Mesh(geometry, material('pluto.jpeg'))
createPlanet(scene, plutoMesh, plutoGroup, 64, 0.5)

/* LIGHTS */

const light = new THREE.PointLight('white', 1.25)
light.position.set(0, 0, 0)
scene.add(light)

createSpotlights(scene) // illuminate the sun

/* FUNCTION */

function createPlanet(scene, mesh, group, x, scale) {
  mesh.position.set(x, 0, 0)
  mesh.scale.setScalar(scale)
  group.add(mesh)
  scene.add(group)
}

function createSpotlights(scene) {
  const color = 0xFFFFFF
  const intensity = 5
  const distance = 25
  const angle = Math.PI / 7

  for (let i = 0; i < 6; i++) {
    const spotlight = new THREE.SpotLight(color, intensity, distance, angle)
    const pos = i % 2 ? -25 : 25
    const x = i < 2 ? pos : 0
    const y = i >= 2 && i < 4 ? pos : 0
    const z = i >= 4 ? pos : 0
    spotlight.position.set(x, y, z)
    scene.add(spotlight)
  }
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  const time = clock.getElapsedTime()
  sunMesh.rotation.y = time * 0.05

  mercuryGroup.rotation.y = time * 0.5
  mercuryMesh.rotation.y = time * 0.20

  venusGroup.rotation.y = time * 0.35
  venusMesh.rotation.y = time * 0.18

  earthGroup.rotation.y = time * 0.3
  earthMesh.rotation.y = time * 0.15

  marsGroup.rotation.y = time * 0.2
  marsMesh.rotation.y = time * 0.2

  jupiterGroup.rotation.y = time * 0.05
  jupiterMesh.rotation.y = time * 0.05

  saturnGroup.rotation.y = time * 0.03
  saturnMesh.rotation.y = time * 0.25

  uranusGroup.rotation.y = time * 0.02
  uranusMesh.rotation.y = time * 0.25

  neptuneGroup.rotation.y = time * 0.015
  neptuneMesh.rotation.y = time * 0.25

  plutoGroup.rotation.y = time * 0.005
  plutoMesh.rotation.y = time * 0.2

  controls.update()
  renderer.render(scene, camera)
}()
