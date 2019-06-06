const convertPagination = function (resource, currentPage) {
  const totalResult = resource.length;
  const perpage = 2;
  const pageTotal = Math.ceil(totalResult / perpage);
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  const minItem = (currentPage * perpage) - perpage + 1;
  const maxItem = (currentPage * perpage);
  const data = [];
  resource.forEach(function (item, i) {
    let itemNum = i + 1;
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item);
    }
  });
  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal
  };

  return {
    page,
    data
  };
}

module.exports = convertPagination;