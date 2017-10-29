export default {
  data: {
    'admin:user': {
      login: 'admin',
      password: 'password',
      lastConnectionDate: ''
    },
    'admin:config': {
      sessionExpirationDelay: 0,
      switchToUnavailableDelay: 15
    },
    'user:id': 2,
    user: {
      'user:1': `{email:'huhu.hihi@gmail.com', password:'asdoihhr*&!'}`,
      'user:2': `{email:'haha@hoho.fr', password:'sdonoeifn2%#%'}`
    },
    'company:type:id': 2,
    'company:type': {
      'type:1': 'garage',
      'type:2': 'plomberie'
    },
    'company:id': 1,
    company: {
      'comp:1': `{name:'comp0', type:0}`
    }
  }
};
