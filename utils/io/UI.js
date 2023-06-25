const divStyle = `
  color: #fff;
  left: 8px;
  position: absolute;
  top: 4px;
`

const rowStyle = `
  margin-top: 2px;
  margin-bottom: 2px;
`

const btnStyle = `
  border:1px solid #fff;
  padding: 1px 2px;
  min-width: 12px;
  display: inline-block;
  text-align: center;
`

const baseCommands = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

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
  constructor({ title = 'COMMANDS', commands = baseCommands } = {}) {
    this.title = title
    this.commands = commands
    this.addUIControls()
  }

  addUIControls() {
    const div = document.createElement('div')
    div.style = divStyle
    div.innerHTML = Object.keys(this.commands).reduce(
      (acc, key) => acc +
      `<p style="${rowStyle}"><b style="${btnStyle}">${translateKey(key)}</b> ${this.commands[key]}</p>`,
      `<h3 style="${rowStyle}">${this.title}</h2>`
    )
    document.body.appendChild(div)
  }
}