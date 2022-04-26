import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

const flakesNum = 10000
const flakeSizes = [20, 15, 10, 8, 5]
const materials = []
const vertices = []

const geometry = new THREE.BufferGeometry()
const textureLoader = new THREE.TextureLoader()
const sprite = textureLoader.load('/assets/textures/snowflake.png')

for (let i = 0; i < flakesNum; i ++) {
  const x = Math.random() * 2000 - 1000
  const y = Math.random() * 2000 - 1000
  const z = Math.random() * 2000 - 1000
  vertices.push(x, y, z)
}
geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

flakeSizes.forEach((size, i) => {
  materials[i] = new THREE.PointsMaterial({
    size,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  })
  const drops = new THREE.Points(geometry, materials[i])
  scene.add(drops)
})

/* LOOP */

function renderSnow() {
  const time = Date.now() * 0.00005
  scene.children.forEach((child, i) => {
    if (child instanceof THREE.Points) {
      child.translateY(-5)
      child.rotation.y = time * (i < 4 ? i + 1 : - (i + 1))
      if (child.position.y < 0)
        child.position.y = Math.random() * 2000 - 1000
    }
  })
  renderer.render(scene, camera)
}

void function animate() {
  requestAnimationFrame(animate)
  renderSnow()
}()
