export function downloadCSV(data: Record<string, string | number>[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];
  for (const row of data) {
    const values = headers.map((h) => {
      const val = row[h]?.toString() ?? "";
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }
  const bom = "\uFEFF";
  const csvString = bom + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
