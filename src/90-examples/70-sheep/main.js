'use strict'

let scene,
  camera,
  renderer,
  controls,
  mouseDown,
  world,
  night = false

let sheep,
  cloud,
  sky

let width,
  height

function init() {
  width = window.innerWidth,
  height = window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.lookAt(scene.position)
  camera.position.set(0, 0.7, 8)

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.enableZoom = false;

  addLights()
  drawSheep()
  drawCloud()
  drawSky()

  world = document.querySelector('.world')
  world.appendChild(renderer.domElement)

  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('touchstart', onTouchStart)
  document.addEventListener('touchend', onTouchEnd)
}

function addLights() {
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9)
  scene.add(light)

  const directLight1 = new THREE.DirectionalLight(0xffd798, 0.8)
  directLight1.castShadow = true
  directLight1.position.set(9.5, 8.2, 8.3)
  scene.add(directLight1)

  const directLight2 = new THREE.DirectionalLight(0xc9ceff, 0.5)
  directLight2.castShadow = true
  directLight2.position.set(-15.8, 5.2, 8)
  scene.add(directLight2)
}

function drawSheep() {
  sheep = new Sheep()
  scene.add(sheep.group)
}

function drawCloud() {
  cloud = new Cloud()
  scene.add(cloud.group)
}

function drawSky() {
  sky = new Sky()
  sky.showNightSky(night)
  scene.add(sky.group)
}

function onMouseDown(event) {
  mouseDown = true
}
function onTouchStart(event) {
  event.preventDefault()
  mouseDown = true
}

function onMouseUp() {
  mouseDown = false
}
function onTouchEnd(event) {
  event.preventDefault()
  mouseDown = false
}

function rad(degrees) {
  return degrees * (Math.PI / 180)
}

function animate() {
  requestAnimationFrame(animate)

  render()
}

function render() {

  sheep.jumpOnMouseDown()
  if (sheep.group.position.y > 0.4) cloud.bend()

  sky.moveSky()

  renderer.render(scene, camera)
}

class Sheep {
  constructor() {
    this.group = new THREE.Group()
    this.group.position.y = 0.4

    this.woolMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    })
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaf8b,
      roughness: 1,
      shading: THREE.FlatShading
    })
    this.darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b4553,
      roughness: 1,
      shading: THREE.FlatShading
    })

    this.vAngle = 0

    this.drawBody()
    this.drawHead()
    this.drawLegs()
  }
  drawBody() {
    const bodyGeometry = new THREE.IcosahedronGeometry(1.7, 0)
    const body = new THREE.Mesh(bodyGeometry, this.woolMaterial)
    body.castShadow = true
    body.receiveShadow = true
    this.group.add(body)
  }
  drawHead() {
    const head = new THREE.Group()
    head.position.set(0, 0.65, 1.6)
    head.rotation.x = rad(-20)
    this.group.add(head)

    const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7)
    const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial)
    forehead.castShadow = true
    forehead.receiveShadow = true
    forehead.position.y = -0.15
    head.add(forehead)

    const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1)
    const face = new THREE.Mesh(faceGeometry, this.skinMaterial)
    face.castShadow = true
    face.receiveShadow = true
    face.position.y = -0.65
    face.rotation.y = rad(45)
    head.add(face)

    const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9)
    const wool = new THREE.Mesh(woolGeometry, this.woolMaterial)
    wool.position.set(0, 0.12, 0.07)
    wool.rotation.x = rad(20)
    head.add(wool)

    const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6)
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial)
    rightEye.castShadow = true
    rightEye.receiveShadow = true
    rightEye.position.set(0.35, -0.48, 0.33)
    rightEye.rotation.set(rad(130.8), 0, rad(-45))
    head.add(rightEye)

    const leftEye = rightEye.clone()
    leftEye.position.x = -rightEye.position.x
    leftEye.rotation.z = -rightEye.rotation.z
    head.add(leftEye)

    const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3)
    rightEarGeometry.translate(0, -0.25, 0)
    this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial)
    this.rightEar.castShadow = true
    this.rightEar.receiveShadow = true
    this.rightEar.position.set(0.35, -0.12, -0.07)
    this.rightEar.rotation.set(rad(20), 0, rad(50))
    head.add(this.rightEar)

    this.leftEar = this.rightEar.clone()
    this.leftEar.position.x = -this.rightEar.position.x
    this.leftEar.rotation.z = -this.rightEar.rotation.z
    head.add(this.leftEar)
  }
  drawLegs() {
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4)
    legGeometry.translate(0, -0.5, 0)
    this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial)
    this.frontRightLeg.castShadow = true
    this.frontRightLeg.receiveShadow = true
    this.frontRightLeg.position.set(0.7, -0.8, 0.5)
    this.frontRightLeg.rotation.x = rad(-12)
    this.group.add(this.frontRightLeg)

    this.frontLeftLeg = this.frontRightLeg.clone()
    this.frontLeftLeg.position.x = -this.frontRightLeg.position.x
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z
    this.group.add(this.frontLeftLeg)

    this.backRightLeg = this.frontRightLeg.clone()
    this.backRightLeg.position.z = -this.frontRightLeg.position.z
    this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x
    this.group.add(this.backRightLeg)

    this.backLeftLeg = this.frontLeftLeg.clone()
    this.backLeftLeg.position.z = -this.frontLeftLeg.position.z
    this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x
    this.group.add(this.backLeftLeg)
  }
  jump(speed) {
    this.vAngle += speed
    this.group.position.y = Math.sin(this.vAngle) + 1.38

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4

    this.frontRightLeg.rotation.z = legRotation
    this.backRightLeg.rotation.z = legRotation
    this.frontLeftLeg.rotation.z = -legRotation
    this.backLeftLeg.rotation.z = -legRotation

    const earRotation = Math.sin(this.vAngle) * Math.PI / 3 + 1.5

    this.rightEar.rotation.z = earRotation
    this.leftEar.rotation.z = -earRotation
  }
  jumpOnMouseDown() {
    if (mouseDown)
      this.jump(0.05)
    else {
      if (this.group.position.y <= 0.4) return
      this.jump(0.08)
    }
  }
}

class Cloud {
  constructor() {
    this.group = new THREE.Group()
    this.group.position.y = -2
    this.group.scale.set(1.5, 1.5, 1.5)

    this.material = new THREE.MeshStandardMaterial({
      color: 0xacb3fb,
      roughness: 1,
      shading: THREE.FlatShading
    })

    this.vAngle = 0

    this.drawParts()

    this.group.traverse(part => {
      part.castShadow = true
      part.receiveShadow = true
    })
  }
  drawParts() {
    const partGeometry = new THREE.IcosahedronGeometry(1, 0)
    this.upperPart = new THREE.Mesh(partGeometry, this.material)
    this.group.add(this.upperPart)

    this.leftPart = this.upperPart.clone()
    this.leftPart.position.set(-1.2, -0.3, 0)
    this.leftPart.scale.set(0.8, 0.8, 0.8)
    this.group.add(this.leftPart)

    this.rightPart = this.leftPart.clone()
    this.rightPart.position.x = -this.leftPart.position.x
    this.group.add(this.rightPart)

    this.frontPart = this.leftPart.clone()
    this.frontPart.position.set(0, -0.4, 0.9)
    this.frontPart.scale.set(0.7, 0.7, 0.7)
    this.group.add(this.frontPart)

    this.backPart = this.frontPart.clone()
    this.backPart.position.z = -this.frontPart.position.z
    this.group.add(this.backPart)
  }
  bend() {
    this.vAngle += 0.08

    this.upperPart.position.y = -Math.cos(this.vAngle) * 0.12
    this.leftPart.position.y = -Math.cos(this.vAngle) * 0.1 - 0.3
    this.rightPart.position.y = -Math.cos(this.vAngle) * 0.1 - 0.3
    this.frontPart.position.y = -Math.cos(this.vAngle) * 0.08 - 0.3
    this.backPart.position.y = -Math.cos(this.vAngle) * 0.08 - 0.3
  }
}

class Sky {
  constructor() {
    this.group = new THREE.Group()

    this.daySky = new THREE.Group()
    this.nightSky = new THREE.Group()

    this.group.add(this.daySky)
    this.group.add(this.nightSky)

    this.colors = {
      day: [0xFFFFFF, 0xEFD2DA, 0xC1EDED, 0xCCC9DE],
      night: [0x5DC7B5, 0xF8007E, 0xFFC363, 0xCDAAFD, 0xDDD7FE],
    }

    this.drawSky('day')
    this.drawSky('night')
    this.drawNightLights()
  }
  drawSky(phase) {
    for (let i = 0; i < 30; i ++) {
      const geometry = new THREE.IcosahedronGeometry(0.4, 0)
      const material = new THREE.MeshStandardMaterial({
        color: this.colors[phase][Math.floor(Math.random() * this.colors[phase].length)],
        roughness: 1,
        shading: THREE.FlatShading
      })
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set((Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30)
      if (phase === 'day')
        this.daySky.add(mesh)
      else
        this.nightSky.add(mesh)

    }
  }
  drawNightLights() {
    const geometry = new THREE.SphereGeometry(0.1, 5, 5)
    const material = new THREE.MeshStandardMaterial({
      color: 0xFF51B6,
      roughness: 1,
      shading: THREE.FlatShading
    })

    for (let i = 0; i < 3; i ++) {
      const light = new THREE.PointLight(0xF55889, 2, 30)
      const mesh = new THREE.Mesh(geometry, material)
      light.add(mesh)

      light.position.set((Math.random() - 2) * 6,
        (Math.random() - 2) * 6,
        (Math.random() - 2) * 6)
      light.updateMatrix()
      light.matrixAutoUpdate = false

      this.nightSky.add(light)
    }
  }
  showNightSky(condition) {
    if (condition) {
      this.daySky.position.set(100, 100, 100)
      this.nightSky.position.set(0, 0, 0)
    } else {
      this.daySky.position.set(0, 0, 0)
      this.nightSky.position.set(100, 100, 100)
    }
  }
  moveSky() {
    this.group.rotation.x += 0.001
    this.group.rotation.y -= 0.004
  }
}

init()
animate()