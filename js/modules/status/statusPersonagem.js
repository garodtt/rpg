import { statusValores } from "../../core/state.js";


export function montarStatus() {
  const area = document.getElementById("areaStatus");

  area.innerHTML = `
    <div class="linha">
      ❤️ Vida: <span id="vidaAtual">${statusValores.vidaAtual}</span>
      <button id="menosVida">-1</button>
      <button id="maisVida">+1</button>
    </div>

    <div class="linha">
      💢 Dor: <span id="dorAtual">${statusValores.dorAtual}</span>
      <button id="menosDor">-1</button>
      <button id="maisDor">+1</button>
    </div>
  `;

  // ➖ VIDA
  document.getElementById("menosVida").onclick = () => {
    statusValores.vidaAtual = Math.max(0, statusValores.vidaAtual - 1);
    aplicarDano();
    atualizarStatus();
  };

  // ➕ VIDA
  document.getElementById("maisVida").onclick = () => {
    statusValores.vidaAtual++;
    aplicarDano();
    atualizarStatus();
  };

  // ➖ DOR
  document.getElementById("menosDor").onclick = () => {
    statusValores.dorAtual--;
    aplicarDano();
    atualizarStatus();
  };

  // ➕ DOR
  document.getElementById("maisDor").onclick = () => {
    statusValores.dorAtual++;
    aplicarDano();
    atualizarStatus();
  };
}

export function aplicarDano() {
  let { vidaAtual, vidaMax, dorAtual, dorMax } = statusValores;

  // limites superiores
  if (vidaAtual > vidaMax) vidaAtual = vidaMax;
  if (dorAtual > dorMax) dorAtual = dorMax;

  // quebra de resistência
  if (dorAtual <= 0 && dorMax > 0) {
    dorAtual = dorMax;
    vidaAtual--;
  }

  // 🚫 vida nunca abaixo de 0
  if (vidaAtual < 0) vidaAtual = 0;

  statusValores.vidaAtual = vidaAtual;
  statusValores.dorAtual = dorAtual;

  const nomeInput = document.getElementById("nomePersonagem");
  const icone = document.getElementById("iconeMorte");

  if (vidaAtual === 0) {
    nomeInput.classList.add("personagem-caido");
    icone.style.display = "inline";
  } else {
    nomeInput.classList.remove("personagem-caido");
    icone.style.display = "none";
  }
}

export function atualizarStatus() {
  document.getElementById("vidaAtual").textContent = statusValores.vidaAtual;
  document.getElementById("dorAtual").textContent = statusValores.dorAtual;
}

export function inicializarStatus(vida, dor) {
  statusValores.vidaMax = vida;
  statusValores.vidaAtual = vida;
  statusValores.dorMax = dor;
  statusValores.dorAtual = dor;
  montarStatus();
}

export function reiniciarStatus() {
  const vida = Number(document.getElementById("vidaMaxInput").value);
  const dor = Number(document.getElementById("dorMaxInput").value);

  if (vida > 0 && dor > 0) {
    inicializarStatus(vida, dor);
  }
}