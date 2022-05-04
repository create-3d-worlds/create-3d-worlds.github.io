import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const flakesNum = 10000
const size = 1000
const flakeSizes = [20, 15, 10, 8, 5]

const texture = new THREE.TextureLoader().load('/assets/textures/snowflake.png')

const vertices = []
for (let i = 0; i < flakesNum; i ++)
  vertices.push(randomInRange(-size, size), randomInRange(-size, size), randomInRange(-size, size))

const geometry = new THREE.BufferGeometry()
geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

flakeSizes.forEach(size => {
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  })
  scene.add(new THREE.Points(geometry, material))
})

/* LOOP */

function updateSnow() {
  const time = Date.now() * 0.00005
  scene.children.forEach((snow, i) => {
    snow.translateY(-5)
    snow.rotation.y = time * (i < 4 ? i + 1 : - (i + 1))
    if (snow.position.y < 0)
      snow.position.y = randomInRange(-size, size)
  })
}

void function animate() {
  requestAnimationFrame(animate)
  updateSnow()
  renderer.render(scene, camera)
}()
