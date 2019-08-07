import { isCollide } from '../utils/helpers.js'
import { createSketchBox, createBounds } from '../utils/three-helpers.js'

const playerSpeed = 5

export default class PlayerBox {
  constructor(size = 50) {
    this.movements = []
    this.mesh = createSketchBox(size)
    this.checkMovement = this.checkMovement.bind(this)
    document.addEventListener('mousedown', this.checkMovement)
  }

  add(obj) {
    this.mesh.add(obj)
  }

  checkCollisions(solids) {
    const myBounds = createBounds(this.mesh)
    solids.forEach(obj => {
      if (!isCollide(myBounds, obj)) return
      this.movements = []
      if (myBounds.xMin <= obj.xMax && myBounds.xMax >= obj.xMin) {
        const objectCenterX = (obj.xMax - obj.xMin) / 2 + obj.xMin
        const playerCenterX = (myBounds.xMax - myBounds.xMin) / 2 + myBounds.xMin
        if (objectCenterX > playerCenterX) this.mesh.position.x -= 1
        else this.mesh.position.x += 1
      }
      if (myBounds.zMin <= obj.zMax && myBounds.zMax >= obj.zMin) {
        const objectCenterZ = (obj.zMax - obj.zMin) / 2 + obj.zMin
        const playerCenterZ = (myBounds.zMax - myBounds.zMin) / 2 + myBounds.zMin
        if (objectCenterZ > playerCenterZ) this.mesh.position.z -= 1
        else this.mesh.position.z += 1
      }
    })
  }

  move() {
    const { position } = this.mesh
    const newPosX = this.movements[0].x
    const newPosZ = this.movements[0].z

    const diffX = Math.abs(position.x - newPosX)
    const diffZ = Math.abs(position.z - newPosZ)
    const distance = Math.sqrt(diffX * diffX + diffZ * diffZ)

    const multiplierX = position.x > newPosX ? -1 : 1
    const multiplierZ = position.z > newPosZ ? -1 : 1
    position.x += (playerSpeed * (diffX / distance)) * multiplierX
    position.z += (playerSpeed * (diffZ / distance)) * multiplierZ

    if (Math.floor(position.x) <= Math.floor(newPosX) + 15 &&
        Math.floor(position.x) >= Math.floor(newPosX) - 15 &&
        Math.floor(position.z) <= Math.floor(newPosZ) + 15 &&
        Math.floor(position.z) >= Math.floor(newPosZ) - 15
    ) {
      position.x = Math.floor(position.x)
      position.z = Math.floor(position.z)
      this.movements = []
    }
  }

  checkMovement(e) {
    e.preventDefault()
    this.movements = []
    const raycaster = new THREE.Raycaster()

    const x = e.clientX / window.innerWidth * 2 - 1
    const y = -e.clientY / window.innerHeight * 2 + 1
  
    const camera = this.mesh.children.find(x => x.type == 'PerspectiveCamera')
    raycaster.setFromCamera({x, y}, camera)
    const intersects = raycaster.intersectObjects([this.plane]) // must be array
    if (intersects.length > 0) this.movements.push(intersects[0].point)
  }
  

  update(solids) {
    if (this.movements.length > 0) this.move()
    this.checkCollisions(solids)
  }
}

