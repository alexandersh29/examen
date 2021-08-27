import React, { Component } from 'react';
import firebaseConfig from './Firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: [],
      alert: false,
      alertData: {}
    };
  }

  showAlert(type, message) {
    this.setState({
      alert: true,
      alertData: { type, message }
    });
    setTimeout(() => {
      this.setState({ alert: false });
    }, 4000)
  }

  resetForm() {
    this.refs.contactForm.reset();
  }

  componentWillMount() {
    let formRef = firebaseConfig.database().ref('form').orderByKey().limitToLast(6);
    formRef.on('child_added', snapshot => {
      const { name, email, city, phone, message } = snapshot.val();
      const data = { name, email, city, phone, message };
      this.setState({ form: [data].concat(this.state.form) });
    })
  }

  sendMessage(e) {
    e.preventDefault();
    const params = {
      name: this.inputName.value,
      email: this.inputEmail.value,
      city: this.inputCity.value,
      phone: this.inputPhone.value,
      message: this.textAreaMessage.value
    };
    if (params.name && params.email && params.phone && params.phone && params.message) {
      firebaseConfig.database().ref('form').push(params).then(() => {
        this.showAlert('success', 'Su mensaje se envio con éxito.');
      }).catch(() => {
        this.showAlert('danger', 'Su mensaje no se pudo enviar.');
      });
      this.resetForm();
    } else {
      this.showAlert('warning', 'Por favor complete el formulario.');
    };
  }

  render() {
    return (
      <div>
        {this.state.alert && <div className={`alert alert-${this.state.alertData.type}`} role='alert'>
          <div className='container'>
            {this.state.alertData.message}
          </div>
        </div>}
        <div className='col-auto bg-warning p-5 text-center'>
          <div className='container'>
            <div className='row'>
              <div className='col-sm-12'>
              Formulario de Contacto  + Firebase |  Link GitHub: <a href='https://github.com/alexandersh29/examen' className='alert-link'> Form + Firebase Click aqui.</a>
              </div>
            </div>
          </div>
        </div>
        <div className='container' style={{ padding: `40px 0px` }}>
          <div className='row'>
            <div className='col-sm-4'>
              <h2>Formulario de Contact</h2>
              <form onSubmit={this.sendMessage.bind(this)} ref='contactForm' >
                <div className='form-group'>
                  <label htmlFor='name'>Nombre</label>
                  <input type='text' className='form-control' id='name' placeholder='Nombre' ref={name => this.inputName = name} />
                </div>
                <div className='form-group'>
                  <label htmlFor='exampleInputEmail1'>Email</label>
                  <input type='email' className='form-control' id='email' placeholder='Email' ref={email => this.inputEmail = email} />
                </div>
                <div className='form-group'>
                  <label htmlFor='city'>Ciudad</label>
                  <select className='form-control' id='city' ref={city => this.inputCity = city}>
                  < option value='Morelia'>Morelia</option>
                    <option value='Guanajuato'>Guanajuato</option>
                    <option value='Patzcuaro'>Patzcuaro</option>
                    <option value='México'>México</option>
                    <option value='Guadalajara'>Guadalajara</option>                   
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='phone'>Telefono</label>
                  <input type='number' className='form-control' id='phone' placeholder='+52 1' ref={phone => this.inputPhone = phone} />
                </div>
                <div className='form-group'>
                  <label htmlFor='message'>Mensaje</label>
                  <textarea className='form-control' id='message' rows='3' ref={message => this.textAreaMessage = message}></textarea>
                </div>
                <button type='submit' className='btn btn-primary'>Guardar Información</button>
              </form>
            </div>
            <div className='col-sm-8'>
              <div className='row'>
                {this.state.form.map(form =>
                  <div className='col-sm-6' key={form.phone} style={{ margin: `0px 0px 30px 0px` }}>
                    <div className='card'>
                      <div className='card-body'>
                        <h4 className='card-title'>{form.name}</h4>
                        <h6 className='card-subtitle mb-2 text-muted'>{form.city}</h6>
                        <p className='card-text'>{form.message}</p>
                        <a href={`tel:${form.phone}`} className='card-link'>{form.phone}</a>
                        <a href={`mailto:${form.email}`} className='card-link'>{form.email}</a>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
 
      </div>
    );
  }
}

export default App;