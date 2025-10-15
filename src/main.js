import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// API
const api = initData(sourceData);

// Инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter', 'search'],
    after: ['pagination'],
  },
  render
);

// Пагинация
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Сортировка
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);

// Поиск
const applySearching = initSearching('search');

// Фильтрация
// const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements, { searchBySeller: indexes.sellers });


// collectState: собираем состояние таблицы
const collectState = () => {
  const state = processFormData(new FormData(sampleTable.container));
  return {
    ...state,
    rowsPerPage: parseInt(state.rowsPerPage),
    page: parseInt(state.page ?? 1)
  };
};

// render: перерисовка таблицы
async function render(action) {
  const state = collectState();
  let query = {};

  // Применяем поиск, фильтрацию, сортировку и пагинацию в правильном порядке:
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  // Теперь получаем уже отфильтрованные данные
  const { total, items } = await api.getRecords(query);

  // Обновляем пагинацию и отрисовываем таблицу
  updatePagination(total, query);
  sampleTable.render(items);
}

let applyFiltering;
let updateIndexes;

// Инициализация фильтров после получения индексов
const init = async () => {
  const indexes = await api.getIndexes();
  // const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements, { searchBySeller: indexes.sellers });
  ({ applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements));
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
  });

};

// Монтируем таблицу и запускаем
document.querySelector('#app').appendChild(sampleTable.container);
init().then(render);
