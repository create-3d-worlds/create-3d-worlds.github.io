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

    cameraClass = '',
    rotate = true,
  }) {
    this.mesh = mesh
    this.camera = camera
    this.rotate = rotate

    this.initialSpeed = this.speed = speed
    this.thirdPersonOffset = this.offset = offset
    this.thirdPersonLookAt = this.lookAt = lookAt

    this.birdsEyeOffset = birdsEyeOffset
    this.birdsEyeLookAt = birdsEyeLookAt
    this.orbitalOffset = orbitalOffset

    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()
    this.cameraIndex = Number(localStorage.getItem('cameraIndex'))
    this.setCamera(this.cameraIndex)

    this.camera.position.copy(calc(mesh, offset, rotate))
    this.camera.lookAt(calc(mesh, lookAt, rotate))

    this.addButton(cameraClass)
  }

  /* SETTERS */

  set height(y) {
    this.offset[1] = y
  }

  set distance(z) {
    this.offset[2] = z
  }

  set near(x) {
    this.camera.near = x
    this.camera.updateProjectionMatrix()
  }

  set far(x) {
    this.camera.far = x
    this.camera.updateProjectionMatrix()
  }

  /* UTILS */

  addButton(cameraClass) {
    const button = document.createElement('button')
    button.className = `change-camera ${cameraClass}`
    const img = document.createElement('img')
    img.src = '/assets/images/change-camera.png'
    img.alt = 'change camera'

    button.addEventListener('click', this.toggleCamera)
    button.appendChild(img)
    document.body.appendChild(button)
  }

  alignCamera() {
    this.currentPosition = calc(this.mesh, this.offset, this.rotate)
    this.currentLookAt = calc(this.mesh, this.lookAt, this.rotate)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookAt)
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
      case THIRD_PERSON: return this.initialSpeed
      case BIRDS_EYE: return this.initialSpeed * .75
      case ORBITAL: return this.initialSpeed * .25
      default: return this.initialSpeed
    }
  }

  setCamera(i) {
    const cameraStyle = cameraStyles[i]
    this.offset = this.getOffset(cameraStyle)
    this.lookAt = this.getLookAt(cameraStyle)
    this.speed = this.getSpeed(cameraStyle)
  }

  toggleCamera = () => {
    const i = (Number(localStorage.getItem('cameraIndex')) + 1) % cameraStyles.length
    this.setCamera(i)
    localStorage.setItem('cameraIndex', i)
  }

  zoomIn(ms = 1000) {
    this.setCamera(2)
    setTimeout(() => this.setCamera(0), ms)
  }

  /* UPDATE */

  update(delta, stateName) {
    this.currentPosition.copy(this.camera.position)

    const idealPosition = calc(this.mesh, this.offset, this.rotate)
    const idealLookAt = calc(this.mesh, this.lookAt, this.rotate)

    const deltaSpeed = delta * this.speed * speedFactor(stateName)
    this.currentPosition.lerp(idealPosition, deltaSpeed)
    this.currentLookAt.lerp(idealLookAt, deltaSpeed)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookAt)
  }
}
