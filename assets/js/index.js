let passwordOnOff = document.querySelector('.bi-eye-fill');

passwordOnOff.onclick = () => {
    let passwordInput = document.querySelector('#password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}