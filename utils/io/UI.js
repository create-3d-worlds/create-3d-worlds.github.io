const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

/** STYLE */

const startScreenStyle = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  width: 80%;
  flex-wrap: wrap;
  justify-content: center;
`

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
  constructor({ title = 'COMMANDS', commands = baseControls } = {}) {
    this.title = title
    this.commands = commands
    this.addUIControls(title, commands)
  }

  addUIControls(title, commands) {
    const div = document.createElement('div')
    div.style = controlsStyle
    div.innerHTML = Object.keys(commands).reduce((acc, key) => acc +
    `<p style="${rowStyle}"><b style="${btnStyle}">${translateKey(key)}</b> ${commands[key]}</p>`,
    `<h3 style="${rowStyle}">${title}</h2>`
    )
    document.body.appendChild(div)
  }

  addStartScreen({ innerHTML, callback }) {
    const div = document.createElement('div')
    div.style = startScreenStyle
    div.innerHTML = innerHTML
    div.addEventListener('click', e => callback(e, div))

    document.body.appendChild(div)
  }
}