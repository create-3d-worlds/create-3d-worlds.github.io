import * as THREE from '/node_modules/three108/build/three.module.js'
import Aircraft from './Aircraft.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = 0.01

export default class Zeppelin extends Aircraft {
  constructor(callback, params) {
    super(mesh => {
      mesh.rotation.order = 'YZX' // default is 'ZYX'
      callback(mesh)
    }, { ...params, file: 'santos-dumont-9/model.dae' })
    this.solids = []
    this.groundY = 0
  }

  prepareModel(model) {
    model.rotateZ(Math.PI / 2)
    model.translateX(75)
    model.translateZ(40)
    super.prepareModel(model)
  }

  up() {
    this.mesh.translateY(1)
    if (this.mesh.rotation.x < .1)
      this.mesh.rotateX(.005)
  }

  down() {
    this.mesh.translateY(-1)
    if (this.mesh.rotation.x > -.1)
      this.mesh.rotateX(-.005)
  }

  left() {
    this.yaw(angleSpeed)
  }

  right() {
    this.yaw(-angleSpeed)
  }

  // TODO: reuse methods
  /**
   * Add solid objects for player to collide
   * @param {any} solids mesh group, array or a single mesh
   */
  addSolids(...solids) {
    solids.forEach(solid => {
      if (solid.children && solid.children.length) this.solids.push(...solid.children)
      else if (solid.length) this.solids.push(...solid)
      else this.solids.push(solid)
    })
  }

  /**
   * Update ground level
   */
  findGround() {
    if (!this.mesh || !this.solids.length) return
    const pos = this.mesh.position.clone()
    const raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObjects(this.solids)
    this.groundY = intersects[0] ? intersects[0].point.y : 0
  }

  // https://www.youtube.com/watch?v=lcE3s5noEE4
  // https://www.youtube.com/watch?v=Ocoibc7MoKg
  stabilize() {
    // TODO: automatski podizati ako je preblizu zemlje, na dugme sletati
    // https://threejs.org/docs/#api/en/core/Raycaster

    if (keyboard.keyPressed) return console.log(this.groundY)

    if (this.mesh.rotation.x > 0)
      this.mesh.rotateX(-.005)
    if (this.mesh.rotation.x < 0)
      this.mesh.rotateX(.005)

    if (this.mesh.rotation.z > 0)
      this.mesh.rotateZ(-.005)
    if (this.mesh.rotation.z < 0)
      this.mesh.rotateZ(.005)
  }

  update() {
    if (!this.mesh) return
    super.update()
    this.stabilize()
    this.findGround()
  }

}
