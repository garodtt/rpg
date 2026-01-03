import { acoes } from "./xpData.js";

let contadores = [];

/* ===============================
   MONTAR LISTA DE XP
================================ */
export function montarListaXP() {
  const area = document.getElementById("listaAcoes");
  if (!area) return;

  area.innerHTML = "";
  contadores = Array(acoes.length).fill(0);

  acoes.forEach((acao, i) => {
    const div = document.createElement("div");
    div.className = "acao-item";

    div.innerHTML = `
      <span>${acao.nome} (${acao.xp} XP)</span>
      <div>
        <button onclick="alterarXP(${i}, -1)">-</button>
        <span id="cx${i}">0</span>
        <button onclick="alterarXP(${i}, 1)">+</button>
      </div>
    `;

    area.appendChild(div);
  });
}

/* ===============================
   ALTERAR XP (GANHAR / PERDER)
================================ */
export function alterarXP(i, direcao) {
  const xpInput = document.getElementById("xp");
  let xpAtual = Number(xpInput.value);

  // ➖ Tentando remover XP sem ter marcado antes
  if (direcao === -1 && contadores[i] === 0) return;

  const delta = acoes[i].xp * direcao;

  // 🚫 XP nunca pode ficar negativo
  xpAtual = Math.max(0, xpAtual + delta);
  xpInput.value = xpAtual;

  // contador visual
  contadores[i] += direcao;
  contadores[i] = Math.max(0, contadores[i]);

  const contadorEl = document.getElementById("cx" + i);
  if (contadorEl) contadorEl.textContent = contadores[i];
}
