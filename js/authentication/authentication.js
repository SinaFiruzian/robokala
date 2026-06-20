// ================= MESSAGE SYSTEM =================
function Message(type, text) {

    const stack = getStack();

    const el = document.createElement('div');
    el.className = `message ${type}`;
    el.innerHTML = `<span>${text}</span>`;

    stack.appendChild(el);

    setTimeout(() => {
        el.classList.add('hide');
        setTimeout(() => el.remove(), 200);
    }, 2000);
}

function getStack() {
    let stack = document.querySelector('.message-stack');

    if (!stack) {
        stack = document.createElement('div');
        stack.className = 'message-stack';
        document.body.appendChild(stack);
    }

    return stack;
}
// ================= SWITCH LOGIN/REGISTER =================
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const switchBg = document.getElementById('switchBg');
const formsTrack = document.getElementById('formsTrack');
const greetingTitle = document.getElementById('greetingTitle');
const greetingDesc = document.getElementById('greetingDesc');

function goTo(mode) {
    const isRegister = mode === 'register';
    switchBg.classList.toggle('to-register', isRegister);
    formsTrack.classList.toggle('to-register', isRegister);
    btnLogin.classList.toggle('active', !isRegister);
    btnRegister.classList.toggle('active', isRegister);

    greetingTitle.textContent = isRegister ? 'به ما بپیوند!' : 'خوش برگشتی!';
    greetingDesc.textContent = isRegister
        ? 'برای شروع یک حساب کاربری جدید بساز'
        : 'برای ادامه وارد حساب کاربری خودت شو';
}

btnLogin.addEventListener('click', () => goTo('login'));
btnRegister.addEventListener('click', () => goTo('register'));

// ================= LOGIN METHOD SWITCH (موبایل/ایمیل) =================
const loginMethodSwitch = document.getElementById('loginMethodSwitch');
const loginPhoneLbl = document.getElementById('loginPhoneLbl');
const loginEmailLbl = document.getElementById('loginEmailLbl');
const loginPhoneGroup = document.getElementById('loginPhoneGroup');
const loginEmailGroup = document.getElementById('loginEmailGroup');
const loginPasswordGroup = document.getElementById('loginPasswordGroup');
const loginOtpWrap = document.getElementById('loginOtpWrap');
const forgotLink = document.getElementById('forgotLink');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');

let isEmailMode = false;
let loginOtpSent = false;

loginMethodSwitch.addEventListener('click', () => {
    isEmailMode = !isEmailMode;
    loginMethodSwitch.classList.toggle('on', isEmailMode);
    loginPhoneLbl.classList.toggle('on', !isEmailMode);
    loginEmailLbl.classList.toggle('on', isEmailMode);

    if (isEmailMode) {
        loginPhoneGroup.style.display = 'none';
        loginOtpWrap.classList.remove('open');
        loginEmailGroup.style.display = 'flex';
        loginPasswordGroup.style.display = 'flex';
        forgotLink.style.display = 'block';
        loginSubmitBtn.textContent = 'ورود به حساب';
    } else {
        loginPhoneGroup.style.display = 'flex';
        if (loginOtpSent) loginOtpWrap.classList.add('open');
        loginEmailGroup.style.display = 'none';
        loginPasswordGroup.style.display = 'none';
        forgotLink.style.display = 'none';
        loginSubmitBtn.textContent = loginOtpSent ? 'تایید کد' : 'دریافت کد تایید';
    }
});

// ================= VALIDATORS =================

function isValidPhone(phone) {
    return /^09\d{9}$/.test(phone);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pass) {
    return pass.length >= 8;
}

// ================= LOGIN =================

const loginForm = document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener('submit', (e) => {

        e.preventDefault();

        // ورود با موبایل - مرحله اول
        if (!isEmailMode && !loginOtpSent) {

            const phone = document.getElementById('loginPhone').value.trim();

            if (!phone) {
                Message('error', 'لطفاً شماره موبایل را وارد کنید');
                return;
            }

            if (!isValidPhone(phone)) {
                Message('error', 'شماره موبایل باید با صفر شروع شود و ۱۱ رقم باشد');
                return;
            }

            // ================= API =================
            // fetch('/api/auth/send-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ phone })
            // })

            loginOtpWrap.classList.add('open');
            startTimer('loginTimer', 'loginResend');

            loginSubmitBtn.textContent = 'تایید کد';
            loginOtpSent = true;

            Message('success', 'کد تایید ارسال شد');
            return;
        }

        // ورود با موبایل - تایید OTP
        if (!isEmailMode && loginOtpSent) {

            const phone = document.getElementById('loginPhone').value.trim();

            const otpInputs =
                document.querySelectorAll('#loginOtpWrap .otp-input');

            const code =
                Array.from(otpInputs)
                    .map(input => input.value)
                    .join('');

            if (code.length < 5) {
                Message('error', 'لطفاً کد تایید را کامل وارد کنید');
                return;
            }

            // ================= API =================
            // fetch('/api/auth/verify-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ phone, code })
            // })

            Message('success', 'ورود با موفقیت انجام شد');
            return;
        }

        // ورود با ایمیل
        const email =
            document.getElementById('loginEmail').value.trim();

        const password =
            document.getElementById('loginPassword').value;

        if (!email || !password) {
            Message('error', 'لطفاً همه فیلدها را پر کنید');
            return;
        }

        if (!isValidEmail(email)) {
            Message('error', 'ایمیل وارد شده معتبر نیست');
            return;
        }

        if (!isValidPassword(password)) {
            Message('error', 'رمز عبور باید حداقل ۸ کاراکتر باشد');
            return;
        }

        // ================= API =================
        // fetch('/api/auth/login-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // })

        Message('success', 'ورود با موفقیت انجام شد');
    });

}

// ================= REGISTER =================

const registerOtpWrap =
    document.getElementById('registerOtpWrap');

const registerSubmitBtn =
    document.getElementById('registerSubmitBtn');

let registerOtpSent = false;

const registerForm =
    document.getElementById('registerForm');

if (registerForm) {

    registerForm.addEventListener('submit', (e) => {

        e.preventDefault();

        // مرحله اول ثبت نام
        if (!registerOtpSent) {

            const name =
                document.getElementById('registerName')?.value.trim();

            const phone =
                document.getElementById('registerPhone').value.trim();

            const email =
                document.getElementById('registerEmail')?.value.trim();

            const password =
                document.getElementById('registerPassword').value;

            if (!name) {
                Message('error', 'لطفاً نام و نام خانوادگی را وارد کنید');
                return;
            }

            if (!phone) {
                Message('error', 'لطفاً شماره موبایل را وارد کنید');
                return;
            }

            if (!isValidPhone(phone)) {
                Message('error', 'شماره موبایل معتبر نیست');
                return;
            }

            if (email && !isValidEmail(email)) {
                Message('error', 'ایمیل وارد شده معتبر نیست');
                return;
            }

            if (!password) {
                Message('error', 'لطفاً رمز عبور را وارد کنید');
                return;
            }

            if (!isValidPassword(password)) {
                Message('error', 'رمز عبور باید حداقل ۸ کاراکتر باشد');
                return;
            }

            // ================= API =================
            // fetch('/api/auth/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         name,
            //         phone,
            //         email,
            //         password
            //     })
            // })

            registerOtpWrap.classList.add('open');

            startTimer(
                'registerTimer',
                'registerResend'
            );

            registerSubmitBtn.textContent =
                'تایید و ورود';

            registerOtpSent = true;

            Message('success', 'کد تایید ارسال شد');

            return;
        }

        // تایید OTP ثبت نام
        const phone =
            document.getElementById('registerPhone').value.trim();

        const otpInputs =
            document.querySelectorAll('#registerOtpWrap .otp-input');

        const code =
            Array.from(otpInputs)
                .map(input => input.value)
                .join('');

        if (code.length < 5) {
            Message('error', 'لطفاً کد تایید را کامل وارد کنید');
            return;
        }

        // ================= API =================
        // fetch('/api/auth/verify-otp', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         phone,
        //         code
        //     })
        // })

        Message('success', 'ثبت نام با موفقیت انجام شد');
    });

}

// ================= FORGOT PASSWORD =================

const forgotOverlay =
    document.getElementById('forgotOverlay');

const forgotSubmitBtn =
    document.getElementById('forgotSubmitBtn');

const backFromForgot =
    document.getElementById('backFromForgot');

if (forgotLink && forgotOverlay) {

    forgotLink.addEventListener('click', (e) => {

        e.preventDefault();

        forgotOverlay.classList.add('open');
    });

}

if (backFromForgot && forgotOverlay) {

    backFromForgot.addEventListener('click', () => {

        forgotOverlay.classList.remove('open');
    });

}

if (forgotSubmitBtn) {

    forgotSubmitBtn.addEventListener('click', () => {

        const email =
            document
                .querySelector('#forgotOverlay .auth-input')
                .value
                .trim();

        if (!email) {
            Message('error', 'لطفاً ایمیل خود را وارد کنید');
            return;
        }

        if (!isValidEmail(email)) {
            Message('error', 'ایمیل وارد شده معتبر نیست');
            return;
        }

        // ================= API =================
        // fetch('/api/auth/forgot-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // })

        Message(
            'success',
            'لینک بازیابی به ایمیل شما ارسال شد'
        );
    });
}

// ================= PASSWORD TOGGLE =================
['login', 'register'].forEach(prefix => {
    const toggle = document.getElementById(prefix + 'PassToggle');
    const input = document.getElementById(prefix + 'Password');
    toggle?.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        toggle.querySelector('i').className = isPass ? 'ti ti-eye-off' : 'ti ti-eye';
    });
});

// ================= OTP AUTO FOCUS =================
document.querySelectorAll('.otp-inputs').forEach(wrap => {
    const inputs = wrap.querySelectorAll('.otp-input');
    inputs.forEach((input, i) => {
        input.addEventListener('input', () => {
            if (input.value && i < inputs.length - 1) inputs[i + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) inputs[i - 1].focus();
        });
    });
});

// ================= OTP TIMER =================
function startTimer(timerId, resendId) {
    let seconds = 120;
    const timerEl = document.getElementById(timerId);
    const resendEl = document.getElementById(resendId);
    resendEl.style.display = 'none';
    timerEl.style.display = 'inline';

    const interval = setInterval(() => {
        seconds--;
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;

        if (seconds <= 0) {
            clearInterval(interval);
            timerEl.style.display = 'none';
            resendEl.style.display = 'inline';
        }
    }, 1000);

    resendEl.onclick = () => {
        resendEl.style.display = 'none';
        timerEl.style.display = 'inline';
        seconds = 120;
        // fetch('/api/auth/resend-otp', { method: 'POST' })
    };
}