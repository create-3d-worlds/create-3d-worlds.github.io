/* credit to simon dev */
import * as THREE from 'three'

const calc = (mesh, pos) => new THREE.Vector3(...pos)
  .applyQuaternion(mesh.quaternion)
  .add(mesh.position)

const speedFactor = state => {
  if (state == 'fall') return 4
  if (state == 'run') return 2
  return 1
}

export default class CameraFollow {
  constructor({ camera, mesh, height = 2, speed = 2,
    offset = [0, height * .95, height * 1.5],
    lookAt = [0, height * .95, 0],
    aerialOffset = [0, height * 8, -height * 2.75],
    aerialLookAt = [0, 0, -height * 3],
  }) {
    this.mesh = mesh
    this.camera = camera
    this.speed = speed
    this.offset = offset
    this.lookAt = lookAt
    this.aerialOffset = aerialOffset
    this.aerialLookAt = aerialLookAt
    this.currentPosition = new THREE.Vector3()
    this.currentLookat = new THREE.Vector3()
    this.initialOffset = offset
    this.initialLookAt = lookAt
    this.initialSpeed = speed
    this.aerial = false

    this.camera.position.copy(calc(mesh, offset))
    this.camera.lookAt(calc(mesh, lookAt))

    this.addButton()
  }

  set distance(x) {
    this.offset[2] = x
  }

  set height(x) {
    this.aerialOffset[1] = x
  }

  set near(x) {
    this.camera.near = x
    this.camera.updateProjectionMatrix()
  }

  alignCamera() {
    this.currentPosition = calc(this.mesh, this.offset)
    this.currentLookat = calc(this.mesh, this.lookAt)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookat)
  }

  addButton() {
    const style = `
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    user-select: none;
  `
    const button = document.createElement('button')
    button.setAttribute('id', 'change-camera')
    button.style.cssText = style

    const image = document.createElement('img')
    image.setAttribute('src', '/assets/images/change-camera.png')
    image.setAttribute('alt', 'change camera')
    button.appendChild(image)

    button.addEventListener('click', () => this.toggleCamera())
    document.body.appendChild(button)
  }

  toggleCamera() {
    this.aerial = !this.aerial
    this.offset = this.aerial ? this.aerialOffset : this.initialOffset
    this.lookAt = this.aerial ? this.aerialLookAt : this.initialLookAt
    this.speed = this.aerial ? this.initialSpeed * .75 : this.initialSpeed
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
