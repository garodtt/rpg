// ===============================
// IMPORTS
// ===============================
import { supabaseClient } from "../config/supabase.js";
import { gerarHash } from "../core/utils.js";
import { abrir } from "../core/navigation.js";

import {
  atributoValores,
  antecedenteValores
} from "../core/atributosData.js";

import {
  statusValores,
  montariaStatus,
  cavaloAtivo,
  fichaAtualId,
  setFichaAtualId
} from "../core/state.js";

import { preencherFormularioComFicha } from "../screens/fichaLoader.js";

// ===============================
// SALVAR FICHA
// ===============================
export async function salvarFicha() {
  if (!supabaseClient) return alert("Supabase não configurado.");

  const nome = document.getElementById("nomePersonagem").value.trim();
  if (!nome) return alert("Digite o nome do personagem.");

  const senha = prompt("Digite a senha da ficha:");
  if (!senha) return alert("Senha obrigatória!");

  const senhaHash = await gerarHash(senha);

  const habilidades = [...document.querySelectorAll("#listaHabilidades li")].map(li => ({
    nome: li.dataset.nome,
    desc: li.dataset.desc
  }));

  const armas = [...document.querySelectorAll("#listaArmas li")].map(li => ({
    nome: li.dataset.nome,
    dano: Number(li.dataset.dano),
    tipo: li.dataset.tipoDano,
    municaoAtual: Number(li.dataset.municaoAtual),
    municaoMax: Number(li.dataset.municaoMax)
  }));

  const inventario = [
    ...document.querySelectorAll("#listaInventario li"),
    ...document.querySelectorAll("#listaInventarioCavalo li")
  ].map(li => ({
    nome: li.querySelector("strong")?.textContent || "",
    peso: Number(li.dataset.peso),
    qtd: Number(li.dataset.qtd),
    cavalo: li.dataset.cavalo === "1"
  }));

  const payload = {
    nome,
    habilidade: habilidades,
    arma: armas,
    inventario,

    dinheiro: Number(document.getElementById("dinheiro").value) || 0,
    xp: Number(document.getElementById("xp").value),

    atributo: JSON.stringify(atributoValores),
    antecedente: JSON.stringify(antecedenteValores),

    vida: statusValores.vidaAtual,
    vida_max: statusValores.vidaMax,
    dor: statusValores.dorAtual,
    dor_max: statusValores.dorMax,

    tipo_cavalo: cavaloAtivo
      ? document.getElementById("tipoCavalo").value
      : "",

    montaria_nome: document.getElementById("montariaNome").value || "",
    montaria_nivel: Number(document.getElementById("montariaNivel").value) || 0,
    montaria_vida: montariaStatus.vidaAtual,
    montaria_vida_max: montariaStatus.vidaMax,
    montaria_dor: montariaStatus.dorAtual,
    montaria_dor_max: montariaStatus.dorMax
  };

  try {
    let query;

    if (fichaAtualId) {
      query = supabaseClient
        .from("fichas")
        .update(payload)
        .eq("id", fichaAtualId);
    } else {
      payload.senha_hash = senhaHash;
      query = supabaseClient
        .from("fichas")
        .insert(payload);
    }

    const { error } = await query;
    if (error) throw error;

    alert("✅ Ficha salva com sucesso!");
    listarFichas();
  } catch (err) {
    alert("Erro ao salvar: " + err.message);
    console.error(err);
  }
}

// ===============================
// CARREGAR FICHA
// ===============================
export async function carregarFicha(id) {
  const senha = prompt("Digite a senha da ficha:");
  if (!senha) return;

  const senhaHash = await gerarHash(senha);

  const { data, error } = await supabaseClient
    .from("fichas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return alert("Erro ao carregar ficha.");
  if (data.senha_hash !== senhaHash) return alert("❌ Senha incorreta!");

  setFichaAtualId(data.id);
  abrir("ficha");
  preencherFormularioComFicha(data);
}

// ===============================
// LISTAR FICHAS
// ===============================
export async function listarFichas() {
  const lista = document.getElementById("listaFichas");
  lista.innerHTML = "Carregando...";

  const { data, error } = await supabaseClient
    .from("fichas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    lista.innerHTML = "Erro ao carregar fichas.";
    return;
  }

  lista.innerHTML = "";
  data.forEach(f => {
    const div = document.createElement("div");
    div.className = "box";
    div.innerHTML = `
      <strong>${f.nome}</strong><br>
      XP: ${f.xp}<br>
      <button onclick="carregarFicha('${f.id}')">Carregar</button>
    `;
    lista.appendChild(div);
  });
}
