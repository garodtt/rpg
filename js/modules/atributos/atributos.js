import {
  antecedentes,
  atributos,
  antecedenteValores,
  atributoValores
} from "../../core/atributosData.js";

import { normalizarId } from "../../core/utils.js";

export function montarCampos(){
  const A = document.getElementById("areaAntecedentes");
  const B = document.getElementById("areaAtributos");

  if (!A || !B) return;

  A.innerHTML = "";
  B.innerHTML = "";

  antecedentes.forEach(a => A.appendChild(criarLinha(a, "ante")));
  atributos.forEach(a => B.appendChild(criarLinha(a, "atrib")));
}

function criarLinha(nome, tipo){
  const div = document.createElement("div");
  div.className = "counter-line";

  const id = `${tipo}_${normalizarId(nome)}`;

  div.innerHTML = `
    <span>${nome}</span>
    <div>
      <button onclick="alterarValor('${nome}', -1, '${tipo}')">-</button>
      <span id="${id}">0</span>
      <button onclick="alterarValor('${nome}', 1, '${tipo}')">+</button>
    </div>
  `;

  return div;
}

export function alterarValor(nome, delta, tipo){
  if(tipo === "ante"){
    antecedenteValores[nome] = Math.max(0, antecedenteValores[nome] + delta);
    document.getElementById(
      "ante_" + normalizarId(nome)
    ).textContent = antecedenteValores[nome];
  } 
  else {
    atributoValores[nome] = Math.max(0, atributoValores[nome] + delta);
    document.getElementById(
      "atrib_" + normalizarId(nome)
    ).textContent = atributoValores[nome];
  }
}
