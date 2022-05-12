import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/assets/textures/snowflake.png')

const createFlakes = (size, flakesNum) => {
  const vertices = []
  const geometry = new THREE.BufferGeometry()
  for (let i = 0; i < flakesNum; i++) {
    const x = randomInRange(-size, size)
    const y = randomInRange(-size, size)
    const z = randomInRange(-size, size)
    vertices.push(x, y, z)
  }
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  const material = new THREE.PointsMaterial({
    size: randomInRange(5, 15),
    map: texture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  })
  return new THREE.Points(geometry, material)
}

/* Creates several layers of snow (to prevent glitch effect), each with the number of flakes */
export default class Snow {
  constructor({ size = 1000, flakesNum = 10000, speed = 3, layers = 4 } = {}) {
    this.size = size
    this.speed = speed
    this.layers = Array(layers).fill().map(() => createFlakes(size, flakesNum))
  }

  update() {
    const time = Date.now() * 0.00005
    this.layers.forEach(flakes => {
      flakes.translateY(-randomInRange(this.speed * .5, this.speed * 2))
      flakes.rotation.y = time * 4
      if (flakes.position.y < 0) flakes.position.y = randomInRange(200, 500)
    })
  }
}
