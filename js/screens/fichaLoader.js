// ===============================
// IMPORTS — STATE
// ===============================
import {
  fichaAtualId,
  setFichaAtualId,
  statusValores,
  montariaStatus,
  setPesoAtual,
  setPesoCavaloAtual,
  setPesoCavaloMax,
  setCavaloAtivo
} from "../core/state.js";

// ===============================
// IMPORTS — DATA
// ===============================
import {
  antecedentes,
  atributos,
  antecedenteValores,
  atributoValores
} from "../core/atributosData.js";

// ===============================
// IMPORTS — CORE
// ===============================
import { normalizarId } from "../core/utils.js";
import { abrir } from "../core/navigation.js";

// ===============================
// IMPORTS — MODULES
// ===============================
import { montarCampos } from "../modules/atributos/atributos.js";

import {
  montarStatus,
  aplicarDano,
  inicializarStatus
} from "../modules/status/statusPersonagem.js";

import { montarStatusMontaria } from "../modules/status/statusMontaria.js";

import {
  limparInventario,
  renderItemInventario
} from "../modules/inventario/inventario.js";

import { atualizarPesoCavalo } from "../modules/inventario/cavalo.js";

import { limparArmas, aplicarEventosArma } from "../modules/armas/armas.js";
import { limparHabilidades } from "../modules/habilidades/habilidades.js";

// ===============================
// ELEMENTOS FIXOS
// ===============================
const selectTipoCavalo = document.getElementById("tipoCavalo");

// ======================================================
// CARREGAR FICHA
// ======================================================
export function preencherFormularioComFicha(f) {

  // ===============================
  // BÁSICO
  // ===============================
  document.getElementById("nomePersonagem").value = f.nome ?? "";
  document.getElementById("xp").value = f.xp ?? 0;
  document.getElementById("dinheiro").value = f.dinheiro ?? 0;

  // ===============================
  // ANTECEDENTES
  // ===============================
  const ant = typeof f.antecedente === "string"
    ? JSON.parse(f.antecedente)
    : f.antecedente || {};

  antecedentes.forEach(n => antecedenteValores[n] = ant[n] ?? 0);

  // ===============================
  // ATRIBUTOS
  // ===============================
  const atr = typeof f.atributo === "string"
    ? JSON.parse(f.atributo)
    : f.atributo || {};

  atributos.forEach(n => atributoValores[n] = atr[n] ?? 0);

  // 🔹 MONTA A UI PRIMEIRO
  montarCampos();

  // 🔹 ATUALIZA VALORES VISUAIS
  antecedentes.forEach(n => {
    const el = document.getElementById("ante_" + normalizarId(n));
    if (el) el.textContent = antecedenteValores[n];
  });

  atributos.forEach(n => {
    const el = document.getElementById("atrib_" + normalizarId(n));
    if (el) el.textContent = atributoValores[n];
  });

  // ===============================
  // STATUS PERSONAGEM
  // ===============================
  statusValores.vidaMax   = f.vida_max ?? 10;
  statusValores.dorMax    = f.dor_max ?? 10;
  statusValores.vidaAtual = f.vida ?? statusValores.vidaMax;
  statusValores.dorAtual  = f.dor ?? statusValores.dorMax;

  document.getElementById("vidaMaxInput").value = statusValores.vidaMax;
  document.getElementById("dorMaxInput").value  = statusValores.dorMax;

  montarStatus();
  aplicarDano();

  // ===============================
  // INVENTÁRIO
  // ===============================
  document.getElementById("listaInventario").innerHTML = "";
  document.getElementById("listaInventarioCavalo").innerHTML = "";

  setPesoAtual(0);
  setPesoCavaloAtual(0);

  let inventario = f.inventario;
  if (typeof inventario === "string") {
    inventario = JSON.parse(inventario);
  }

  if (Array.isArray(inventario)) {
    inventario.forEach(item => renderItemInventario(item));
  }

  // ===============================
  // CAVALO / PESO
  // ===============================
  if (f.tipo_cavalo) {
    selectTipoCavalo.value = f.tipo_cavalo;
    selectTipoCavalo.dispatchEvent(new Event("change"));
  } else {
    selectTipoCavalo.value = "";
    setCavaloAtivo(false);
    setPesoCavaloMax(0);
    atualizarPesoCavalo();
  }

  // ===============================
  // ARMAS
  // ===============================
  limparArmas();

  if (Array.isArray(f.arma)) {
    f.arma.forEach(a => {
      const li = document.createElement("li");

      li.dataset.nome = a.nome;
      li.dataset.dano = a.dano;
      li.dataset.tipoDano = a.tipo;
      li.dataset.municaoAtual = a.municaoAtual;
      li.dataset.municaoMax = a.municaoMax;

      li.innerHTML = `
        <strong>${a.nome}</strong>
        — Dano: ${a.dano} (${a.tipo})
        — Munição: <span class="municao">${a.municaoAtual}</span>
        <button class="menosMunicao">-1</button>
        <button class="maisMunicao">+1</button>
        <button class="recarregar" style="display:none">Recarregar</button>
        <button class="removerArma">🗑️</button>
      `;

      aplicarEventosArma(li);
      document.getElementById("listaArmas").appendChild(li);
    });
  }

  // ===============================
  // HABILIDADES
  // ===============================
  limparHabilidades();

  if (Array.isArray(f.habilidade)) {
    f.habilidade.forEach(h => {
      const li = document.createElement("li");
      li.dataset.nome = h.nome;
      li.dataset.desc = h.desc;

      li.innerHTML = `
        <strong>${h.nome}</strong> — ${h.desc}
        <button class="removerHabilidade">🗑️</button>
      `;

      li.querySelector("button").onclick = () => li.remove();
      document.getElementById("listaHabilidades").appendChild(li);
    });
  }

  // ===============================
  // STATUS MONTARIA
  // ===============================
  document.getElementById("montariaNome").value = f.montaria_nome ?? "";
  document.getElementById("montariaNivel").value = f.montaria_nivel ?? 0;

  montariaStatus.vidaMax   = f.montaria_vida_max ?? 10;
  montariaStatus.dorMax    = f.montaria_dor_max ?? 10;
  montariaStatus.vidaAtual = f.montaria_vida ?? montariaStatus.vidaMax;
  montariaStatus.dorAtual  = f.montaria_dor ?? montariaStatus.dorMax;

  document.getElementById("montariaVidaMaxInput").value = montariaStatus.vidaMax;
  document.getElementById("montariaDorMaxInput").value  = montariaStatus.dorMax;

  montarStatusMontaria();
}

// ======================================================
// NOVA FICHA
// ======================================================
export function novaFicha() {

  setFichaAtualId(null);

  document.getElementById("nomePersonagem").value = "";
  document.getElementById("xp").value = 0;
  document.getElementById("dinheiro").value = 0;
  document.getElementById("pesoMax").value = 10;

  limparHabilidades();
  limparArmas();
  limparInventario();

  // 🔹 MONTA UI
  montarCampos();

  // 🔹 RESET ANTECEDENTES
  Object.keys(antecedenteValores).forEach(k => {
    antecedenteValores[k] = 0;
    const el = document.getElementById("ante_" + normalizarId(k));
    if (el) el.textContent = 0;
  });

  // 🔹 RESET ATRIBUTOS
  Object.keys(atributoValores).forEach(k => {
    atributoValores[k] = 0;
    const el = document.getElementById("atrib_" + normalizarId(k));
    if (el) el.textContent = 0;
  });

  inicializarStatus(10, 10);

  setCavaloAtivo(false);
  setPesoAtual(0);
  setPesoCavaloAtual(0);
  setPesoCavaloMax(0);
  atualizarPesoCavalo();

  abrir("ficha");
}
