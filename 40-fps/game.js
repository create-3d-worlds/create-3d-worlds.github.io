/* global THREEx */
const keyboard = new THREEx.KeyboardState()
const clock = new THREE.Clock()
const scene = new THREE.Scene()

const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(camera)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 250, 0)
scene.add(light)

const floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide })
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

// //////////
// CUSTOM //
// //////////

// create an array with six textures for a cool cube
const materialArray = []
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/xpos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/xneg.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/ypos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/yneg.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/zpos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/zneg.png') }))
const cubeMat = new THREE.MeshFaceMaterial(materialArray)
const cubeGeom = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1, materialArray)
const cube = new THREE.Mesh(cubeGeom, cubeMat)
cube.position.set(0, 25.1, 0)
scene.add(cube)

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta   // pi/2 radians (90 degrees) per second

  // local transformations

  // move forwards/backwards/left/right
  if (keyboard.pressed('W'))
    cube.translateZ(-moveDistance)
  if (keyboard.pressed('S'))
    cube.translateZ(moveDistance)
  if (keyboard.pressed('Q'))
    cube.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    cube.translateX(moveDistance)

  // rotate left/right/up/down
  if (keyboard.pressed('A'))
    cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed('D'))
    cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed('R'))
    cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed('F'))
    cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('Z')) {
    cube.position.set(0, 25.1, 0)
    cube.rotation.set(0, 0, 0)
  }

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(cube.position)
}

function render() {
  renderer.render(scene, camera)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  render()
  update()
}()
