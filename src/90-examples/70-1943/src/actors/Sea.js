import * as THREE from '/node_modules/three119/build/three.module.js'

const radius = 3000

const COLOR_SEA_LEVEL = [
  0x68c3c0,  // hsl(178deg 43% 59%)
  0x47b3af,  // hsl(178deg 43% 49%)
  0x398e8b,  // hsl(178deg 43% 39%)
  0x2a6a68,  // hsl(178deg 43% 29%)
  0x1c4544,  // hsl(178deg 43% 19%)
  0x0d2120,  // hsl(178deg 43% 09%)
]

class Sea {
  constructor() {
    const geometry = new THREE.CylinderGeometry(radius, radius, 4000, 200, 50)
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    this.waves = []
    const arr = geometry.attributes.position.array
    for (let i = 0; i < arr.length / 3; i++)
      this.waves.push({
        x: arr[i * 3 + 0],
        y: arr[i * 3 + 1],
        z: arr[i * 3 + 2],
        ang: Math.random() * Math.PI * 2,
        amp: 5 + Math.random() * 15,
        speed: 0.016 + Math.random() * 0.032
      })

    const material = new THREE.MeshPhongMaterial({
      color: COLOR_SEA_LEVEL[0],
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.receiveShadow = true
  }

  tick(deltaTime) {
    const arr = this.mesh.geometry.attributes.position.array
    for (let i = 0; i < arr.length / 3; i++) {
      const wave = this.waves[i]
      arr[i * 3 + 0] = wave.x + Math.cos(wave.ang) * wave.amp
      arr[i * 3 + 1] = wave.y + Math.sin(wave.ang) * wave.amp
      wave.ang += wave.speed * deltaTime
    }
    this.mesh.geometry.attributes.position.needsUpdate = true
  }
}

export default Sea