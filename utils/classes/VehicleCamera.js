import * as THREE from 'three'

export default class VehicleCamera {
  constructor({
    camera,
    offsetCamera = [0, 3, -9],
    lookatCamera = [0, 2, 4],
    tweenOffset = 0.1,
    tweenLookAt = 0.1
  } = {}) {
    this.camera = camera
    this.offsetCamera = new THREE.Vector3(...offsetCamera)
    this.lookatCamera = new THREE.Vector3(...lookatCamera)
    this.tweenOffset = tweenOffset
    this.tweenLookAt = tweenLookAt

    this._currentOffset = null
    this._currentLookat = null
  }

  update(mesh) {
    const offsetCamera = this.offsetCamera.clone()
    mesh.localToWorld(offsetCamera)

    if (this._currentOffset === null)
      this._currentOffset = offsetCamera.clone()
    else
      this._currentOffset.multiplyScalar(1 - this.tweenOffset)
        .add(offsetCamera.clone().multiplyScalar(this.tweenOffset))

    this.camera.position.copy(this._currentOffset)

    const lookatCamera = this.lookatCamera.clone()
    mesh.localToWorld(lookatCamera)

    if (this._currentLookat === null)
      this._currentLookat = lookatCamera.clone()
    else
      this._currentLookat.multiplyScalar(1 - this.tweenLookAt)
        .add(lookatCamera.clone().multiplyScalar(this.tweenLookAt))

    this.camera.lookAt(this._currentLookat)
  }
}
