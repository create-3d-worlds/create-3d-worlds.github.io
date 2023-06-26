const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

/** START SCREEN STYLE */

const startOuterStyle = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const startInnerStyle = `
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

/** CONTROLS STYLE */

const controlsStyle = `
  left: 20px;
  position: absolute;
  bottom: 20px;
`

const rowStyle = `
  margin-top: 2px;
  margin-bottom: 2px;
`

const btnStyle = `
  padding: 1px 2px;
  min-width: 12px;
  display: inline-block;
  text-align: center;
`

/** UTILS */

const translateKey = key => {
  key = key.replace(/Key/, '') // eslint-disable-line no-param-reassign
  switch (key) {
    case 'ArrowLeft':
      return '←'
    case 'ArrowRight':
      return '→'
    case 'ArrowUp':
      return '↑'
    case 'ArrowDown':
      return '↓'
    default:
      return key
  }
}

export default class UI {
  constructor({ title = 'CONTROLS', controls = baseControls } = {}) {
    this.title = title
    this.controls = controls
    this.addUIControls(title, controls)
  }

  addUIControls(title, controls) {
    const div = document.createElement('div')
    div.style = controlsStyle

    const innerDiv = document.createElement('div')
    innerDiv.innerHTML = Object.keys(controls).map(key =>
      `<p style="${rowStyle}"><b style="${btnStyle}">${translateKey(key)}</b> ${controls[key]}</p>`
    ).join('')

    const icon = innerDiv.style.display == 'none' ? '▶' : '▼'
    div.innerHTML = `<h3 style="${rowStyle}">${title} ▾</h3>` // ▾ ► ▼ ▶

    div.addEventListener('click', () => {
      innerDiv.style.display = innerDiv.style.display == 'none' ? 'block' : 'none'
    })

    div.appendChild(innerDiv)
    document.body.appendChild(div)
  }

  addStartScreen({ title, innerHTML, callback }) {
    const div = document.createElement('div')
    div.style = startOuterStyle
    if (title)div.innerHTML = `<h2>${title}</h2>`

    const innerDiv = document.createElement('div')
    innerDiv.style = startInnerStyle
    innerDiv.innerHTML = innerHTML
    innerDiv.addEventListener('click', e => callback(e, div))

    div.appendChild(innerDiv)
    document.body.appendChild(div)
  }
}