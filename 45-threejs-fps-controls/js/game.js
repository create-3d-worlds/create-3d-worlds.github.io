/* global ScreenOverlay */
// https://jamesmilneruk.github.io/threejs-fps-controls/

let camera, scene, renderer
let geometry
let controls
const boxes = []
const objects = []

const fog = 100

function handleKeyInteraction(keyCode, isKeyDown) {
  switch (keyCode) {
    case 87: // w
      controls.movements.forward = isKeyDown
      break
    case 83: // s
      controls.movements.backward = isKeyDown
      break
    case 65: // a
      controls.movements.left = isKeyDown
      break
    case 68: // d
      controls.movements.right = isKeyDown
      break
    case 32: // space
      if (!isKeyDown)
        controls.jump()
      break
    case 16: // shift
      controls.walk(isKeyDown)
      break
    case 67: // crouch (CTRL + W etc destroys tab in Chrome!)
      controls.crouch(isKeyDown)
  }
}

function addEevents() {
  const handleKeyDown = function(event) {
    event.preventDefault()
    handleKeyInteraction(event.keyCode, true)
  }
  const handleKeyUp = function(event) {
    event.preventDefault()
    handleKeyInteraction(event.keyCode, false)
  }
  document.addEventListener('keydown', handleKeyDown, false)
  document.addEventListener('keyup', handleKeyUp, false)
}

function init() {
  addEevents()
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xffffff, 0, fog + 1000)

  const sky = new THREE.SphereGeometry(8000, 32, 32) // radius, widthSegments, heightSegments

  const skyBox = new THREE.Mesh(sky)
  skyBox.scale.set(-1, 1, 1)
  skyBox.eulerOrder = 'XZY'
  skyBox.renderDepth = 1000.0
  scene.add(skyBox)

  const floorHeight = 7000
  geometry = new THREE.SphereGeometry(floorHeight, 10, 6, 0, (Math.PI * 2), 0, 0.8)
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -floorHeight, 0))
  const material = new THREE.MeshLambertMaterial()
  const floorMesh = new THREE.Mesh(geometry, material)
  objects.push(floorMesh)
  scene.add(floorMesh)

  // Boxes
  const boxGeometry = new THREE.BoxGeometry(20, 20, 20)
  const boxTexture1 = new THREE.ImageUtils.loadTexture('img/block1.jpg')
  const boxTexture2 = new THREE.ImageUtils.loadTexture('img/block2.jpg')
  const boxTexture3 = new THREE.ImageUtils.loadTexture('img/block3.jpg')
  const boxTexture4 = new THREE.ImageUtils.loadTexture('img/block4.jpg')
  const boxMaterial1 = new THREE.MeshBasicMaterial({ map: boxTexture1, reflectivity: 0.8 })
  const boxMaterial2 = new THREE.MeshBasicMaterial({ map: boxTexture2, reflectivity: 0.8 })
  const boxMaterial3 = new THREE.MeshBasicMaterial({ map: boxTexture3, reflectivity: 0.8 })
  const boxMaterial4 = new THREE.MeshBasicMaterial({ map: boxTexture4, reflectivity: 0.8 })
  const items = [boxMaterial1, boxMaterial2, boxMaterial3, boxMaterial4]
  let boxZ

  for (let i = 0; i < 850; i++) {
    const boxmesh = new THREE.Mesh(boxGeometry, items[Math.floor(Math.random() * items.length)])
    boxZ = 50
    boxmesh.position.x = Math.floor(Math.random() * 20 - 10) * 20
    boxmesh.position.y = Math.floor(Math.random() * 20) * boxZ + 10
    boxmesh.position.z = Math.floor(Math.random() * 20 - 10) * 20
    boxes.push(boxmesh)
    objects.push(boxmesh)
    scene.add(boxmesh)
  }

  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 9000)
  controls = new THREE.PointerLockControls(camera, 100, 30, true, objects)
  scene.add(controls.getPlayer())

  renderer = new THREE.WebGLRenderer({ antialias: true }) // new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  ScreenOverlay(controls) //
  document.body.appendChild(renderer.domElement)
}

init()

void function animate() {
  requestAnimationFrame(animate)
  if (controls.enabled)
    controls.updateControls()
  renderer.render(scene, camera)
}()
