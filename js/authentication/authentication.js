       // ================= MESSAGE-ERROR =================
        const Message = (() => {
            const stack = document.createElement('div');
            stack.className = 'message-stack';
            document.body.appendChild(stack);
            function show(text, type = 'info', action = null) {
                const el = document.createElement('div');
                el.className = `message ${type}`;
                el.innerHTML = `
            <span>${text}</span>
            ${action ? `<button>${action.text}</button>` : ''}
        `;
                if (action) {
                    el.querySelector('button').onclick = action.onClick;
                }
                stack.appendChild(el);
                setTimeout(() => hide(el), 2500);
                return el;
            }
            function hide(el) {
                el.classList.add('hide');
                setTimeout(() => el.remove(), 200);
            }
            return {
                show
            };
        })();
        // ================= TABS =================
        function updateFormsHeight() {
            const wrapper = document.querySelector('.auth-forms');
            const activeForm = document.querySelector('.auth-form.active');
            if (!wrapper || !activeForm) return;
            wrapper.style.height = activeForm.scrollHeight + 'px';
        }
        window.addEventListener('load', updateFormsHeight);
        window.addEventListener('resize', updateFormsHeight);
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document
                    .querySelectorAll('.auth-tab')
                    .forEach(t => t.classList.remove('active'));
                document
                    .querySelectorAll('.auth-form')
                    .forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const targetForm = document.getElementById(
                    tab.dataset.tab + 'Form'
                );
                targetForm.classList.add('active');
                requestAnimationFrame(() => {
                    updateFormsHeight();
                });
                const tabs = document.querySelector('.auth-tabs');
                if (tab.dataset.tab === 'register') {
                    tabs.classList.add('register-active');
                } else {
                    tabs.classList.remove('register-active');
                }
            });
        });
        // ================= LOGIN METHOD SWITCH =================
        const methodSwitch = document.getElementById('methodSwitch');
        const phoneLabel = document.getElementById('phoneLabel');
        const emailLabel = document.getElementById('emailLabel');
        const loginPhoneGroup = document.getElementById('loginPhoneGroup');
        const loginEmailGroup = document.getElementById('loginEmailGroup');
        const loginPasswordGroup = document.getElementById('loginPasswordGroup');
        const loginOtpSection = document.getElementById('loginOtpSection');
        const forgotLink = document.getElementById('forgotLink');
        const loginSubmit = document.getElementById('loginSubmit');
        let isEmailMode = false;
        let otpSent = false;
        methodSwitch.addEventListener('click', () => {
            isEmailMode = !isEmailMode;
            methodSwitch.classList.toggle('on', isEmailMode);
            phoneLabel.classList.toggle('active-label', !isEmailMode);
            emailLabel.classList.toggle('active-label', isEmailMode);
            const hideElement = (el) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    el.style.display = 'none';
                    updateFormsHeight?.();
                }, 250);
            };
            const showElement = (el, display = 'flex') => {
                el.style.display = display;
                requestAnimationFrame(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(10px)';
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        updateFormsHeight?.();
                    });
                });
            };
            if (isEmailMode) {
                hideElement(loginPhoneGroup);
                if (otpSent) {
                    hideElement(loginOtpSection);
                }
                showElement(loginEmailGroup);
                showElement(loginPasswordGroup);
                forgotLink.style.display = 'block';
                forgotLink.style.opacity = '0';
                requestAnimationFrame(() => {
                    forgotLink.style.opacity = '1';
                });
                loginSubmit.textContent = 'ورود';
            } else {
                hideElement(loginEmailGroup);
                hideElement(loginPasswordGroup);
                forgotLink.style.opacity = '0';
                setTimeout(() => {
                    forgotLink.style.display = 'none';
                }, 250);
                showElement(loginPhoneGroup);
                if (otpSent) {
                    showElement(loginOtpSection);
                }
                loginSubmit.textContent = 'دریافت کد تایید';
            }
            updateFormsHeight?.();
        });
        // ================= LOGIN SUBMIT =================
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            // ================= LOGIN WITH PHONE =================
            if (!isEmailMode && !otpSent) {
                const phone = document.getElementById('loginPhone').value
                    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    .trim();
                if (!phone) {
                    Message.show('شماره موبایل را وارد کنید', 'error');
                    return;
                }
                if (!/^09\d{9}$/.test(phone)) {
                    Message.show('شماره موبایل معتبر نیست', 'error');
                    return;
                }
                // fetch('/api/auth/send-otp', {...})
                loginOtpSection.style.display = 'flex';
                startTimer('loginTimer', 'loginResend');
                loginSubmit.textContent = 'تایید کد';
                otpSent = true;
                Message.show('کد تایید ارسال شد', 'success');
                return;
            }
            // ================= VERIFY OTP =================
            if (!isEmailMode && otpSent) {
                const otpInputs = document.querySelectorAll(
                    '#loginOtpSection .otp-input'
                );
                const isComplete = [...otpInputs].every(
                    input => input.value.trim() !== ''
                );
                if (!isComplete) {
                    Message.show('کد تایید را کامل وارد کنید', 'error');
                    return;
                }
                const code = [...otpInputs]
                    .map(input => input.value.trim())
                    .join('');
                // fetch('/api/auth/verify-otp', {
                //     method: 'POST',
                //     body: JSON.stringify({ code })
                // })
                Message.show('ورود با موفقیت انجام شد', 'success');
                return;
            }
            // ================= LOGIN WITH EMAIL =================
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            if (!email) {
                Message.show('ایمیل را وارد کنید', 'error');
                return;
            }
            if (!password) {
                Message.show('رمز عبور را وارد کنید', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Message.show('ایمیل معتبر نیست', 'error');
                return;
            }
            // fetch('/api/auth/login-email', {...})
            Message.show('ورود با موفقیت انجام شد', 'success');
        });
        // ================= REGISTER SUBMIT =================
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const otpSection = document.getElementById('registerOtpSection');
            // ================= SEND REGISTER OTP =================
            if (
                otpSection.style.display === 'none' ||
                otpSection.style.display === ''
            ) {
                const phone = document.getElementById('registerPhone').value
                    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    .trim();
                if (!phone) {
                    Message.show('شماره موبایل را وارد کنید', 'error');
                    return;
                }
                if (!/^09\d{9}$/.test(phone)) {
                    Message.show('شماره موبایل معتبر نیست', 'error');
                    return;
                }
                // fetch('/api/auth/register', {...})
                otpSection.style.display = 'flex';

                startTimer(
                    'registerTimer',
                    'registerResend'
                );
                document.querySelector(
                    '#registerForm .auth-submit'
                ).textContent = 'تایید و ورود';
                Message.show('کد تایید ارسال شد', 'success');
                return;
            }
            // ================= VERIFY REGISTER OTP =================
            const otpInputs = document.querySelectorAll(
                '#registerOtpSection .otp-input'
            );
            const isComplete = [...otpInputs].every(
                input => input.value.trim() !== ''
            );
            if (!isComplete) {
                Message.show('کد تایید را کامل وارد کنید', 'error');
                return;
            }
            const code = [...otpInputs]
                .map(input => input.value.trim())
                .join('');
            // fetch('/api/auth/verify-otp', {
            //     method: 'POST',
            //     body: JSON.stringify({ code })
            // })
            Message.show('ثبت نام با موفقیت انجام شد', 'success');
        });
        // ================= FORGOT PASSWORD =================
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginPhoneGroup.style.display = 'none';
            loginEmailGroup.style.display = 'none';
            loginPasswordGroup.style.display = 'none';
            loginOtpSection.style.display = 'none';
            forgotLink.style.display = 'none';
            loginSubmit.style.display = 'none';
            document.querySelector('.login-method-wrap').style.display = 'none';
            document.getElementById('forgotForm').classList.add('active');
        });
        document.getElementById('backFromForgot').addEventListener('click', () => {
            const forgotForm = document.getElementById('forgotForm');
            forgotForm.classList.add('closing');
            setTimeout(() => {
                forgotForm.classList.remove('closing');
                forgotForm.classList.remove('active');
                if (isEmailMode) {
                    loginEmailGroup.style.display = 'flex';
                    loginPasswordGroup.style.display = 'flex';
                    forgotLink.style.display = 'block';
                    loginSubmit.style.display = 'block';
                } else {
                    loginPhoneGroup.style.display = 'flex';
                    loginSubmit.style.display = 'block';
                    if (otpSent) {
                        loginOtpSection.style.display = 'flex';
                    }
                }
                document.querySelector('.login-method-wrap').style.display = 'flex';
                updateFormsHeight?.();

            }, 300);
        });
        document
            .getElementById('forgotSubmit')
            .addEventListener('click', async () => {
                const email =
                    document.querySelector(
                        '#forgotForm input[type="email"]'
                    ).value.trim();
                if (!email) {
                    Message.show(
                        'ایمیل را وارد کنید',
                        'error'
                    );
                    return;
                }
                else
                    Message.show(
                        'رمز عبور ارسال شد',
                        'success'
                    );
                return;
                // API:
                // POST /api/auth/forgot-password
                // body:
                // {
                //     email
                // }

                // response:
                // {
                //     success: true,
                //     message: "Recovery email sent"
                // }
            });
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
                    input.classList.toggle('filled', !!input.value);
                    if (input.value && i < inputs.length - 1) inputs[i + 1].focus();
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && i > 0) {
                        inputs[i - 1].classList.remove('filled');
                        inputs[i - 1].focus();
                    }
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
        } console.log(Message); console.log(document.getElementById('loginEmail'));
        console.log(document.getElementById('loginPassword'));