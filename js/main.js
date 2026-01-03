// ===============================
// IMPORTS — CORE
// ===============================
import { abrir } from "./core/navigation.js";

// ===============================
// IMPORTS — SERVICES
// ===============================
import {
  salvarFicha,
  carregarFicha,
  listarFichas
} from "./services/fichasService.js";

// ===============================
// IMPORTS — SCREENS
// ===============================
import { novaFicha } from "./screens/fichaLoader.js";
import {
  abrirHistorico,
  fecharHistorico,
  filtrarHistorico
} from "./screens/historicoScreen.js";

// ===============================
// IMPORTS — INVENTÁRIO / CAVALO
// ===============================
import { addItem, limparInventario } from "./modules/inventario/inventario.js";
import { initCavaloUI } from "./modules/inventario/cavalo.js";

// ===============================
// IMPORTS — ARMAS
// ===============================
import { addArma, limparArmas } from "./modules/armas/armas.js";

// ===============================
// IMPORTS — HABILIDADES
// ===============================
import { addHabilidade, limparHabilidades } from "./modules/habilidades/habilidades.js";

// ===============================
// IMPORTS — GERENCIAMENTO
// ===============================
import { adicionarPersonagem } from "./modules/gerenciamento/gerenciamento.js";

// ===============================
// IMPORTS — ATRIBUTOS
// ===============================
import {
  montarCampos,
  alterarValor
} from "./modules/atributos/atributos.js";

// ===============================
// IMPORTS — STATUS
// ===============================
import { reiniciarStatus } from "./modules/status/statusPersonagem.js";

// ===============================
// IMPORTS — XP
// ===============================
import {
  montarListaXP,
  alterarXP
} from "./modules/xp/xp.js";

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initCavaloUI();
  montarListaXP();
});

// ===============================
// ⛓️ EXPOSTO PARA O HTML
// ===============================
window.abrir = abrir;

// serviços
window.salvarFicha = salvarFicha;
window.carregarFicha = carregarFicha;
window.listarFichas = listarFichas;

// ficha
window.novaFicha = novaFicha;

// histórico
window.abrirHistorico = abrirHistorico;
window.fecharHistorico = fecharHistorico;
window.filtrarHistorico = filtrarHistorico;

// inventário
window.addItem = addItem;
window.limparInventario = limparInventario;

// armas
window.addArma = addArma;
window.limparArmas = limparArmas;

// habilidades
window.addHabilidade = addHabilidade;
window.limparHabilidades = limparHabilidades;

// gerenciamento
window.adicionarPersonagem = adicionarPersonagem;

// atributos
window.montarCampos = montarCampos;
window.alterarValor = alterarValor;

// status
window.reiniciarStatus = reiniciarStatus;

// XP
window.alterarXP = alterarXP;
