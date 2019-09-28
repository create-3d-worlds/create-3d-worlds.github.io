import * as THREE from '/node_modules/three/build/three.module.js'
import { createFloor } from '/utils/floor.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import FirstPersonRenderer from '/classes/2d/FirstPersonRenderer.js'
import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'
import Player from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'

camera.position.y = 10
camera.position.z = 5
const fpsRenderer = new FirstPersonRenderer()

const matrix = randomMatrix()
const map = new Tilemap(matrix, 100)
const smallMap = new Tilemap(matrix, 20)
const smallMapRenderer = new SmallMapRenderer(smallMap)
smallMapRenderer.hide()

scene.add(createFloor(1000, 'snow-512.jpg'))
const walls = map.create3DMap(0.5)
scene.add(walls)

const {x, z} = map.randomEmptyPos
const player = new Player(x, 0, z, 10, true)
player.add(camera)
player.addSolids(walls)
scene.add(player.mesh)

const flakesNum = 10000
const flakeSizes = [2, 15, 10, 8, 4]
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

function updateSnow() {
  const time = Date.now() * 0.00005
  scene.children.forEach((child, i) => {
    if (child instanceof THREE.Points) {
      child.translateY(-3)
      child.rotation.y = time * (i < 4 ? i + 1 : - (i + 1))
      if (child.position.y < 200)
        child.position.y = Math.random() * 300 + 200
    }
  })
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  updateSnow()
  player.update(delta)
  renderer.render(scene, camera)
  smallMapRenderer.render(player, map)
  fpsRenderer.render(time)
}()
