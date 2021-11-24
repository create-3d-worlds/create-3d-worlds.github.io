import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export default class Snow {
  constructor(size = 1000) {
    this.size = size
    this.init(size)
  }

  init(size, flakesNum = size * 100) {
    const vertices = []
    const geometry = new THREE.BufferGeometry()
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/assets/textures/snowflake.png')

    for (let i = 0; i < flakesNum; i++) {
      const x = randomInRange(-size, size)
      const y = randomInRange(-size, size)
      const z = randomInRange(-size, size)
      vertices.push(x, y, z)
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const material = new THREE.PointsMaterial({
      size: 8,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    })
    this.flakes = new THREE.Points(geometry, material)
  }

  update() {
    const time = Date.now() * 0.00005
    this.flakes.translateY(-3)
    this.flakes.rotation.y = time * 4
    if (this.flakes.position.y < 0)
      this.flakes.position.y = randomInRange(200, 500)
  }
}
