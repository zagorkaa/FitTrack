// ######Starts from here######
// Category, price, brand and flavour filtering for the products pages.
// Each .product-card needs: data-category, data-price, data-brand, data-flavour
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.products-grid .product-card');
    const categoryLinks = document.querySelectorAll('.categories a[data-category]');
    const priceRange = document.getElementById('price-range');
    const priceMaximum = document.getElementById('price-maximum');
    const clearButton = document.getElementById('clear-filters');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.querySelector('.results-count');

    // Start from ?category=... in the URL, otherwise from the selected <li>
    const urlCategory = new URLSearchParams(window.location.search).get('category');
    const selectedLink = document.querySelector('.categories li.selected a[data-category]');
    let activeCategory = urlCategory || (selectedLink ? selectedLink.dataset.category : 'all');

    function getChecked(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
            .map(input => input.value);
    }

    function markSelectedCategory() {
        categoryLinks.forEach(link => {
            link.parentElement.classList.toggle('selected', link.dataset.category === activeCategory);
        });
    }

    function applyFilters() {
        const maxPrice = Number(priceRange.value);
        const brands = getChecked('brand');
        const flavours = getChecked('flavour');
        let visible = 0;

        if (priceMaximum) priceMaximum.textContent = `$${maxPrice}`;

        cards.forEach(card => {
            const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
            const matchesPrice = Number(card.dataset.price) <= maxPrice;
            const matchesBrand = brands.length === 0 || brands.includes(card.dataset.brand);
            const matchesFlavour = flavours.length === 0 || flavours.includes(card.dataset.flavour);

            const show = matchesCategory && matchesPrice && matchesBrand && matchesFlavour;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
        if (resultsCount) resultsCount.textContent = `Showing ${visible} of ${cards.length} results`;
    }

    // Category links filter in place instead of opening a separate page
    categoryLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            activeCategory = link.dataset.category;
            markSelectedCategory();
            applyFilters();

            const url = activeCategory === 'all'
                ? window.location.pathname
                : `${window.location.pathname}?category=${activeCategory}`;
            history.replaceState(null, '', url);
        });
    });

    priceRange.addEventListener('input', applyFilters);
    document.querySelectorAll('input[name="brand"], input[name="flavour"]')
        .forEach(input => input.addEventListener('change', applyFilters));

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            document.querySelectorAll('input[name="brand"], input[name="flavour"]')
                .forEach(input => input.checked = false);
            priceRange.value = priceRange.max;
            applyFilters();
        });
    }

    markSelectedCategory();
    applyFilters();
});
// ######Ends here######
