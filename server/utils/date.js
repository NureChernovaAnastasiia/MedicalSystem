function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
module.exports = { formatDate };