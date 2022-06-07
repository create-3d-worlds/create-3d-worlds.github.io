const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let positionX = 100.0
let positionY = 175.0
let velocityX = 4.0
let velocityY = 0.0
const gravity = 0.5
let onGround = false

window.addEventListener('mousedown', startJump, false)
window.addEventListener('mouseup', endJump, false)

function startJump() {
  if (!onGround) return
  velocityY = -12.0
  onGround = false
}

function endJump() {
  if (velocityY < -3.0)
    velocityY = -3.0
}

function update() {
  velocityY += gravity
  positionY += velocityY
  positionX += velocityX

  if (positionY > 175.0) {
    positionY = 175.0
    velocityY = 0.0
    onGround = true
  }

  if (positionX < 10 || positionX > 190)
    velocityX *= -1
}

function render() {
  ctx.clearRect(0, 0, 200, 200)
  ctx.beginPath()
  ctx.moveTo(0, 175)
  ctx.lineTo(200, 175)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(positionX - 10, positionY - 20)
  ctx.lineTo(positionX + 10, positionY - 20)
  ctx.lineTo(positionX + 10, positionY)
  ctx.lineTo(positionX - 10, positionY)
  ctx.closePath()
  ctx.stroke()
}

void function loop() {
  update()
  render()
  window.setTimeout(loop, 33)
}()