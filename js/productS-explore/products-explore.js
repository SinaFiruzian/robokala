       // ================= SHOW MORE =================
        document.querySelectorAll('.filter-group').forEach(group => {
            const checks = group.querySelectorAll('.filter-check');
            if (checks.length <= 2) return;

            checks.forEach((check, i) => {
                if (i >= 2) check.style.display = 'none';
            });

            const btn = document.createElement('button');
            btn.className = 'show-more-btn';
            btn.textContent = `+ ${checks.length - 2} مورد بیشتر`;

            let isOpen = false;

            btn.addEventListener('click', () => {
                isOpen = !isOpen;
                checks.forEach((check, i) => {
                    if (i >= 2) check.style.display = isOpen ? 'flex' : 'none';
                });
                btn.textContent = isOpen ? 'بستن' : `+ ${checks.length - 2} مورد بیشتر`;
            });

            group.appendChild(btn);
        });

        // add api=============================
        // ================= APPLY FILTERS =================
        function applyFilters() {
            const params = new URLSearchParams();

            document.querySelectorAll('.filter-check input:checked').forEach(input => {
                const label = input.closest('.filter-check').textContent.trim();
                const groupTitle = input.closest('.filter-group').querySelector('h4').textContent.trim();
                params.append(groupTitle, label);
            });

            const priceMin = document.getElementById('priceMin').value;
            const priceMax = document.getElementById('priceMax').value;
            if (priceMin) params.append('priceMin', priceMin);
            if (priceMax) params.append('priceMax', priceMax);

            window.history.pushState({}, '', `?${params.toString()}`);

            // fetch('/api/products?' + params.toString())
            // .then(res => res.json())
            // .then(data => renderProducts(data));
        }

        // ================= CLEAR BTN =================
        function updateClearBtn() {
            const clearBtn = document.querySelector('.filter-clear');
            const applyBtn = document.getElementById('applyBtn');
            const priceMin = document.getElementById('priceMin');
            const priceMax = document.getElementById('priceMax');

            const hasChecked = [...document.querySelectorAll('.filter-check input')].some(i => i.checked);
            const hasPrice = priceMin?.value !== '' || priceMax?.value !== '';

            const hasActive = hasChecked || hasPrice;

            clearBtn.style.opacity = hasActive ? '1' : '0';
            clearBtn.style.pointerEvents = hasActive ? 'all' : 'none';

            applyBtn.style.opacity = hasActive ? '1' : '0';
            applyBtn.style.pointerEvents = hasActive ? 'all' : 'none';
        }

        // ================= EVENT LISTENERS =================
        document.querySelectorAll('.filter-check input').forEach(input => {
            input.addEventListener('change', updateClearBtn);
        });

        document.getElementById('priceMin')?.addEventListener('input', updateClearBtn);
        document.getElementById('priceMax')?.addEventListener('input', updateClearBtn);

        document.getElementById('applyBtn').addEventListener('click', applyFilters);

        updateClearBtn();

        // ================= FILTER RESET =================
        document.querySelector('.filter-clear').addEventListener('click', () => {
            document.querySelectorAll('.filter-check input').forEach(input => {
                input.checked = false;
            });

            document.getElementById('priceMin').value = '';
            document.getElementById('priceMax').value = '';

            updateClearBtn();
            applyFilters();
        });

        // ================= MOBILE FILTER TOGGLE =================
        const filterSidebar = document.querySelector('.filter-sidebar');
        const filterToggle = document.querySelector('.filter-mobile-toggle');

        filterToggle?.addEventListener('click', () => {
            filterSidebar.classList.toggle('mobile-open');
            filterToggle.querySelector('span').textContent =
                filterSidebar.classList.contains('mobile-open') ? 'بستن فیلترها' : 'فیلترها';
        });

        const customSelect = document.getElementById('customSelect');
        const selectedOption = document.getElementById('selectedOption');
        const optionsEl = customSelect.querySelector('.custom-select__options');

        document.body.appendChild(optionsEl);

        function positionOptions() {
            const rect = customSelect.getBoundingClientRect();
            optionsEl.style.position = 'fixed';
            optionsEl.style.top = (rect.bottom + 8) + 'px';
            optionsEl.style.left = rect.left + 'px';
            optionsEl.style.width = rect.width + 'px';
        }

        customSelect.addEventListener('click', (e) => {
            const isOpen = customSelect.classList.toggle('open');
            if (isOpen) {
                positionOptions();
                optionsEl.style.opacity = '1';
                optionsEl.style.pointerEvents = 'all';
                optionsEl.style.transform = 'translateY(0)';
            } else {
                optionsEl.style.opacity = '0';
                optionsEl.style.pointerEvents = 'none';
                optionsEl.style.transform = 'translateY(-8px)';
            }
            e.stopPropagation();
        });

        // add api=============================
        optionsEl.querySelectorAll('.custom-select__option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedOption.textContent = option.textContent;
                optionsEl.querySelectorAll('.custom-select__option')
                    .forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                customSelect.classList.remove('open');
                optionsEl.style.opacity = '0';
                optionsEl.style.pointerEvents = 'none';

                // fetch('/api/products?sort=' + option.textContent)
                // .then(res => res.json())
                // .then(data => renderProducts(data));
            });
        });

        document.addEventListener('click', () => {
            customSelect.classList.remove('open');
            optionsEl.style.opacity = '0';
            optionsEl.style.pointerEvents = 'none';
        });