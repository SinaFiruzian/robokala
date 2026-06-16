// ==================== gallery ==================== 
const mainImage = document.getElementById("mainProductImage");
const thumbs = document.querySelectorAll(".thumb");
thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
        const thumbImage = thumb.querySelector("img");
        mainImage.src = thumbImage.src;
        document
            .querySelector(".thumb.active")
            ?.classList.remove("active");

        thumb.classList.add("active");
    });
});
// =================================================

// ==================== comment ==================== 
function toggleReply(btn) {
    const card = btn.closest('.comment-card');
    document.querySelectorAll('.reply-form.open').forEach(form => {
        if (form.closest('.comment-card') !== card) {
            form.classList.remove('open');
        }
    });
    let form = card.querySelector('.reply-form');
    if (!form) {
        form = document.createElement('div');
        form.className = 'reply-form';
        form.innerHTML = `
            <textarea rows="3" placeholder="پاسخ شما..."></textarea>
            <button class="send-reply-btn">ارسال پاسخ</button>
        `;
        form.querySelector('.send-reply-btn').addEventListener('click', () => {
            const text = form.querySelector('textarea').value;
            if (!text.trim()) return;
            // fetch('/api/comments/reply', { method: 'POST', ... })
            console.log('ارسال پاسخ:', text);
        });
        card.appendChild(form);
    }
    form.classList.toggle('open');
}
// ======================================================

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
       const cartBtn = document.getElementById('cartBtn');
        const cartCounter = document.getElementById('cartCounter');
        const counterNum = document.getElementById('counterNum');
        const decreaseBtn = document.getElementById('decreaseBtn');
        const increaseBtn = document.getElementById('increaseBtn');

        let count = 0;
        // async function syncWithServer(newCount) {
        //     try {
        //         await fetch('/api/cart/update', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ productId: 123, quantity: newCount })
        //         });
        //     } catch (err) {
        //         console.error('خطای سرور:', err);
        //     }
        // }

        cartBtn.addEventListener('click', () => {
            count = 1;
            counterNum.textContent = count;
            cartBtn.classList.add('hidden');
            cartCounter.classList.add('visible');
            syncWithServer(count);
        });

        increaseBtn.addEventListener('click', () => {
            count++;
            counterNum.textContent = count;
            syncWithServer(count);
        });

        decreaseBtn.addEventListener('click', () => {
            count--;
            if (count <= 0) {
                count = 0;
                cartCounter.classList.remove('visible');
                setTimeout(() => {
                    cartBtn.classList.remove('hidden');
                }, 200);
            } else {
                counterNum.textContent = count;
            }
            syncWithServer(count);
        });