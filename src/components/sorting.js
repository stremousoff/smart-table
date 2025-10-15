import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === 'sort') {
      // Сохраняем и применяем как текущее следующее состояние из карты
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // Сброс сортировок остальных колонок
      columns.forEach(column => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = 'none';
        }
      });
    } else {
      // Получаем выбранный режим сортировки
      columns.forEach(column => {
        if (column.dataset.value !== 'none') {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Формируем параметр сортировки в виде field:direction
    const sort = (field && order !== 'none') ? `${field}:${order}` : null;

    // Добавляем его в query, если сортировка есть
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
