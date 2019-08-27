import {clock} from '../utils/scene.js'

/**
 * Model class has methods for animations and `mesh` property for scene
 */
export default class Stoneman {
  constructor(size, stoneSkin = true) {
    this.size = size
    this.mesh = this.createMesh(stoneSkin)
  }

  createMesh(stoneSkin) {
    const group = new THREE.Group()
    const Material = stoneSkin ? THREE.MeshStandardMaterial : THREE.MeshNormalMaterial
    const material = new Material()
    if (stoneSkin) material.map = new THREE.TextureLoader().load('../assets/textures/snow-512.jpg')
    const bodyGeo = new THREE.DodecahedronGeometry(this.size * .66)
    const body = new THREE.Mesh(bodyGeo, material)
    body.position.set(0, this.size, 0)
    group.add(body)

    const limbGeo = bodyGeo.clone().scale(.6, .6, .6)
    this.rightHand = new THREE.Mesh(limbGeo, material)
    this.rightHand.position.set(-this.size, this.size, 0)
    group.add(this.rightHand)

    this.leftHand = new THREE.Mesh(limbGeo, material)
    this.leftHand.position.set(this.size, this.size, 0)
    group.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(limbGeo, material)
    this.rightLeg.position.set(this.size / 2, this.size * .3, 0)
    group.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(limbGeo, material)
    this.leftLeg.position.set(-this.size / 2, this.size * .3, 0)
    group.add(this.leftLeg)
    return group
  }

  idle() {
    this.leftHand.position.z = this.leftLeg.position.z = 0
    this.rightHand.position.z = this.rightLeg.position.z = 0
  }

  jump() {
    this.leftHand.position.z = this.rightHand.position.z = this.leftLeg.position.z = this.rightLeg.position.z = this.size * .3
  }

  walk() {
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * this.size * .666
    this.leftHand.position.z = this.leftLeg.position.z = -elapsed
    this.rightHand.position.z = this.rightLeg.position.z = elapsed
  }
}
