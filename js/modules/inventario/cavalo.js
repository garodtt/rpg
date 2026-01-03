import {
  cavaloAtivo,
  pesoCavaloAtual,
  pesoCavaloMax,
  setCavaloAtivo,
  setPesoCavaloMax
} from "../../core/state.js";

/* ===============================
   ATUALIZA UI DE PESO DO CAVALO
================================ */
export function atualizarPesoCavalo() {
  const elAtual = document.getElementById("pesoCavaloAtual");
  const elMax   = document.getElementById("pesoCavaloMax");
  const elPesoPersonagem = document.getElementById("pesoAtual");

  if (elAtual) elAtual.textContent = pesoCavaloAtual;
  if (elMax)   elMax.textContent   = pesoCavaloMax;

  // peso do personagem vem do input (somente leitura)
  if (elPesoPersonagem) {
    elPesoPersonagem.value = document
      .querySelectorAll("#listaInventario li")
      .length
      ? elPesoPersonagem.value
      : elPesoPersonagem.value;
  }
}

/* ===============================
   INIT UI DO CAVALO
================================ */
export function initCavaloUI() {
  const btnStatus = document.getElementById("btnCavaloStatus");
  const statusBox = document.getElementById("statusCavalo");
  const select = document.getElementById("tipoCavalo");
  const boxCavalo = document.getElementById("boxCavalo");
  const flagBtn = document.getElementById("flagCavalo");

  if (!btnStatus || !select || !flagBtn) return;

  // 🐎 MOSTRAR / ESCONDER STATUS
  btnStatus.onclick = () => {
    statusBox.style.display =
      statusBox.style.display === "none" ? "block" : "none";
  };

  // 🐎 TROCA TIPO DO CAVALO
  select.onchange = () => {
    const capacidade = Number(select.value);

    if (!capacidade) {
      setCavaloAtivo(false);
      setPesoCavaloMax(0);
      boxCavalo.style.display = "none";
      flagBtn.style.opacity = 0.4;
      atualizarPesoCavalo();
      return;
    }

    setCavaloAtivo(true);
    setPesoCavaloMax(capacidade);
    boxCavalo.style.display = "block";
    flagBtn.style.opacity = 1;
    atualizarPesoCavalo();
  };

  // 🐎 FLAG ENVIAR ITEM PARA CAVALO
  flagBtn.onclick = () => {
    flagBtn.classList.toggle("ativo");
    flagBtn.style.opacity = flagBtn.classList.contains("ativo") ? 1 : 0.4;
  };
}
