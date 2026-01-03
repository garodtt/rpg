export let fichaAtualId = null;

export function setFichaAtualId(id) {
  fichaAtualId = id;
}

export const statusValores = { vidaAtual:0, vidaMax:0, dorAtual:0, dorMax:0 };
export const montariaStatus = { vidaAtual:10, vidaMax:10, dorAtual:10, dorMax:10 };

export let pesoAtual = 0;
export let pesoCavaloAtual = 0;
export let pesoCavaloMax = 0;
export let cavaloAtivo = false;

export function setPesoAtual(v) {
  pesoAtual = v;
}

export function setPesoCavaloAtual(v) {
  pesoCavaloAtual = v;
}

export function setPesoCavaloMax(v) {
  pesoCavaloMax = v;
}

export function setCavaloAtivo(v) {
  cavaloAtivo = v;
}


