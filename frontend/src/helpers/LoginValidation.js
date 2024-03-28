function ValidateLogin(values) {
    let error = {
        name: '',
        email: '',
        password: ''
    }
    if (values.name === '') {
        error.name = 'Name field should not be empty';
    }
    if (values.email === '') {
        error.email = 'Email field should not be empty';
    }
    if (values.password === '') {
        error.password = 'Password field should not be empty';
    }    
    return error;

}

export default ValidateLogin