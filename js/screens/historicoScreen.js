import { capturarSnapshot } from "../core/historicoSnapshot.js";
import { gerarDiff } from "../core/historicoDiff.js";
import { salvarHistorico, carregarHistorico } from "../services/historicoService.js";

let snapshotAnterior = null;
let historicoCache = [];

export async function abrirHistorico() {
  const atual = capturarSnapshot();

  if (snapshotAnterior) {
    const diff = gerarDiff(snapshotAnterior, atual);
    await salvarHistorico(diff);
  }

  snapshotAnterior = atual;

  historicoCache = await carregarHistorico();
  document.getElementById("modalHistorico").style.display = "block";
  filtrarHistorico("status");
}

export function fecharHistorico() {
  document.getElementById("modalHistorico").style.display = "none";
}

export function filtrarHistorico(categoria) {
  const area = document.getElementById("historicoLista");
  area.innerHTML = "";

  historicoCache
    .filter(h => h.categoria === categoria)
    .forEach(h => {
      const div = document.createElement("div");
      div.className = "box";

      const data = new Date(h.created_at).toLocaleString("pt-BR");

      div.innerHTML = `
        <strong>${data}</strong><br>
        ${h.descricao}
      `;

      area.appendChild(div);
    });
}
