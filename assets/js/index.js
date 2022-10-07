let passwordOnOff = document.querySelector('.bi-eye-fill');
let signupForm = document.querySelector('.signup-form');
let overlay = document.querySelector('.overlay');

signupForm.classList.add('close');
overlay.classList.add('close');

document.querySelector('#register-now').onclick = function () {
    signupForm.classList.remove('close');
    overlay.classList.remove('close');
    signupForm.classList.add('open');
    overlay.classList.add('open');
}

passwordOnOff.onclick = () => {
    let passwordInput = document.querySelector('#password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

function off() {
    console.log('off event called');
    signupForm.classList.remove('open');
    overlay.classList.remove('open');
    signupForm.classList.add('close');
    overlay.classList.add('close');
}