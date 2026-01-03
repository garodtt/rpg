import {
  statusValores,
  montariaStatus
} from "./state.js";

export function capturarSnapshot() {
  return {
    status: {
      vida: statusValores.vidaAtual,
      dor: statusValores.dorAtual
    },

    cavalo: {
      vida: montariaStatus.vidaAtual,
      dor: montariaStatus.dorAtual
    },

    xp: Number(document.getElementById("xp").value),
    dinheiro: Number(document.getElementById("dinheiro").value),

    inventario: [
      ...document.querySelectorAll("#listaInventario li"),
      ...document.querySelectorAll("#listaInventarioCavalo li")
    ].map(li => ({
      nome: li.querySelector("strong")?.textContent || "",
      qtd: Number(li.dataset.qtd),
      cavalo: li.dataset.cavalo === "1"
    }))
  };
}
