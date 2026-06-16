//===================== navbar =====================
 const island = document.getElementById('island');
        const Byisland = document.getElementById('Byisland');
        let peeked = false;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 80 && !peeked) {
                peeked = true;
                island.classList.add('peeked');
                byLogo.classList.add('Bypeeked');
                bybtn.classList.add('Bypeeked');
            } else if (window.scrollY <= 80 && peeked) {
                peeked = false;
                island.classList.remove('peeked');
                byLogo.classList.remove('Bypeeked');
                bybtn.classList.remove('Bypeeked');
            }
        }, { passive: true });

/* ===================== searchbar ===================== */
   const searchBtn = document.getElementById("searchBtn");
        const searchWrapper = document.getElementById("searchWrapper");
        const searchInput = document.getElementById("searchInput");

        searchBtn.addEventListener("click", () => {

            // اگر باز نیست، بازش کن
            if (!searchWrapper.classList.contains("active")) {
                searchWrapper.classList.add("active");

                setTimeout(() => {
                    searchInput.focus();
                }, 300);

                return;
            }

            // اگر بازه، عملیات سرچ انجام بده
            console.log(searchInput.value);
        });
        document.addEventListener("click", (e) => {
            if (!searchWrapper.contains(e.target)) {
                searchWrapper.classList.remove("active");
            }
        });