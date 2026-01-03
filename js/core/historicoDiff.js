export function gerarDiff(antes, depois) {
  const logs = [];

  // STATUS
  if (antes.status.vida !== depois.status.vida || antes.status.dor !== depois.status.dor) {
    logs.push({
      categoria: "status",
      descricao: `Vida ${antes.status.vida} → ${depois.status.vida}, Dor ${antes.status.dor} → ${depois.status.dor}`
    });
  }

  // CAVALO
  if (antes.cavalo.vida !== depois.cavalo.vida || antes.cavalo.dor !== depois.cavalo.dor) {
    logs.push({
      categoria: "cavalo",
      descricao: `🐎 Vida ${antes.cavalo.vida} → ${depois.cavalo.vida}, Dor ${antes.cavalo.dor} → ${depois.cavalo.dor}`
    });
  }

  // XP
  if (antes.xp !== depois.xp) {
    logs.push({
      categoria: "xp",
      descricao: `XP ${antes.xp} → ${depois.xp}`
    });
  }

  // DINHEIRO
  if (antes.dinheiro !== depois.dinheiro) {
    logs.push({
      categoria: "dinheiro",
      descricao: `💰 ${antes.dinheiro} → ${depois.dinheiro}`
    });
  }

  // INVENTÁRIO
  const mapaAntes = Object.fromEntries(antes.inventario.map(i => [i.nome, i.qtd]));
  const mapaDepois = Object.fromEntries(depois.inventario.map(i => [i.nome, i.qtd]));

  Object.keys(mapaDepois).forEach(nome => {
    if (!mapaAntes[nome]) {
      logs.push({ categoria: "inventario", descricao: `➕ ${nome}` });
    } else if (mapaAntes[nome] !== mapaDepois[nome]) {
      logs.push({ categoria: "inventario", descricao: `🔄 ${nome} (${mapaAntes[nome]} → ${mapaDepois[nome]})` });
    }
  });

  Object.keys(mapaAntes).forEach(nome => {
    if (!mapaDepois[nome]) {
      logs.push({ categoria: "inventario", descricao: `❌ ${nome}` });
    }
  });

  return logs;
}
