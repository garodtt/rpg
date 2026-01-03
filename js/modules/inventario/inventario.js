// ===============================
// IMPORTS — STATE (SEMPRE NO TOPO)
// ===============================
import {
  pesoAtual,
  pesoCavaloAtual,
  pesoCavaloMax,
  cavaloAtivo,
  setPesoAtual,
  setPesoCavaloAtual
} from "../../core/state.js";

import { atualizarPesoCavalo } from "./cavalo.js";

// ===============================
// ELEMENTOS DOM
// ===============================
const listaInventario = document.getElementById("listaInventario");
const listaInventarioCavalo = document.getElementById("listaInventarioCavalo");

const itemNome = document.getElementById("itemNome");
const itemDesc = document.getElementById("itemDesc");
const itemPeso = document.getElementById("itemPeso");
const itemQtd  = document.getElementById("itemQtd");
const flagBtn  = document.getElementById("flagCavalo");

// ===============================
// UTIL
// ===============================
function enviarParaCavalo() {
  return flagBtn?.classList.contains("ativo");
}

// ===============================
// ADICIONAR ITEM
// ===============================
export function addItem() {

  const nome = itemNome.value.trim();
  const desc = itemDesc.value.trim();
  const peso = Number(itemPeso.value);
  const qtd  = Number(itemQtd.value || 1);

  if (!nome || peso <= 0 || qtd <= 0) return;

  const pesoTotal = peso * qtd;

  const vaiParaCavalo = enviarParaCavalo() && cavaloAtivo;

  if (vaiParaCavalo) {
    if (pesoCavaloAtual + pesoTotal > pesoCavaloMax) {
      alert("Peso excede a capacidade do cavalo");
      return;
    }
    setPesoCavaloAtual(pesoCavaloAtual + pesoTotal);
  } else {
    setPesoAtual(pesoAtual + pesoTotal);
  }

  const item = {
    nome,
    desc,
    peso,
    qtd,
    cavalo: vaiParaCavalo
  };

  renderItemInventario(item);

  itemNome.value = "";
  itemDesc.value = "";
  itemPeso.value = "";
  itemQtd.value  = 1;

  atualizarPesoCavalo();
}

// ===============================
// RENDER ITEM
// ===============================
export function renderItemInventario(item) {

  const li = document.createElement("li");

  li.dataset.peso = item.peso;
  li.dataset.qtd = item.qtd;
  li.dataset.cavalo = item.cavalo ? "1" : "0";

  li.innerHTML = `
    <strong>${item.nome}</strong>
    (${item.qtd}x — ${item.peso}kg)
    <button class="remover">🗑️</button>
    <div class="desc">${item.desc || ""}</div>
  `;

  li.querySelector(".remover").onclick = () => {
    const pesoTotal = item.peso * item.qtd;

    if (item.cavalo) {
      setPesoCavaloAtual(pesoCavaloAtual - pesoTotal);
    } else {
      setPesoAtual(pesoAtual - pesoTotal);
    }

    li.remove();
    atualizarPesoCavalo();
  };

  if (item.cavalo) {
    listaInventarioCavalo.appendChild(li);
  } else {
    listaInventario.appendChild(li);
  }
}

// ===============================
// LIMPAR INVENTÁRIO
// ===============================
export function limparInventario() {
  listaInventario.innerHTML = "";
  listaInventarioCavalo.innerHTML = "";

  setPesoAtual(0);
  setPesoCavaloAtual(0);

  atualizarPesoCavalo();
}
