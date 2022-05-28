/* global THREE */

export default class DirectionalLight extends THREE.DirectionalLight {
  constructor(color, percent) {
    super(color, percent)
    this.position.set(150, 350, 350)
    this.castShadow = true
    // define the visible area of the projected shadow
    this.shadow.camera.left = -400
    this.shadow.camera.right = 400
    this.shadow.camera.top = 400
    this.shadow.camera.bottom = -400
    this.shadow.camera.near = 1
    this.shadow.camera.far = 1000
    // shadow resolution
    this.shadow.mapSize.width = 2048
    this.shadow.mapSize.height = 2048
  }
}
