import api from "./api";

export async function addCredential(data) {
  const res = await api.post("/vault/add", data);
  return res.data;
}

export async function editCredential(id, data) {
  const res = await api.put(`/vault/edit/${id}`, data);
  return res.data;
}

export async function deleteCredential(id) {
  const res = await api.delete(`/vault/delete/${id}`);
  return res.data;
}

export async function exportCSV() {
  const res = await api.get("/vault/export/csv", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "vault.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function exportPDF() {
  const res = await api.get("/vault/export/pdf", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "vault.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
