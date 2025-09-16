document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('delivery-form');
    const titleEl = document.getElementById('title');
    const weightEl = document.getElementById('weight');
    const distEl = document.getElementById('distance');
    const tbody = document.getElementById('products-body');
    const submitBtn = document.getElementById('delivery-submit');

    if (!form || !titleEl || !weightEl || !distEl || !tbody) return;
    if (submitBtn) submitBtn.disabled = false;

    function calcCost(weight, distance) {
        return (weight * distance) / 10;
    }
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        titleEl.setCustomValidity('');
        weightEl.setCustomValidity('');
        distEl.setCustomValidity('');

        weightEl.value = (weightEl.value || '').replace(/,/g, '.').trim();
        distEl.value = (distEl.value || '').replace(/,/g, '.').trim();

        if (!form.checkValidity()) {
            form.reportValidity()
        return;
        }

        const title = titleEl.value.trim();
        const weight = weightEl.valueAsNumber;
        const distance = distEl.valueAsNumber;

        let hasErr = false;
        if (!title) {
            titleEl.setCustomValidity('Введите название товара');
            hasErr = true;
        }
        if (!Number.isFinite(weight) || weight <= 0) {
            weightEl.setCustomValidity('Вес должен быть > 0');
            hasErr = true;
        }
        if (!Number.isFinite(distance) || distance <= 0) {
            distEl.setCustomValidity('Расстояние должно быть > 0');
            hasErr = true;
        }
        if (hasErr) {
            form.reportValidity();
            titleEl.setCustomValidity('');
            weightEl.setCustomValidity('');
            distEl.setCustomValidity('');
            return;
        }

        const cost = calcCost(weight, distance);

        const tr = document.createElement('tr');
        [title, String(weight), String(distance), `${cost.toFixed(2)} руб.`]
            .forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
        tbody.appendChild(tr);

        form.reset();
        titleEl.focus();
    });
});