import { montariaStatus } from "../../core/state.js";


export function montarStatusMontaria() {
  const area = document.getElementById("areaStatusMontaria");

  area.innerHTML = `
    <div class="linha">
      ❤️ Vida: <span id="montVidaAtual">${montariaStatus.vidaAtual}</span>
      <button id="menosVidaMont">-1</button>
      <button id="maisVidaMont">+1</button>
    </div>

    <div class="linha">
      💢 Dor: <span id="montDorAtual">${montariaStatus.dorAtual}</span>
      <button id="menosDorMont">-1</button>
      <button id="maisDorMont">+1</button>
    </div>
  `;

  document.getElementById("menosVidaMont").onclick = () => {
    montariaStatus.vidaAtual = Math.max(0, montariaStatus.vidaAtual - 1);
    aplicarDanoMontaria();
    atualizarStatusMontaria();
  };

  document.getElementById("maisVidaMont").onclick = () => {
    montariaStatus.vidaAtual++;
    aplicarDanoMontaria();
    atualizarStatusMontaria();
  };

  document.getElementById("menosDorMont").onclick = () => {
    montariaStatus.dorAtual = Math.max(0, montariaStatus.dorAtual - 1);
    aplicarDanoMontaria();
    atualizarStatusMontaria();
  };

  document.getElementById("maisDorMont").onclick = () => {
    montariaStatus.dorAtual++;
    aplicarDanoMontaria();
    atualizarStatusMontaria();
  };
}

export function aplicarDanoMontaria() {
  let { vidaAtual, vidaMax, dorAtual, dorMax } = montariaStatus;

  if (vidaAtual > vidaMax) vidaAtual = vidaMax;
  if (dorAtual > dorMax) dorAtual = dorMax;

  if (dorAtual <= 0 && dorMax > 0) {
    dorAtual = dorMax;
    vidaAtual--;
  }

  if (vidaAtual < 0) vidaAtual = 0;

  montariaStatus.vidaAtual = vidaAtual;
  montariaStatus.dorAtual = dorAtual;
}

export function atualizarStatusMontaria() {
  document.getElementById("montVidaAtual").textContent = montariaStatus.vidaAtual;
  document.getElementById("montDorAtual").textContent  = montariaStatus.dorAtual;
}
