/* credit to simon dev */
import * as THREE from 'three'

const calc = (mesh, pos) => new THREE.Vector3(...pos)
  .applyQuaternion(mesh.quaternion)
  .add(mesh.position)

const speedFactor = state => {
  if (state == 'fall') return 2
  if (state == 'run') return 1.5
  // if (state == 'jump') return 1.25
  return 1
}

export default class CameraFollow {
  constructor({ camera, mesh, height = 2, speed = 2,
    offset = [0, height * .95, height * 1.5],
    lookAt = [0, height * .95, 0],
    aerial = [0, height * 10, 0],
  }) {
    this.mesh = mesh
    this.camera = camera
    this.offset = offset
    this.lookAt = lookAt
    this.speed = speed
    this.aerial = aerial
    this.currentPosition = new THREE.Vector3()
    this.currentLookat = new THREE.Vector3()

    this.camera.position.copy(calc(mesh, offset))
    this.camera.lookAt(calc(mesh, lookAt))

    // this.camera.near = .5
    // this.camera.updateProjectionMatrix()
  }

  set distance(x) {
    this.offset[2] = x
  }

  alignCamera() {
    this.currentPosition = calc(this.mesh, this.offset)
    this.currentLookat = calc(this.mesh, this.lookAt)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookat)
  }

  update(delta, stateName) {
    this.currentPosition.copy(this.camera.position)

    const idealPosition = calc(this.mesh, this.offset)
    const idealLookAt = calc(this.mesh, this.lookAt)

    const t = this.speed * delta * speedFactor(stateName)
    this.currentPosition.lerp(idealPosition, t)
    this.currentLookat.lerp(idealLookAt, t)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookat)
  }
}
