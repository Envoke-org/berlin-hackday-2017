const html = require('choo/html')
const extend = require('xtend')

const options = ['Person', 'Organization', 'MusicGroup'].map((n) => ({ value: n, label: n }))

module.exports = function (state, emit) {
  function select (options, value = state.form.type) {
    return html`
      <select onchange=${(e) => emit('update-type', e.target.value)} name="type">
        ${options.map((o) =>
          html`<option value="${o.value}"
              selected="${value === o.value}">
              ${o.label}
          </option>`
        )}
      </select>`
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
  return html`
    <div class="container">
      <div class="row">
        <form onsubmit=${handleSubmit}>
          ${select(options)}
          ${state.form.type === 'Person' ? PersonForm() : DefaultForm()}
          <button class="btn btn-default" type="submit">Register</button>
        </form>
      </div>
    </div>
  `

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
