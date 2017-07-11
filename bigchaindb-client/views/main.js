const html = require('choo/html')
const extend = require('xtend')

const options = ['Person', 'Organization', 'MusicGroup'].map((n) => ({ value: n, label: n }))

module.exports = function (state, emit) {
  return html`
    <div class="container">
      <h1>
        ${text()}
      </h1>
      <div class="row">
        <form onsubmit=${handleSubmit}>
          ${select(options)}
          ${state.form.type === 'Person' ? PersonForm() : DefaultForm()}
          <button class="btn btn-default" type="submit">Register</button>
        </form>
      </div>
    </div>
  `

  function select (options, value = state.form.type) {
    function option (o) {
      return html`
        <option value="${o.value}"selected="${value === o.value}">
          ${o.label}
        </option>
      `
    }
    return html`
      <fieldset>
        <div class="form-group">
          <select class="form-control" onchange=${(e) => emit('update-type', e.target.value)} name="type">
            ${options.map(option)}
          </select>
        </div>
      </fieldset>
    `
  }

  function handleSubmit (e) {
    e.preventDefault()
    const type = e.target.type.value
    emit('create-user', extend(type === 'Person' ? {
      birthDate: e.target.birthDate.value,
      familyName: e.target.familyName.value,
      givenName: e.target.givenName.value,
      image: e.target.image.value
    } : {
      name: e.target.name.value,
      description: e.target.description.value,
      email: e.target.email.value,
      members: e.target.members.value,
      image: e.target.image.value
    }, { type }))
  }

  function text () {
    switch (state.form.type) {
      case 'Person':
        return 'You are an individual'
      case 'Organization':
        return 'You are an organization'
      case 'MusicGroup':
        return 'You are a music group'
      default:
    }
  }

  function DefaultForm () {
    return html`
      <fieldset>
        <div class="form-group">
          <input class="form-control" type="text" name="name" placeholder="Name" value=${state.form.name} required />
        </div>
        <div class="form-group">
          <input class="form-control" type="text" name="description" placeholder="Description" value=${state.form.description} required />
        </div>
        <div class="form-group">
          <input type="email" class="form-control" name="email" placeholder="Email" value=${state.form.email} required />
        </div>
        <div class="form-group">
          <input type="text" class="form-control" name="members" placeholder="Members" value=${state.form.members} required />
        </div>
        <div class="form-group">
          <input class="form-control" type="text" name="image" placeholder="Image url" value=${state.form.image} required />
        </div>
      </fieldset>
    `
  }

  function PersonForm () {
    return html`
      <fieldset>
        <div class="form-group">
          <input class="form-control" type="text" name="birthDate" placeholder="Birthdate: MM/DD/YYYY" value=${state.form.birthDate} required />
        </div>
        <div class="form-group">
          <input class="form-control" type="text" name="familyName" placeholder="Family name" value=${state.form.familyName} required />
        </div>
        <div class="form-group">
          <input class="form-control" type="text" name="givenName" placeholder="Given name" value=${state.form.givenName} required />
        </div>
        <div class="form-group">
          <input class="form-control" type="text" name="image" placeholder="Image url" value=${state.form.image} required />
        </div>
      </fieldset>
    `
  }
}
