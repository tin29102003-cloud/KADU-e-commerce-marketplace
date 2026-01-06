export function formatMoney(money: number) {
  return money.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
export function buildPagination(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const delta = 1;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);
  pages.push(1);
  if (left > 2) {
    pages.push("...");
  }
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }
  if (right < totalPages - 1) {
    pages.push("...");
  }
  pages.push(totalPages);
  return pages;
}

export const formatDateVN = (
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!dateStr) return "";
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("vi-VN", options ?? defaultOptions).format(
    new Date(dateStr)
  );
};
