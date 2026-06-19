/// ==================== GALLERY ====================

const mainImage = document.getElementById("mainProductImage");
const thumbs = [...document.querySelectorAll(".thumb")];

const prevBtn = document.querySelector(".gallery-nav.prev");
const nextBtn = document.querySelector(".gallery-nav.next");

let currentIndex = 0;

// ---------- render ----------
function renderImage(index) {

    currentIndex = index;

    mainImage.src =
        thumbs[index].querySelector("img").src;

    document
        .querySelector(".thumb.active")
        ?.classList.remove("active");

    thumbs[index].classList.add("active");
}

// ---------- thumb click ----------
thumbs.forEach((thumb, index) => {

    thumb.addEventListener("click", () => {
        renderImage(index);
    });

});

// ---------- next ----------
function nextImage() {

    currentIndex++;

    if (currentIndex >= thumbs.length) {
        currentIndex = 0;
    }

    renderImage(currentIndex);
}

// ---------- prev ----------
function prevImage() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = thumbs.length - 1;
    }

    renderImage(currentIndex);
}

// ---------- buttons ----------
nextBtn?.addEventListener("click", nextImage);
prevBtn?.addEventListener("click", prevImage);

// ---------- swipe ----------
let startX = 0;

mainImage.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

mainImage.addEventListener("touchend", e => {

    const endX = e.changedTouches[0].clientX;

    const diff = startX - endX;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
        nextImage();
    } else {
        prevImage();
    }

});

// ---------- keyboard ----------
document.addEventListener("keydown", e => {

    if (e.key === "ArrowLeft") {
        nextImage();
    }

    if (e.key === "ArrowRight") {
        prevImage();
    }

});

// ---------- start ----------
renderImage(0);
// =================================================

// ==================== add-favorite ==================== 
const wishBtn = document.getElementById('wishBtn');
const wishIcon = document.getElementById('wishIcon');
wishBtn.addEventListener('click', () => {
    wishBtn.classList.toggle('active');
    wishIcon.classList.toggle('ti-heart');
    wishIcon.classList.toggle('ti-heart-filled');
    wishBtn.classList.remove('pop');
    void wishBtn.offsetWidth;
    wishBtn.classList.add('pop');
    // fetch('/api/wishlist/toggle', { method: 'POST', ... })
});
// =============================================================

// ==================== add-to-shopping-cart ==================== 
document.addEventListener('DOMContentLoaded', () => Product.init());

const Product = (() => {

    // ================= STATE =================
    const state = {
        quantity: 0,
        maxQty: 10,
        inCart: false,
        productId: 123
    };

    // ================= ELEMENTS =================
    let cartBtn, cartCounter, counterNum, decreaseBtn, increaseBtn;

    let initialized = false; // 🔥 جلوگیری از دوبار init

    // ================= INIT =================
    function init() {

        if (initialized) return; // 🔥 مهم
        initialized = true;

        cartBtn = document.getElementById('cartBtn');
        cartCounter = document.getElementById('cartCounter');
        counterNum = document.getElementById('counterNum');
        decreaseBtn = document.getElementById('decreaseBtn');
        increaseBtn = document.getElementById('increaseBtn');

        if (!cartBtn) return;

        bindEvents();
        render();
    }

    // ================= EVENTS =================
    function bindEvents() {

        cartBtn.addEventListener('click', onAddToCart);
        increaseBtn?.addEventListener('click', onIncrease);
        decreaseBtn?.addEventListener('click', onDecrease);
    }

    // ================= ACTIONS =================
    function onAddToCart() {
        if (state.inCart) return;

        state.quantity = 1;
        state.inCart = true;

        Message("success", "به سبد اضافه شد");

        render();
        sync();
    }

    function onIncrease() {
        if (!state.inCart) return;

        if (state.quantity >= state.maxQty) {
            Message("error", `حداکثر ${state.maxQty} عدد`);
            return;
        }

        state.quantity++;
        render();
        sync();
    }

    function onDecrease() {
        if (!state.inCart) return;

        state.quantity--;

        if (state.quantity <= 0) {
            removeFromCart();
            return;
        }

        render();
        sync();
    }

    function removeFromCart() {
        state.quantity = 0;
        state.inCart = false;

        Message("info", "از سبد حذف شد");

        render();
        sync();
    }

    // ================= SYNC =================
    async function sync() {
        try {

            /*
            await fetch('/api/cart/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    productId: state.productId,
                    quantity: state.quantity
                })
            });
            */

        } catch (err) {
            console.error(err);

            // rollback safe
            state.quantity = 0;
            state.inCart = false;
            render();

            Message("error", "خطا در ارتباط با سرور");
        }
    }

    // ================= RENDER =================
    function render() {

        if (!cartBtn || !cartCounter || !counterNum) return;

        if (state.inCart) {
            cartBtn.classList.add('hidden');
            cartCounter.classList.add('visible');

            counterNum.textContent = state.quantity;
        } else {
            cartBtn.classList.remove('hidden');
            cartCounter.classList.remove('visible');
        }
    }

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

    return { init };

})();
