/* global CANNON, THREE */
import keyboard from '/classes/Keyboard.js'
let camera, camera2, activeCamera, orthographicCamera, scene, renderer

let world, physicsMaterial, timeStep = 1 / 60
const stonesBody = [], stonesMesh = [], catapultsBody = [], catapultsMesh = []
const standsBody = [], standsMesh = [], collidables = []
let mainStandBody, mainStandSize
let userShootVelocity = 4
let level
let attackSet
const xPositions = [-46, -40, -28, -18, -5]
let catapultModel
let endInterval, collisonInterval

const gltfloader = new THREE.GLTFLoader()

// window variables
window.addEventListener('keyup', e => {
  if (e.keyCode == 65)
    throwStone(catapultsBody[0], new THREE.Vector3(1, 1, 0), userShootVelocity, 'user')

  if (e.keyCode == 67)
    if (activeCamera === camera)
      activeCamera = camera2
    else
      activeCamera = camera

  const loading = document.getElementById('loading').innerHTML
  if (e.keyCode == 32 && loading === 'ready to go !') {
    clearInterval(endInterval)
    clearInterval(collisonInterval)
    level = parseInt(prompt('Please enter hardship level you want \n choose between 1 to 4', 1))
    if (level > 4)
      level = 4

    positioningEnemies(level)
    activeCamera = camera
    document.getElementById('instruction').style.display = 'none'
    document.getElementById('game').style.display = 'none'
    document.getElementById('game').innerHTML = ''

    endInterval = setInterval(() => {
      if (catapultsMesh[0].parent == null)
        gameOver()

      let check = 0
      for (let i = 1; i < level + 1; i++)
        if (catapultsMesh[i].parent == scene)
          check++

      if (check === 0)
        victory()
    }, 5000)
    collisonInterval = setInterval(() => {
      for (let i = 0; i < stonesMesh.length; i++)
        checkCollison(stonesMesh[i], collidables)
    }, 130)
  }
})

gltfloader.load('models/catapult2/scene.gltf', createCatapults)
gltfloader.load('models/tower1/scene.gltf', createTower)

initCannon()
init()
update()

function initCannon() {

  // Setup our world
  world = new CANNON.World()
  world.quatNormalizeSkip = 0
  world.quatNormalizeFast = false
  const solver = new CANNON.GSSolver()
  solver.iterations = 10
  solver.tolerance = 0.1
  world.defaultContactMaterial.contactEquationStiffness = 1e8
  world.defaultContactMaterial.contactEquationRelaxation = 3
  const split = true
  if (split)
    world.solver = new CANNON.SplitSolver(solver)
  else
    world.solver = solver
  world.gravity.set(0, -9.82, 0)
  world.broadphase = new CANNON.NaiveBroadphase()

  // Create a ground material (friction coefficient = 0.5)
  physicsMaterial = new CANNON.Material('groundMaterial')
  // creat a contact material
  const physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
    physicsMaterial,
    {
      friction: 200.6, // friction coefficient
      frictionEquationStiffness: 1e8,
      frictionEquationRegularizationTime: 3,
      restitution: 0.3,  // restitution
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3
    }
  )

  world.addContactMaterial(physicsContactMaterial)

  // Create a plane
  const groundShape = new CANNON.Plane()
  const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial })
  groundBody.addShape(groundShape)
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.add(groundBody)

  // create stand for main catapult
  mainStandSize = new CANNON.Vec3(2, 7, 3)
  const mainStandShape = new CANNON.Box(mainStandSize)
  mainStandBody = new CANNON.Body({ mass: 0, material: physicsMaterial })
  mainStandBody.addShape(mainStandShape)
  mainStandBody.position.set(-60, 5, 0)
  world.add(mainStandBody)

}

function init() {
  // making a scene
  scene = new THREE.Scene()
  // scene.fog = new THREE.FogExp2(0xffffff,0.08);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById('webgl').appendChild(renderer.domElement)
  renderer.shadowMap.enabled = true

  // making our scene objects

  // plane texture
  const planeTexture = new THREE.TextureLoader().load('texture/Grass.jpg')
  planeTexture.repeat.set(20, 20)
  planeTexture.wrapS = THREE.RepeatWrapping
  planeTexture.wrapT = THREE.RepeatWrapping
  planeTexture.magFilter = THREE.NearestFilter
  planeTexture.minFilter = THREE.LinearMipMapLinearFilter

  // plane mesh
  const geometry = new THREE.PlaneGeometry(512, 512)
  const material = new THREE.MeshStandardMaterial({
    color: 0x232426,
    side: THREE.BackSide,
    map: planeTexture,
    bumpMap: planeTexture,
    bumpScale: 0.1

  })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)

  // sky box
  const reflectionCube = new THREE.CubeTextureLoader()
    .setPath('texture/skybox4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
  reflectionCube.format = THREE.RGBFormat
  scene.background = reflectionCube

  // create reusable game objects
  createStones()
  createStands()

  // lights
  const ambiantlight = new THREE.AmbientLight(0xffffff, 3)
  scene.add(ambiantlight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
  directionalLight.position.set(-50, 50, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.right = 550
  directionalLight.shadow.camera.left = -550
  directionalLight.shadow.camera.top = 550
  directionalLight.shadow.camera.bottom = -550
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048

  scene.add(directionalLight)/*
    var helper = new THREE.DirectionalLightHelper( directionalLight, 500 );
    scene.add( helper );

*/
  // cameras
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.x = -64
  camera.position.y = 14
  camera.position.z = 7

  camera2 = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )

  camera2.position.x = -62
  camera2.position.y = 16
  camera2.position.z = 0

  /* var helper = new THREE.CameraHelper( camera );
    scene.add( helper );*/

  orthographicCamera = new THREE.OrthographicCamera(window.innerWidth / -40, window.innerWidth / 40, window.innerHeight / 40, window.innerHeight / -40, 0.01, 1000)
  orthographicCamera.position.set(0, 8, 15)
  camera.add(orthographicCamera)

  // setting default active camera

  activeCamera = camera

  orthographicCamera.lookAt(-30, 10, 0)

  const look1 = new THREE.Vector3(-47, 10, 0)
  camera.lookAt(look1)

  const look2 = new THREE.Vector3(-47, 14, 0)
  camera2.lookAt(look2)

  // using gui to set the scene
  /*

        var gui = new dat.GUI();
        var folder1 = gui.addFolder("camera and  light");
         folder1.add(ambiantlight, 'intensity', 0, 10);
         folder1.add(activeCamera.position, 'z', -200, 200);
         folder1.add(activeCamera.position, 'x', -200, 200);
         folder1.add(activeCamera.position, 'y', -200, 200);
    */

}

function updatePhysics() {

  // Step the physics world
  world.step(timeStep)
  // update stones
  for (let i = 0; i < stonesBody.length; i++) {
    stonesMesh[i].position.copy(stonesBody[i].position)
    stonesMesh[i].quaternion.copy(stonesBody[i].quaternion)
  }
  // update catapults
  for (let i = 0; i < catapultsBody.length; i++) {
    catapultsMesh[i].position.copy(catapultsBody[i].position)
    catapultsMesh[i].quaternion.copy(catapultsBody[i].quaternion)
  }
  for (let i = 0; i < standsBody.length; i++) {
    standsMesh[i].position.copy(standsBody[i].position)
    standsMesh[i].quaternion.copy(standsBody[i].quaternion)
  }
}

function update() {
  if (keyboard.pressed.KeyA && userShootVelocity < 50) {
    document.getElementById('power').innerHTML = 'power :' + userShootVelocity
    userShootVelocity += 0.5
  }

  renderer.render(scene, activeCamera)
  updatePhysics()
  requestAnimationFrame(() => {
    update()
  })
}

function checkCollison(stoneMesh, collidableMeshList) {
  const originPoint = stoneMesh.position.clone()
  for (let vertexIndex = 0; vertexIndex < stoneMesh.geometry.vertices.length; vertexIndex++) {
    const localVertex = stoneMesh.geometry.vertices[vertexIndex].clone()
    const globalVertex = localVertex.applyMatrix4(stoneMesh.matrix)
    const directionVector = globalVertex.sub(stoneMesh.position)

    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize())
    const collisionResults = ray.intersectObjects(collidableMeshList)

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
      removeCatapult(collisionResults[0].object.name, stoneMesh.name)
  }
}

function gameOver() {
  activeCamera = orthographicCamera
  clearInterval(attackSet)
  document.getElementById('game').innerHTML = 'Game over'
  document.getElementById('game').style.color = 'red'
  document.getElementById('game').style.display = 'block'
  positionUser()
}

function createCatapults(gltf) {
  catapultModel = gltf.scene
  catapultModel.scale.set(1 / 3, 1 / 3, 1 / 3)
  const halfExt = new CANNON.Vec3(0.2, 0.8, 0.8)
  for (let i = 0; i < 5; i++) {
    const catapultShape = new CANNON.Box(halfExt)
    const catapultBody = new CANNON.Body({ mass: 0 })
    catapultBody.addShape(catapultShape)

    catapultsBody.push(catapultBody)
    catapultsMesh.push(catapultModel.clone())
  }
  createCollidableMesh()
  // setting user position
  positionUser()
}

function positionUser() {
  world.add(catapultsBody[0])
  scene.add(catapultsMesh[0])
  catapultsBody[0].position.set(mainStandBody.position.x - 1.5, mainStandBody.position.y + mainStandSize.y, mainStandBody.position.z + 1)
  collidables[0].position.set(mainStandBody.position.x - 0.3, mainStandBody.position.y + mainStandSize.y + 1, mainStandBody.position.z)
  scene.add(collidables[0])
}

function createCollidableMesh() {
  for (let i = 0; i < 5; i++) {
    const collideGeometry = new THREE.BoxGeometry(3.2, 1.5, 3)
    const material = new THREE.MeshBasicMaterial({
      opacity: 0,
      side: THREE.FrontSide,
    })

    material.transparent = true
    const mesh = new THREE.Mesh(collideGeometry, material)
    mesh.name = i
    collidables.push(mesh)
  }
}

function removeCatapult(catapultName, stoneName) {
  if ((stoneName === 'enemy' && catapultName == 0) || (stoneName === 'user' && catapultName > 0)) {
    scene.remove(collidables[catapultName])
    scene.remove(catapultsMesh[catapultName])
    catapultsBody[catapultName].position.set(100, -100, 100)
    scene.remove(standsMesh[catapultName])
    standsBody[catapultName].position.set(100, -100, 100)
  }
}

function victory() {
  activeCamera = orthographicCamera
  if (attackSet)
    clearInterval(attackSet)

  document.getElementById('game').innerHTML = 'Victory'
  document.getElementById('game').style.color = '#0AB408'
  document.getElementById('game').style.display = 'block'
}

function createTower(gltf) {
  const tower = gltf.scene
  tower.scale.set(1 / 26, 1 / 15, 1 / 26)
  tower.position.set(mainStandBody.position.x, mainStandBody.position.y - 4, mainStandBody.position.z)
  tower.castShadow = true
  scene.add(tower)
}

function createStands() {
  const standTexture = new THREE.TextureLoader().load('texture/brick_stone_wall.jpg')
  standTexture.repeat.set(1, 1)
  standTexture.wrapS = THREE.RepeatWrapping
  standTexture.wrapT = THREE.RepeatWrapping
  standTexture.magFilter = THREE.NearestFilter
  standTexture.minFilter = THREE.LinearMipMapLinearFilter

  for (let i = 0; i < 5; i++) {
    const halfExt = new CANNON.Vec3(3, 0.6, 3)
    const standShape = new CANNON.Box(halfExt)
    const standBody = new CANNON.Body({ mass: 0 })
    standBody.addShape(standShape)
    standsBody.push(standBody)

    // making mesh for our stone and add it to the scene and mesh array
    const standGeometry = new THREE.BoxGeometry(halfExt.x * 2, halfExt.y * 2, halfExt.z * 2)
    const material = new THREE.MeshPhongMaterial({ color: 0x232426, map: standTexture })
    const standMesh = new THREE.Mesh(standGeometry, material)
    standsMesh.push(standMesh)
  }
}

function createStones() {
  const stoneTexture = new THREE.TextureLoader().load('texture/stoneTexture1.jpg')
  stoneTexture.repeat.set(1, 1)
  stoneTexture.wrapS = THREE.RepeatWrapping
  stoneTexture.wrapT = THREE.RepeatWrapping
  stoneTexture.magFilter = THREE.NearestFilter
  stoneTexture.minFilter = THREE.LinearMipMapLinearFilter

  for (let i = 0; i < 20; i++) {
    // make a body for our stone and add it to body array
    const stoneShape = new CANNON.Sphere(0.3)
    const stoneBody = new CANNON.Body({ mass: 80, material: physicsMaterial })
    stoneBody.addShape(stoneShape)
    stonesBody.push(stoneBody)

    // making mesh for our stone and add it to mesh array
    const stoneGeometry = new THREE.SphereGeometry(stoneShape.radius, 8, 8)
    const material = new THREE.MeshLambertMaterial({
      color: 0x232426,
      side: THREE.FrontSide,
      map: stoneTexture
    })
    const stoneMesh = new THREE.Mesh(stoneGeometry, material)
    stoneMesh.castShadow = true
    stonesMesh.push(stoneMesh)
  }
}

function getNewPosition(index) {
  const position = new THREE.Vector3()
  const x = xPositions[index]
  const y = Math.floor(Math.random() * 20) + 5
  position.set(x, y, 0.7)
  return position
}

function positioningEnemies(number) {
  if (attackSet)
    clearInterval(attackSet)

  for (let i = 1; i < number + 1; i++) {
    const newPosition = getNewPosition(i)
    world.add(catapultsBody[i])
    scene.add(catapultsMesh[i])
    catapultsBody[i].position.copy(newPosition)

    // make collidable mesh
    collidables[i].position.set(newPosition.x + 1, newPosition.y + 1, newPosition.z)
    scene.add(collidables[i])

    // adding stand
    standsBody[i].position.set(newPosition.x + 1, newPosition.y - 0.9, newPosition.z - 0.5)
    world.add(standsBody[i])
    scene.add(standsMesh[i])
  }
  level = number
  attackSet = setInterval(enemyAttack, 3000)
}

function enemyAttack() {
  for (let i = 1; i < level + 1; i++)
    if (catapultsBody[i].world === world)
      throwStone(catapultsBody[i], new THREE.Vector3(-1, 1, 0), Math.random() * 12.5 + 8, 'enemy')
}

let countStones = 0

function throwStone(catapultBody, shootDirection, shootVelocity, name) {
  if (countStones > 19)
    countStones = 0

  // shooting coordinate
  let { x } = catapultBody.position
  let { y } = catapultBody.position
  let { z } = catapultBody.position

  const stoneBody = stonesBody[countStones]
  const stoneMesh = stonesMesh[countStones]
  scene.add(stoneMesh)
  world.add(stoneBody)

  stoneBody.velocity.set(
    shootDirection.x * shootVelocity,
    shootDirection.y * shootVelocity,
    shootDirection.z * shootVelocity
  )
  // positioning stone out of shooting place
  x += shootDirection.x * (2)
  y += shootDirection.y * (3)
  z += shootDirection.z * (2)

  stoneBody.position.set(x, y, z)
  stoneMesh.position.set(x, y, z)
  stoneMesh.name = name
  userShootVelocity = 0
  countStones++
}
