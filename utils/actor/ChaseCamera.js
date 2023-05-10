/* credit to simon dev */
import * as THREE from 'three'

const calc = (mesh, pos, rotate) => {
  const cameraPos = new THREE.Vector3(...pos)
  if (rotate) cameraPos.applyQuaternion(mesh.quaternion)
  cameraPos.add(mesh.position)
  return cameraPos
}

const speedFactor = state => {
  if (state == 'fall') return 4
  if (state == 'run') return 2
  return 1
}

const THIRD_PERSON = 'THIRD_PERSON', BIRDS_EYE = 'BIRDS_EYE', ORBITAL = 'ORBITAL'
const cameraStyles = [THIRD_PERSON, BIRDS_EYE, ORBITAL]

export default class ChaseCamera {
  constructor({ camera, mesh, height = 2, speed = 2,
    offset = [0, height * .95, height * 1.5],
    lookAt = [0, height * .95, 0],

    birdsEyeOffset = [0, height * 8, -height * 2.75],
    birdsEyeLookAt = [0, 0, -height * 3],
    orbitalOffset = [-height * 10, height * 10, height * 10],

    rotate = true,
  }) {
    this.mesh = mesh
    this.camera = camera
    this.rotate = rotate

    this.thirdPersonSpeed = this.speed = speed
    this.thirdPersonOffset = this.offset = offset
    this.thirdPersonLookAt = this.lookAt = lookAt

    this.birdsEyeOffset = birdsEyeOffset
    this.birdsEyeLookAt = birdsEyeLookAt
    this.orbitalOffset = orbitalOffset

    this.currentPosition = new THREE.Vector3()
    this.currentLookat = new THREE.Vector3()
    this.cameraIndex = 0

    this.camera.position.copy(calc(mesh, offset, rotate))
    this.camera.lookAt(calc(mesh, lookAt, rotate))

    this.addButton()
  }

  set distance(x) {
    this.offset[2] = x
  }

  set near(x) {
    this.camera.near = x
    this.camera.updateProjectionMatrix()
  }

  set far(x) {
    this.camera.far = x
    this.camera.updateProjectionMatrix()
  }

  alignCamera() {
    this.currentPosition = calc(this.mesh, this.offset, this.rotate)
    this.currentLookat = calc(this.mesh, this.lookAt, this.rotate)

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

  getOffset(cameraStyle) {
    switch (cameraStyle) {
      case THIRD_PERSON: return this.thirdPersonOffset
      case BIRDS_EYE: return this.birdsEyeOffset
      case ORBITAL: return this.orbitalOffset
      default: return this.thirdPersonOffset
    }
  }

  getLookAt(cameraStyle) {
    switch (cameraStyle) {
      case THIRD_PERSON: return this.thirdPersonLookAt
      case BIRDS_EYE: return this.birdsEyeLookAt
      case ORBITAL: return this.birdsEyeLookAt
      default: return this.thirdPersonLookAt
    }
  }

  getSpeed(cameraStyle) {
    switch (cameraStyle) {
      case THIRD_PERSON: return this.thirdPersonSpeed
      case BIRDS_EYE: return this.thirdPersonSpeed * .75
      case ORBITAL: return this.thirdPersonSpeed * .25
      default: return this.thirdPersonSpeed
    }
  }

  toggleCamera() {
    const cameraStyle = cameraStyles[++this.cameraIndex % cameraStyles.length]
    this.offset = this.getOffset(cameraStyle)
    this.lookAt = this.getLookAt(cameraStyle)
    this.speed = this.getSpeed(cameraStyle)
  }

  update(delta, stateName) {
    this.currentPosition.copy(this.camera.position)

    const idealPosition = calc(this.mesh, this.offset, this.rotate)
    const idealLookAt = calc(this.mesh, this.lookAt, this.rotate)

    const deltaSpeed = delta * this.speed * speedFactor(stateName)
    this.currentPosition.lerp(idealPosition, deltaSpeed)
    this.currentLookat.lerp(idealLookAt, deltaSpeed)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookat)
  }
}
