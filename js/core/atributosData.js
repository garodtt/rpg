// LISTAS
export const antecedentes = [
  "atenção",
  "medicina",
  "montaria",
  "negócios",
  "roubo",
  "suor",
  "tradição",
  "violência"
];

export const atributos = [
  "Físico",
  "Velocidade",
  "Intelecto",
  "Coragem"
];

// VALORES
export const antecedenteValores = {};
export const atributoValores = {};

// INICIALIZA COM ZERO
antecedentes.forEach(a => antecedenteValores[a] = 0);
atributos.forEach(a => atributoValores[a] = 0);
