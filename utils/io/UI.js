const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

/** CONTROLS STYLE */

export default class UI {
  constructor({ title = 'CONTROLS', controls = baseControls } = {}) {
    this.title = title
    this.controls = controls
    this.addUIControls(title, controls)
  }

  addUIControls(title, controls) {
    const div = document.createElement('div')
    div.className = 'controls'

    const closedTitle = `${title} &#9660;`
    const openTitle = `${title} &#9654;`

    const button = document.createElement('button')
    // button.className = 'rpgui-button'
    button.innerHTML = closedTitle

    const content = document.createElement('div')
    content.className = 'rpgui-container framed'
    content.innerHTML = Object.keys(controls).map(key =>
      `<p><b>${key}</b> ${controls[key]}</p>`
    ).join('')
    content.style.display = 'none'

    button.addEventListener('click', () => {
      content.style.display = content.style.display == 'none' ? 'block' : 'none'
      button.innerHTML = content.style.display == 'none' ? closedTitle : openTitle
    })

    div.appendChild(button)
    div.appendChild(content)
    document.body.appendChild(div)
  }

  addStartScreen({ title, innerHTML, callback }) {
    const div = document.createElement('div')
    div.className = 'central-screen rpgui-container framed'
    if (title) div.innerHTML = `<h2>${title}</h2>`

    const selectDiv = document.createElement('div')
    selectDiv.className = 'central-screen-select'
    selectDiv.innerHTML = innerHTML
    selectDiv.addEventListener('click', e => callback(e, div))

    div.appendChild(selectDiv)
    document.body.appendChild(div)
  }
}