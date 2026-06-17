document.addEventListener('DOMContentLoaded', () => Cart.init());

/* ===================== MESSAGE SYSTEM ===================== */
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

    function undo(text, onUndo) {
        return show(text, 'undo', {
            text: 'برگردان',
            onClick: onUndo
        });
    }

    return { show, undo };

})();


/* ===================== CART ENGINE ===================== */
const Cart = (() => {

    const state = {
        items: new Map()
    };

    const removedStack = [];

    const CONFIG = {
        MAX_QTY: 10,
        SYNC_DELAY: 300
    };

    const debounceMap = new Map();

    /* ================= INIT ================= */
    function init() {
        document.querySelectorAll('.cart-item').forEach(bindItem);
        render();
    }

    function bindItem(item) {
        const id = item.dataset.id;
        if (!id) return;

        const price = parsePrice(item.querySelector('.cart-item__price')?.textContent);
        const oldPriceEl = item.querySelector('.cart-item__old');

        const oldPrice = oldPriceEl
            ? parsePrice(oldPriceEl.textContent)
            : price;

        const qtyEl = item.querySelector('.cart-counter-num');

        const data = {
            id,
            el: item,
            quantity: parseInt(qtyEl?.textContent) || 1,
            price,
            oldPrice,
            removed: false,
            maxAllowed: CONFIG.MAX_QTY
        };

        state.items.set(id, data);

        item.querySelector('.increase')?.addEventListener('click', () => increase(id));
        item.querySelector('.decrease')?.addEventListener('click', () => decrease(id));
    }

    /* ================= ACTIONS ================= */
    function increase(id) {
        const item = state.items.get(id);
        if (!item || item.removed) return;

        if (item.quantity >= item.maxAllowed) {
            Message.show(`حداکثر ${item.maxAllowed} عدد`, 'error');
            return;
        }

        item.quantity++;

        render();
        queueSync(item);
    }

    function decrease(id) {
        const item = state.items.get(id);
        if (!item || item.removed) return;

        if (item.quantity <= 1) {
            removeItem(id);
            return;
        }

        item.quantity--;

        render();
        queueSync(item);
    }

    /* ================= REMOVE ================= */
    function removeItem(id) {
        const item = state.items.get(id);
        if (!item) return;

        item.removed = true;
        removedStack.push({ ...item });

        item.el.style.transition = '0.25s';
        item.el.style.opacity = '0';
        item.el.style.transform = 'translateX(30px)';

        setTimeout(() => {
            item.el.remove();
            render();

            Message.undo("محصول حذف شد", () => restoreLast());
        }, 250);

        queueSync(item, true);
    }

    function restoreLast() {
        const item = removedStack.pop();
        if (!item) return;

        item.removed = false;

        const container = document.querySelector('.cart-items');
        container?.appendChild(item.el);

        item.el.style.opacity = '1';
        item.el.style.transform = 'translateX(0)';

        state.items.set(item.id, item);

        render();
        queueSync(item);
    }

    /* ================= SYNC ================= */
    function queueSync(item, isDelete = false) {

        clearTimeout(debounceMap.get(item.id));

        debounceMap.set(item.id, setTimeout(async () => {

            try {

                /*
                await fetch('/api/cart/update', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        product_id: item.id,
                        quantity: item.quantity,
                        removed: item.removed || isDelete
                    })
                });
                */

            } catch (err) {
                console.error(err);

                // rollback safe
                item.quantity = Math.max(1, item.quantity);
                item.removed = false;

                Message.show("خطا در ارتباط با سرور", "error");
                render();
            }

        }, CONFIG.SYNC_DELAY));
    }

    /* ================= RENDER ================= */
    function render() {
        let totalItems = 0;
        let original = 0;
        let final = 0;

        state.items.forEach(item => {
            if (item.removed) return;

            const qtyEl = item.el.querySelector('.cart-counter-num');
            if (qtyEl) qtyEl.textContent = item.quantity;

            totalItems += item.quantity;
            original += item.oldPrice * item.quantity;
            final += item.price * item.quantity;
        });

        const discount = original - final;

        setText('cartItemCount', `${totalItems} محصول`);
        setText('totalOriginal', format(original));
        setText('totalDiscount', '- ' + format(discount));
        setText('totalFinal', format(final));
    }

    /* ================= HELPERS ================= */
    function parsePrice(text) {
        return parseInt((text || '').replace(/[^\d]/g, '')) || 0;
    }

    function format(num) {
        return num.toLocaleString('en-US') + ' تومان';
    }

    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    return { init };

})();