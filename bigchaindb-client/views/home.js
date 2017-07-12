const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host .headline {
     margin: 0 2rem;
  }
  :host {
    flex-direction: column;
  }
  @media(min-width: 960px) {
    :host {
      flex-direction: row;
    }
  }
  :host .headline {
    margin: 2rem 1rem;
  }
`

module.exports = function (state, emit) {
  return html`
    <div class="${prefix} layout container">
      <div class="layout flex2 vertically-center">
        <h1 class="headline">
          Register yourself, organization or music group and publish your music metadata into the blockchain!
          <a class="btn btn-big" href="/register">Get started</a>
        </h1>
      </div>
      <div class="flex">
        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/61979/61979,1271071006,5/stock-photo-muscular-man-with-big-chain-50748058.jpg" title="Big chain db mann" />
      </div>
    </div>
  `
}
