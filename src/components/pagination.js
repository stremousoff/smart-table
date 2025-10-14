import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  let pageCount;
  const pageTemplate = pages.firstElementChild.cloneNode(true);

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    if (action) switch (action.name) {
      case 'prev':
        page = Math.max(1, page - 1);
        break; // переход на предыдущую страницу
      case 'next':
        page = Math.min(pageCount, page + 1);
        break; // переход на следующую страницу
      case 'first':
        page = 1;
        break; // переход на первую страницу
      case 'last':
        page = pageCount;
        break; // переход на последнюю страницу
    }

    return Object.assign({}, query, { limit, page }); // добавим параметры к query, но не изменяем исходный объект
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
    pages.replaceChildren(
      ...visiblePages.map(pageNumber => {
        const el = pageTemplate.cloneNode(true); // клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
      })
    );

    fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
    toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница
    totalRows.textContent = total; // Всего строк
  };

  return {
    updatePagination,
    applyPagination
  };
};
