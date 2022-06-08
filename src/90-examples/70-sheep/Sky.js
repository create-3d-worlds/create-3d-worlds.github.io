import * as THREE from '/node_modules/three127/build/three.module.js'

const colors = [0xFFFFFF, 0xEFD2DA, 0xC1EDED, 0xCCC9DE, 0xDDD7FE]

export default class Sky {
  constructor() {
    this.drawSky()
  }

  drawSky() {
    this.group = new THREE.Group()
    for (let i = 0; i < 30; i ++) {
      const geometry = new THREE.IcosahedronGeometry(0.4, 0)
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 1,
        flatShading: true
      })
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set((Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30)
      this.group.add(mesh)
    }
  }

  moveSky() {
    this.group.rotation.x += 0.001
    this.group.rotation.y -= 0.004
  }
}
