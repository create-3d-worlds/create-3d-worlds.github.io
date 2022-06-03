import * as THREE from '/node_modules/three127/build/three.module.js'
import {
  scene, camera, renderer, createOrbitControls, hemLight
} from '/utils/scene.js'
// import terrainFromHeightmap from '/utils/ground/terrainFromHeightmap.js'
import { dirLight } from '/utils/light.js'
import { randomNuance } from '/utils/helpers.js'

hemLight()
dirLight()

const controls = createOrbitControls()
camera.position.y = 200

const terrain = terrainFromHeightmap({ textureFile: 'ground.jpg' })
scene.add(terrain)

function terrainFromHeightmap({
  file = 'wiki.png', textureFile = '', widthSegments = 100, heightSegments = 100, displacementScale = 150, color = 0x33aa33,
} = {}) {
  const textureLoader = new THREE.TextureLoader()

  const geometry = new THREE.PlaneBufferGeometry(1000, 1000, widthSegments, heightSegments)

  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i ++) {
    const nuance = randomNuance(color)
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.MeshStandardMaterial({
    // color,
    vertexColors: THREE.FaceColors,
    // map: textureFile ? textureLoader.load(`/assets/textures/${textureFile}`) : null,
    displacementMap: textureLoader.load(`/assets/heightmaps/${file}`),
    displacementScale,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -.5
  return mesh
}

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(update)
}()
