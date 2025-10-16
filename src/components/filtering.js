export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const options = Object.values(indexes[elementName]).map((name) => {
        const el = document.createElement('option');
        el.textContent = name;
        el.value = name;
        return el;
      });

      elements[elementName].append(...options);
    });
  };

  const applyFiltering = (query, state, action) => {
    // Обработка очистки поля фильтра
    if (action && action.name === 'clear') {
      const fieldName = action.dataset.field;

      if (state[fieldName] !== undefined) {
        state[fieldName] = '';
      }
    }

    // Обновляем значения в полях формы на основе state
    Object.keys(state).forEach((key) => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = state[key] || '';
      }
    });

    // Формируем фильтр на основе непустых полей
    const filter = {};

    Object.keys(elements).forEach((key) => {
      const el = elements[key];

      if (el && ['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
        // добавляем в объект фильтра
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    // Возвращаем обновлённый query, если фильтр не пуст
    return Object.keys(filter).length
      ? { ...query, ...filter }
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
