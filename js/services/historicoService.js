import { supabaseClient } from "../config/supabase.js";
import { fichaAtualId } from "../core/state.js";

export async function salvarHistorico(registros) {
  if (!fichaAtualId || !registros.length) return;

  const payload = registros.map(r => ({
    ficha_id: fichaAtualId,
    categoria: r.categoria,
    descricao: r.descricao
  }));

  await supabaseClient.from("historico_ficha").insert(payload);
}

export async function carregarHistorico() {
  const { data } = await supabaseClient
    .from("historico_ficha")
    .select("*")
    .eq("ficha_id", fichaAtualId)
    .order("created_at", { ascending: false });

  return data || [];
}
