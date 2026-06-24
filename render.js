// Renderizador do relatório MigraLog. Hospedado standalone (com report-codec.js ao lado).
// renderReport(data) -> string com o HTML interno de <div class="doc">.
// data pode vir empacotada (do #fragment) ou rica; unpackReport normaliza (ver Task 13).
import { unpackReport } from './report-codec.js'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function pad2(n) { return (n < 10 ? '0' : '') + n }
function fmtAvg(n) { return (Number(n) || 0).toFixed(1).replace('.', ',') }
function fmtDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear()
}
function faixaOf(i) { return i <= 4 ? 'leve' : i <= 6 ? 'moderada' : i <= 8 ? 'forte' : 'muitoforte' }
function sevColor(i) {
  return { leve: '#6FA88E', moderada: '#E0A458', forte: '#D08440', muitoforte: '#C25B47' }[faixaOf(i)]
}

// Tabela por episódio — mora na página 1 (preenche o espaço antes vazio).
function episodeTable(d) {
  const mf = d.mesFoco
  const focoLabel = (d.periodo.mesFoco.label || '') + ' / ' + d.periodo.mesFoco.year
  const pillBg = { leve: '#CDE3D6', moderada: '#F3E4C4', forte: '#F0D9B8', muitoforte: '#E7B6AB' }
  const pillFg = { leve: '#2E6B4E', moderada: '#9A7A2A', forte: '#9A6418', muitoforte: '#8E2E1C' }

  const rows = mf.crises.length
    ? mf.crises.map((e) => {
        const f = faixaOf(e.intensity)
        const sint = (e.symptoms || []).join(', ') || '—'
        const med = (e.medications || []).join(', ') || '—'
        return (
          '<tr class="ep-row">' +
          '<td class="num">' + pad2(e.day) + '/' + pad2(d.periodo.mesFoco.month) + (e.emergencia ? ' <b class="emergencia-tag" style="color:#C25B47">PS</b>' : '') + '</td>' +
          '<td class="num">' + pad2(e.hour) + ':' + pad2(e.minute) + '</td>' +
          '<td><span class="pill" style="background:' + pillBg[f] + ';color:' + pillFg[f] + '">' + e.intensity + '</span></td>' +
          '<td>' + esc(e.location || '—') + '</td>' +
          '<td>' + esc(sint) + '</td>' +
          '<td>' + esc(med) + '</td>' +
          '<td class="num">' + (e.hr == null ? '—' : e.hr) + '</td>' +
          '<td class="num">' + (e.sleep == null ? '—' : e.sleep) + '</td>' +
          '<td class="num">' + (e.stress == null ? '—' : e.stress) + '</td>' +
          '</tr>'
        )
      }).join('')
    : '<tr><td colspan="9" class="ps">Nenhuma crise registrada neste mês.</td></tr>'

  return (
    '<div class="sec"><div class="sec-head"><h2>Registro detalhado — ' + esc(focoLabel) + '</h2><div class="rule"></div><span class="tag">por episódio</span></div>' +
    '<div class="table-wrap"><table><thead><tr><th>Data</th><th>Hora</th><th>Int.</th><th>Local</th><th>Sintomas</th><th>Medicação</th><th>FC</th><th>Sono*</th><th>Estr.</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="ps" style="margin-top:6px;">* Sono e estresse em índice 0–100 do relógio (não horas).</p></div>'
  )
}

// ---- Página 1: resumo de 6 meses + tabela de episódios ----
function renderPagina1(d) {
  const c = d.consolidado6m
  const periodoLabel = (d.periodo.de.label || '') + ' – ' + (d.periodo.ate.label || '') + ' ' + (d.periodo.ate.year || '')
  const mesFocoLabel = (d.periodo.mesFoco.label || '') + ' / ' + d.periodo.mesFoco.year

  const kpis = [
    ['Total de crises', String(c.totalCrises), 'num'],
    ['Intensidade média', fmtAvg(c.intensidadeMedia) + '<small> /10</small>', 'num'],
    ['Crise mais forte', String(c.criseMaisForte) + '<small> /10</small>', 'num'],
    ['Remédio mais usado', esc(c.remedioMaisUsado || '—'), 'text'],
    ['Sintoma mais comum', esc(c.sintomaMaisComum || '—'), 'text'],
  ].map(([label, value, cls]) =>
    '<div class="kpi"><div class="label">' + label + '</div><div class="value ' + cls + '">' + value + '</div></div>',
  ).join('')

  const nEmerg = c.emergencias || 0
  const seloEmerg = nEmerg > 0
    ? '<div class="insight emergencia-selo" style="margin-top:14px"><div class="icn">🏥</div><div class="body"><span class="h">Atendimento de emergência</span><b>' + nEmerg + '</b> ' + (nEmerg === 1 ? 'crise exigiu' : 'crises exigiram') + ' atendimento de emergência (PS/hospital) nos últimos 6 meses.</div></div>'
    : ''

  // gráfico de barras: crises por mês
  const maxCrises = Math.max(1, ...c.porMes.map((m) => m.crises))
  const barsCrises = c.porMes.map((m, i) => {
    const x = 67.5 + i * 75
    const h = Math.round((m.crises / maxCrises) * 160)
    const y = 180 - h
    const isFoco = i === c.porMes.length - 1
    const fill = isFoco ? '#0A3F3B' : '#0F5C57'
    return (
      '<rect class="bar-crises" x="' + x + '" y="' + y + '" width="40" height="' + h + '" rx="4" fill="' + fill + '"/>' +
      '<text x="' + (x + 20) + '" y="' + (y - 6) + '" font-size="11" font-weight="600" fill="#23251F" text-anchor="middle">' + m.crises + '</text>' +
      '<text x="' + (x + 20) + '" y="198" font-size="10.5" fill="#6E6C60" text-anchor="middle">' + esc(m.mes) + '</text>'
    )
  }).join('')

  // gráfico de linha: intensidade média por mês (0..10 → y 180..20)
  const pts = c.porMes.map((m, i) => {
    const x = 87.5 + i * 75
    const y = 180 - (m.intensidadeMedia / 10) * 160
    return { x, y, v: m.intensidadeMedia }
  })
  const polyline = pts.map((p) => p.x + ',' + p.y.toFixed(1)).join(' ')
  const dots = pts.map((p, i) =>
    '<circle cx="' + p.x + '" cy="' + p.y.toFixed(1) + '" r="3.5" fill="#C25B47"/>' +
    '<text x="' + p.x + '" y="' + (p.y - 10).toFixed(1) + '" font-size="10.5" font-weight="600" fill="#23251F" text-anchor="middle">' + fmtAvg(p.v) + '</text>' +
    '<text x="' + p.x + '" y="198" font-size="10.5" fill="#6E6C60" text-anchor="middle">' + esc(c.porMes[i].mes) + '</text>',
  ).join('')

  return (
    '<section class="page">' +
      '<div class="brandmark"><span class="dot"></span><span>MigraLog</span></div>' +
      '<div class="masthead">' +
        '<div><p class="eyebrow">Relatório clínico de acompanhamento</p>' +
        '<h1>Diário de Crises de Enxaqueca<span class="sub">Consolidação dos últimos 6 meses e detalhamento do mês corrente, com dados fisiológicos capturados pelo smartwatch.</span></h1></div>' +
        '<div class="meta" style="flex:none;white-space:nowrap"><b>' + esc(d.paciente.nome || '—') + '</b><br>Período: ' + esc(periodoLabel) + '<br>Mês em foco: <b>' + esc(mesFocoLabel) + '</b><br>Emitido em: ' + fmtDate(d.geradoEm) + '</div>' +
      '</div>' +
      '<div class="sec" style="margin-top:22px;">' +
        '<div class="sec-head"><h2>Resumo consolidado</h2><div class="rule"></div><span class="tag">6 meses</span></div>' +
        '<div class="kpis">' + kpis + '</div>' + seloEmerg +
      '</div>' +
      '<div class="sec">' +
        '<div class="sec-head"><h2>Comparativo dos últimos 6 meses</h2><div class="rule"></div></div>' +
        '<div class="charts-2">' +
          '<div class="panel"><p class="pt">Número de crises por mês</p><p class="ps">Frequência mensal de episódios</p>' +
            '<svg viewBox="0 0 520 210"><line x1="50" y1="180" x2="500" y2="180" stroke="#E1DBCC"/>' + barsCrises + '</svg></div>' +
          '<div class="panel"><p class="pt">Intensidade média por mês</p><p class="ps">Média da escala de dor (0–10)</p>' +
            '<svg viewBox="0 0 520 210"><line x1="50" y1="180" x2="500" y2="180" stroke="#E1DBCC"/>' +
            '<polyline points="' + polyline + '" fill="none" stroke="#C25B47" stroke-width="2.5" stroke-linejoin="round"/>' + dots + '</svg></div>' +
        '</div>' +
      '</div>' +
      episodeTable(d) +
      '<div class="foot"><span><b>MigraLog</b> · Gerado a partir do Amazfit Bip 6</span><span>Página 1 de 2</span></div>' +
    '</section>'
  )
}

function hbar(nome, contagem, max, cor) {
  const w = max > 0 ? Math.round((contagem / max) * 100) : 0
  return '<div class="hbar"><span class="hl">' + esc(nome) + '</span><span class="ht"><span class="hf" style="width:' + w + '%;background:' + cor + '"></span></span><span class="hv">' + contagem + '</span></div>'
}

// ---- Página 2: detalhamento do mês + correlação ----
function renderPagina2(d) {
  const mf = d.mesFoco
  const focoLabel = (d.periodo.mesFoco.label || '') + ' / ' + d.periodo.mesFoco.year

  // lollipop: x = 40 + (dia-1)*21.6 ; y = 180 - intensidade*16
  const lolli = mf.crises.length
    ? mf.crises.map((e) => {
        const x = (40 + (e.day - 1) * 21.6).toFixed(1)
        const y = (180 - e.intensity * 16).toFixed(1)
        const cor = sevColor(e.intensity)
        return (
          '<line class="lollipop" x1="' + x + '" y1="180" x2="' + x + '" y2="' + y + '" stroke="' + cor + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="' + cor + '"/>' +
          (e.emergencia ? '<circle class="emergencia-ring" cx="' + x + '" cy="' + y + '" r="10.5" fill="none" stroke="#0A3F3B" stroke-width="2"/>' : '') +
          '<text x="' + x + '" y="' + (Number(y) + 3.5).toFixed(1) + '" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle">' + e.intensity + '</text>' +
          '<text class="lolli-day" x="' + x + '" y="198" font-size="9.5" fill="#6E6C60" text-anchor="middle">' + pad2(e.day) + '</text>'
        )
      }).join('')
    : ''
  const hasEmerg = mf.crises.some((e) => e.emergencia)
  const legenda =
    '<div class="legend">' +
    '<span><i style="background:#6FA88E"></i>Leve (1–4)</span>' +
    '<span><i style="background:#E0A458"></i>Moderada (5–6)</span>' +
    '<span><i style="background:#D08440"></i>Forte (7–8)</span>' +
    '<span><i style="background:#C25B47"></i>Muito forte (9–10)</span>' +
    (hasEmerg ? '<span><i style="background:transparent;border:2px solid #0A3F3B;border-radius:50%"></i>Atendimento de emergência</span>' : '') +
    '</div>'
  const lolliSvg = mf.crises.length
    ? '<svg viewBox="0 0 700 210"><line x1="34" y1="180" x2="680" y2="180" stroke="#E1DBCC"/>' +
      '<line x1="34" y1="100" x2="680" y2="100" stroke="#ECE7DA"/>' + lolli + '</svg>' + legenda
    : '<p class="ps">Nenhuma crise registrada neste mês.</p>'

  const maxS = Math.max(1, ...mf.sintomas.map((s) => s.contagem))
  const sintomas = mf.sintomas.length
    ? mf.sintomas.map((s) => hbar(s.nome, s.contagem, maxS, '#0F5C57')).join('')
    : '<p class="ps">Sem sintomas registrados.</p>'

  const maxM = Math.max(1, ...mf.medicacoes.map((m) => m.contagem))
  const meds = mf.medicacoes.length
    ? mf.medicacoes.map((m) => hbar(m.nome, m.contagem, maxM, '#2F7B72')).join('')
    : '<p class="ps">Sem medicação registrada.</p>'

  const h = mf.horarios
  const maxH = Math.max(1, h.manha, h.tarde, h.noite)
  const horarios =
    hbar('Manhã', h.manha, maxH, '#D08440') +
    hbar('Tarde', h.tarde, maxH, '#E8C08A') +
    hbar('Noite', h.noite, maxH, '#E8C08A')

  // correlação (degradação graciosa)
  let correlacaoHtml
  if (d.correlacao == null) {
    correlacaoHtml = '<div class="panel"><p class="ps">Correlação fisiológica: <b>dados insuficientes</b>. Abra o app no relógio em mais dias para coletar a linha de base.</p></div>'
  } else {
    const cc = d.correlacao
    const cmp = (titulo, leg, comV, semV, max, rotComCrise, rotSemCrise) => {
      const w = (v) => (max > 0 ? Math.round((v / max) * 100) : 0)
      return (
        '<div class="cmp-row"><div class="cm-h"><span class="nm">' + titulo + '</span><span class="lg">' + leg + '</span></div>' +
        '<div class="cmp-bar"><span class="ck">' + rotComCrise + '</span><span class="ct"><span class="cf" style="width:' + w(comV) + '%;background:#C25B47"></span></span><span class="cv">' + comV + '</span></div>' +
        '<div class="cmp-bar"><span class="ck">' + rotSemCrise + '</span><span class="ct"><span class="cf" style="width:' + w(semV) + '%;background:#6FA88E"></span></span><span class="cv">' + semV + '</span></div></div>'
      )
    }
    correlacaoHtml =
      '<div class="panel"><p class="ps">Comparação entre <b>dias com crise</b> e <b>dias sem crise</b>, pelos sensores do relógio.</p><div class="cmp">' +
      cmp('Sono', 'índice 0–100', cc.comCrise.sono, cc.semCrise.sono, 100, 'Com crise', 'Sem crise') +
      cmp('Estresse', 'índice 0–100', cc.comCrise.estresse, cc.semCrise.estresse, 100, 'Com crise', 'Sem crise') +
      cmp('Freq. cardíaca', 'bpm', cc.comCrise.fc, cc.semCrise.fc, 120, 'Com crise', 'Sem crise') +
      '</div></div>'
  }

  return (
    '<section class="page">' +
      '<div class="brandmark"><span class="dot"></span><span>MigraLog</span></div>' +
      '<div class="sec-head" style="margin-top:6px;"><h2>Detalhamento do mês — ' + esc(focoLabel) + '</h2><div class="rule"></div><span class="tag">' + mf.crises.length + ' crises</span></div>' +
      '<div class="panel" style="margin-bottom:16px;"><p class="pt">Intensidade das crises ao longo do mês</p><p class="ps">Cada marcador é uma crise, no dia em que ocorreu</p>' + lolliSvg + '</div>' +
      '<div class="charts-3">' +
        '<div class="panel"><p class="pt">Sintomas mais frequentes</p><p class="ps">Ocorrências no mês</p><div style="margin-top:10px;">' + sintomas + '</div></div>' +
        '<div class="panel"><p class="pt">Medicação utilizada</p><p class="ps">Crises em que cada remédio foi tomado</p><div style="margin-top:10px;">' + meds + '</div>' +
          '<p class="pt" style="margin-top:18px;">Horário das crises</p><div style="margin-top:10px;">' + horarios + '</div></div>' +
      '</div>' +
      '<div class="sec" style="margin-top:18px;"><div class="sec-head"><h2>Correlação fisiológica</h2><div class="rule"></div><span class="tag">Dados do relógio</span></div>' + correlacaoHtml + '</div>' +
      '<div class="disclaimer"><b>Sobre este relatório.</b> Gerado automaticamente pelo <b>MigraLog</b> a partir de auto-registros e sensores do Amazfit Bip 6. As medições por sensores de pulso são estimativas de bem-estar e <b>não constituem diagnóstico médico</b>.</div>' +
      '<div class="foot"><span><b>MigraLog</b> · Gerado a partir do Amazfit Bip 6</span><span>Página 2 de 2</span></div>' +
    '</section>'
  )
}

export function renderReport(data) {
  const d = Object.assign({}, unpackReport(data || {}))
  d.paciente = d.paciente || {}
  d.periodo = d.periodo || { de: {}, ate: {}, mesFoco: {} }
  d.consolidado6m = d.consolidado6m || { totalCrises: 0, intensidadeMedia: 0, criseMaisForte: 0, porMes: [] }
  d.mesFoco = d.mesFoco || { crises: [], sintomas: [], medicacoes: [], horarios: { manha: 0, tarde: 0, noite: 0 } }
  return renderPagina1(d) + renderPagina2(d)
}
