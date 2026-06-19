 // ================= NAV =================
        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
                item.classList.add('active');
                document.getElementById('section-' + item.dataset.section).classList.add('active');
            });
        });

        // ================= MOBILE NAV =================
        document.getElementById('mobileNavToggle').addEventListener('click', () => {
            document.getElementById('panelNav').classList.toggle('mobile-open');
        });

        // ================= ORDER FILTER =================
        const filterBtns = document.querySelectorAll('.filter-pill');
        const orderCards = document.querySelectorAll('.order-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.textContent.trim();

                orderCards.forEach(card => {

                    const status = card.querySelector('.order-status').textContent.trim();

                    if (filter === 'همه') {
                        card.style.display = '';
                    } else {
                        card.style.display = status === filter ? '' : 'none';
                    }

                });

            });
        });

        // ================= ORDER DETAILS =================
        document.querySelectorAll('.order-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {

                const card = btn.closest('.order-card');
                const details = card.querySelector('.order-details');

                if (card.classList.contains('active')) {
                    details.style.maxHeight = null;
                    card.classList.remove('active');
                    btn.textContent = 'جزئیات';
                } else {
                    details.style.maxHeight = details.scrollHeight + 'px';
                    card.classList.add('active');
                    btn.textContent = 'بستن';
                }

            });
        });
        document.querySelectorAll('.order-items-preview').forEach(preview => {

            const thumbs = [...preview.querySelectorAll('.order-thumb')];

            let visibleCount;

            if (window.innerWidth < 576) {
                visibleCount = 2;
            } else if (window.innerWidth < 992) {
                visibleCount = 3;
            } else {
                visibleCount = 4;
            }

            if (thumbs.length > visibleCount) {

                const hiddenCount = thumbs.length - visibleCount;

                thumbs.forEach((thumb, index) => {
                    if (index >= visibleCount - 1) {
                        thumb.remove();
                    }
                });

                const more = document.createElement('div');
                more.className = 'order-thumb-more';
                more.textContent = `+${hiddenCount + 1}`;

                preview.appendChild(more);
            }

        });
        // ================= ADDRESS BOOK =================

        const modal = document.getElementById('globalModal');
        const modalContent = document.getElementById('modalContent');

        let currentModal = null;
        let currentPayload = null;

        /* ===================== OPEN MODAL ===================== */
        function openModal(type, payload = {}) {

            currentModal = type;
            currentPayload = payload;

            let html = '';

            /* ===================== ADDRESS ===================== */
            if (type === 'address') {

                const isEdit = payload.mode === 'edit';
                const data = payload.data || {};

                html = `
        <div class="modal-header">
            <div class="modal-title">
                ${isEdit ? 'ویرایش آدرس' : 'افزودن آدرس'}
            </div>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>

        <div class="modal-form">

            <div class="address-form-grid">
                <input id="addr_name" class="modal-input" placeholder="نام" value="${data.name || ''}">
                <input id="addr_phone" class="modal-input" placeholder="موبایل" value="${data.phone || ''}">
                <input id="addr_province" class="modal-input" placeholder="استان" value="${data.province || ''}">
                <input id="addr_city" class="modal-input" placeholder="شهر" value="${data.city || ''}">
            </div>

            <input id="addr_postal" class="modal-input" placeholder="کد پستی" value="${data.postal || ''}">
            <textarea id="addr_full" class="modal-textarea">${data.address || ''}</textarea>

            <button class="modal-submit" onclick="submitAddress()">
                ${isEdit ? 'ثبت تغییرات' : 'ذخیره آدرس'}
            </button>
        </div>
        `;
            }

            /* ===================== WALLET ===================== */
            if (type === 'wallet') {

                html = `
        <div class="modal-header">
            <div class="modal-title">شارژ کیف پول</div>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>

        <div class="modal-form">

            <input id="wallet_amount" class="modal-input" type="number" placeholder="مبلغ">

            <div class="wallet-quick-amounts">
                <button onclick="setAmount(50000)">50,000</button>
                <button onclick="setAmount(100000)">100,000</button>
                <button onclick="setAmount(200000)">200,000</button>
                <button onclick="setAmount(500000)">500,000</button>
            </div>

            <button class="modal-submit" onclick="submitWallet()">
                پرداخت
            </button>

        </div>
        `;
            }

            /* ===================== TICKET ===================== */
            if (type === 'ticket') {

                html = `
        <div class="modal-header">
            <div class="modal-title">ارسال تیکت</div>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>

        <div class="modal-form">

            <input id="ticket_title" class="modal-input" placeholder="عنوان">
            <textarea id="ticket_message" class="modal-textarea" placeholder="پیام"></textarea>

            <button class="modal-submit" onclick="submitTicket()">
                ارسال
            </button>

        </div>
        `;
            }

            modalContent.innerHTML = html;
            modal.classList.add('active');
        }

        /* ===================== CLOSE MODAL ===================== */
        function closeModal() {
            document.querySelectorAll('.modal-backdrop').forEach(modal => {
                modal.classList.remove('active');
            });

            currentModal = null;
            currentPayload = null;
            document.querySelectorAll('.modal-backdrop').forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal();
                    }
                });
            });
        }


        /* ===================== QUICK AMOUNT ===================== */
        function setAmount(value) {
            const input = document.getElementById('wallet_amount');
            if (input) input.value = value;
        }

        /* ===================== ADDRESS ===================== */
        async function submitAddress() {

            const data = {
                name: addr_name.value,
                phone: addr_phone.value,
                province: addr_province.value,
                city: addr_city.value,
                postal: addr_postal.value,
                address: addr_full.value
            };

            const isEdit = currentPayload?.mode === 'edit';

            await fetch(
                isEdit ? `/api/addresses/${currentPayload.data.id}` : '/api/addresses',
                {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            );

            closeModal();
            location.reload();
        }

        /* ===================== DELETE ADDRESS ===================== */
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.addr-action-btn.delete');
            if (!btn) return;

            const id = btn.dataset.id;
            const card = btn.closest('.addr-card');

            if (!confirm('حذف شود؟')) return;

            card.remove();

            fetch(`/api/addresses/${id}`, {
                method: 'DELETE'
            });
        });

        /* ===================== WALLET ===================== */
        async function submitWallet() {

            const amount = wallet_amount.value;

            await fetch('/api/wallet/charge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });

            closeModal();
        }

        /* ===================== TICKET ===================== */
        async function submitTicket() {

            await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: ticket_title.value,
                    message: ticket_message.value
                })
            });

            closeModal();
        }
        // ======================== modal-view-ticket====================
        document.addEventListener('DOMContentLoaded', () => {

            const modal = document.getElementById('ticketViewModal');
            const closeBtn = document.querySelector('.ticket-view-close');

            document.querySelectorAll('.ticket-card').forEach(card => {
                card.addEventListener('click', () => {
                    modal.classList.add('active');

                    const title = card.querySelector('.ticket-title')?.textContent;
                    if (title) {
                        modal.querySelector('.ticket-view-title').childNodes[0].nodeValue = title + ' ';
                    }
                });
            });

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

        });
        // ========= auth-password =============
        document.querySelector('.save-btn-pass').addEventListener('click', (e) => {
            e.preventDefault();

            const current = document.querySelectorAll('.panel-input-pass')[0].value;
            const newPass = document.querySelectorAll('.panel-input-pass')[1].value;
            const confirm = document.querySelectorAll('.panel-input-pass')[2].value;

            const errorBox = document.querySelector('.password-error');

            errorBox.style.display = 'none';
            errorBox.textContent = '';

            if (!current || !newPass || !confirm) {
                errorBox.textContent = 'تمام فیلدها الزامی است';
                errorBox.style.display = 'block';
                return;
            }

            if (newPass.length < 8) {
                errorBox.textContent = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
                errorBox.style.display = 'block';
                return;
            }

            if (newPass !== confirm) {
                errorBox.textContent = 'رمز عبور جدید و تکرار آن یکسان نیست';
                errorBox.style.display = 'block';
                return;
            }

            fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: current,
                    new_password: newPass
                })
            })
                .then(res => res.json())
                .then(data => {

                    if (!data.success) {
                        errorBox.textContent = data.message || 'خطا در تغییر رمز';
                        errorBox.style.display = 'block';
                        return;
                    }

                    alert('رمز با موفقیت تغییر کرد');
                });
        });