// Renderizador do relatório MigraLog. Hospedado standalone (com report-codec.js ao lado).
// renderReport(data) -> string com o HTML interno de <div class="doc">.
// data pode vir empacotada (do #fragment) ou rica; unpackReport normaliza (ver Task 13).
import { unpackReport } from './report-codec.js'
import { monthLabel } from '../lib/dates.js'

export const I18N = {
  pt: {
    rpt_eyebrow: 'Relatório clínico de acompanhamento',
    rpt_title: 'Diário de Crises de Enxaqueca',
    rpt_subtitle: 'Consolidação dos últimos 6 meses e detalhamento do mês corrente, com dados fisiológicos capturados pelo smartwatch.',
    rpt_period: 'Período:',
    rpt_focus_month: 'Mês em foco:',
    rpt_issued: 'Emitido em:',
    rpt_summary: 'Resumo consolidado',
    rpt_6m: '6 meses',
    rpt_total: 'Total de crises',
    rpt_avg_intensity: 'Intensidade média',
    rpt_strongest: 'Crise mais forte',
    rpt_most_med: 'Remédio mais usado',
    rpt_most_symptom: 'Sintoma mais comum',
    rpt_emergencies: 'Emergências',
    rpt_none_month: 'Nenhuma crise registrada neste mês.',
    rpt_detail_heading: 'Registro detalhado — ',
    rpt_per_episode: 'por episódio',
    rpt_sleep_note: '* Sono e estresse em índice 0–100 do relógio (não horas).',
    rpt_compare_heading: 'Comparativo dos últimos 6 meses',
    rpt_crises_per_month: 'Número de crises por mês',
    rpt_crises_per_month_sub: 'Frequência mensal de episódios',
    rpt_avg_per_month: 'Intensidade média por mês',
    rpt_avg_per_month_sub: 'Média da escala de dor (0–10)',
    rpt_detail_month: 'Detalhamento do mês — ',
    rpt_intensity_chart: 'Intensidade das crises ao longo do mês',
    rpt_intensity_chart_sub: 'Cada marcador é uma crise, no dia em que ocorreu',
    rpt_physio_heading: 'Correlação fisiológica',
    rpt_physio_tag: 'Dados do relógio',
    rpt_physio_compare_sub: 'Comparação entre <b>dias com crise</b> e <b>dias sem crise</b>, pelos sensores do relógio.',
    rpt_physio_insufficient: 'Correlação fisiológica: <b>dados insuficientes</b>. Abra o app no relógio em mais dias para coletar a linha de base.',
    rpt_disclaimer: '<b>Sobre este relatório.</b> Gerado automaticamente pelo <b>MigraLog</b> a partir de auto-registros e sensores do Amazfit Bip 6. As medições por sensores de pulso são estimativas de bem-estar e <b>não constituem diagnóstico médico</b>.',
    rpt_footer: 'Gerado a partir do Amazfit Bip 6',
    rpt_page1: 'Página 1 de 2',
    rpt_page2: 'Página 2 de 2',
    rpt_emerg_heading: 'Atendimento de emergência',
    rpt_emerg_singular: 'crise exigiu',
    rpt_emerg_plural: 'crises exigiram',
    rpt_emerg_suffix: 'atendimento de emergência (PS/hospital) nos últimos 6 meses.',
    th_date: 'Data',
    th_time: 'Hora',
    th_int: 'Int.',
    th_local: 'Local',
    th_symptoms: 'Sintomas',
    th_med: 'Medicação',
    th_hr: 'FC',
    th_sleep: 'Sono*',
    th_stress: 'Estr.',
    morning: 'Manhã',
    afternoon: 'Tarde',
    night: 'Noite',
    hr_full: 'Freq. cardíaca',
    with_attack: 'Com crise',
    without_attack: 'Sem crise',
    sym_freq_title: 'Sintomas mais frequentes',
    sym_freq_sub: 'Ocorrências no mês',
    med_used_title: 'Medicação utilizada',
    med_used_sub: 'Crises em que cada remédio foi tomado',
    rpt_horarios_heading: 'Horário das crises',
    generating: 'Gerando relatório…',
    report_doc_title: 'MigraLog — Relatório de Crises de Enxaqueca',
    no_data_fragment: 'Sem dados no relatório. Abra a partir do app MigraLog no celular.',
    dash: '—',
    ps_tag: 'PS',
    sev_leve: 'Leve (1–4)',
    sev_moderada: 'Moderada (5–6)',
    sev_forte: 'Forte (7–8)',
    sev_muitoforte: 'Muito forte (9–10)',
    sev_emerg: 'Atendimento de emergência',
    no_symptoms: 'Sem sintomas registrados.',
    no_meds: 'Sem medicação registrada.',
    rpt_sleep_label: 'Sono',
    rpt_stress_label: 'Estresse',
  },
  en: {
    rpt_eyebrow: 'Clinical follow-up report',
    rpt_title: 'Migraine Attack Diary',
    rpt_subtitle: 'Six-month summary and current-month detail, with physiological data captured by the smartwatch.',
    rpt_period: 'Period:',
    rpt_focus_month: 'Focus month:',
    rpt_issued: 'Issued on:',
    rpt_summary: 'Consolidated summary',
    rpt_6m: '6 months',
    rpt_total: 'Total attacks',
    rpt_avg_intensity: 'Average intensity',
    rpt_strongest: 'Strongest attack',
    rpt_most_med: 'Most-used medication',
    rpt_most_symptom: 'Most common symptom',
    rpt_emergencies: 'Emergencies',
    rpt_none_month: 'No attacks recorded this month.',
    rpt_detail_heading: 'Detailed log — ',
    rpt_per_episode: 'per episode',
    rpt_sleep_note: '* Sleep and stress as index 0–100 from the watch (not hours).',
    rpt_compare_heading: 'Last 6 months comparison',
    rpt_crises_per_month: 'Attacks per month',
    rpt_crises_per_month_sub: 'Monthly episode frequency',
    rpt_avg_per_month: 'Average intensity per month',
    rpt_avg_per_month_sub: 'Average pain scale (0–10)',
    rpt_detail_month: 'Monthly detail — ',
    rpt_intensity_chart: 'Attack intensity over the month',
    rpt_intensity_chart_sub: 'Each marker is an attack, on the day it occurred',
    rpt_physio_heading: 'Physiological correlation',
    rpt_physio_tag: 'Watch data',
    rpt_physio_compare_sub: 'Comparison between <b>days with attack</b> and <b>days without attack</b>, by watch sensors.',
    rpt_physio_insufficient: 'Physiological correlation: <b>insufficient data</b>. Open the app on the watch on more days to collect the baseline.',
    rpt_disclaimer: '<b>About this report.</b> Automatically generated by <b>MigraLog</b> from self-records and Amazfit Bip 6 sensors. Wrist-sensor measurements are wellness estimates and <b>do not constitute medical diagnosis</b>.',
    rpt_footer: 'Generated from Amazfit Bip 6',
    rpt_page1: 'Page 1 of 2',
    rpt_page2: 'Page 2 of 2',
    rpt_emerg_heading: 'Emergency attendance',
    rpt_emerg_singular: 'attack required',
    rpt_emerg_plural: 'attacks required',
    rpt_emerg_suffix: 'emergency attendance (ER/hospital) in the last 6 months.',
    th_date: 'Date',
    th_time: 'Time',
    th_int: 'Int.',
    th_local: 'Location',
    th_symptoms: 'Symptoms',
    th_med: 'Medication',
    th_hr: 'HR',
    th_sleep: 'Sleep*',
    th_stress: 'Stress',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',
    hr_full: 'Heart rate',
    with_attack: 'With attack',
    without_attack: 'Without attack',
    sym_freq_title: 'Most frequent symptoms',
    sym_freq_sub: 'Occurrences this month',
    med_used_title: 'Medications used',
    med_used_sub: 'Attacks where each medication was taken',
    rpt_horarios_heading: 'Attack timing',
    generating: 'Generating report…',
    report_doc_title: 'MigraLog — Migraine Attack Report',
    no_data_fragment: 'No report data. Open it from the MigraLog app on the phone.',
    dash: '—',
    ps_tag: 'ER',
    sev_leve: 'Mild (1–4)',
    sev_moderada: 'Moderate (5–6)',
    sev_forte: 'Strong (7–8)',
    sev_muitoforte: 'Very strong (9–10)',
    sev_emerg: 'Emergency attendance',
    no_symptoms: 'No symptoms recorded.',
    no_meds: 'No medication recorded.',
    rpt_sleep_label: 'Sleep',
    rpt_stress_label: 'Stress',
  },
}

export const renderReportInternals = { I18N }

function pickLang(data) {
  if (data && data.lang === 'en') return 'en'
  if (data && data.lang === 'pt') return 'pt'
  if (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().indexOf('pt') === 0) return 'pt'
  return 'pt'
}

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
function episodeTable(d, T) {
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
          '<td class="num">' + pad2(e.day) + '/' + pad2(d.periodo.mesFoco.month) + (e.emergencia ? ' <b class="emergencia-tag" style="color:#C25B47">' + T.ps_tag + '</b>' : '') + '</td>' +
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
    : '<tr><td colspan="9" class="ps">' + T.rpt_none_month + '</td></tr>'

  return (
    '<div class="sec"><div class="sec-head"><h2>' + T.rpt_detail_heading + esc(focoLabel) + '</h2><div class="rule"></div><span class="tag">' + T.rpt_per_episode + '</span></div>' +
    '<div class="table-wrap"><table><thead><tr><th>' + T.th_date + '</th><th>' + T.th_time + '</th><th>' + T.th_int + '</th><th>' + T.th_local + '</th><th>' + T.th_symptoms + '</th><th>' + T.th_med + '</th><th>' + T.th_hr + '</th><th>' + T.th_sleep + '</th><th>' + T.th_stress + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="ps" style="margin-top:6px;">' + T.rpt_sleep_note + '</p></div>'
  )
}

// ---- Página 1: resumo de 6 meses + tabela de episódios ----
function renderPagina1(d, T) {
  const c = d.consolidado6m
  const periodoLabel = (d.periodo.de.label || '') + ' – ' + (d.periodo.ate.label || '') + ' ' + (d.periodo.ate.year || '')
  const mesFocoLabel = (d.periodo.mesFoco.label || '') + ' / ' + d.periodo.mesFoco.year

  const kpis = [
    [T.rpt_total, String(c.totalCrises), 'num'],
    [T.rpt_avg_intensity, fmtAvg(c.intensidadeMedia) + '<small> /10</small>', 'num'],
    [T.rpt_strongest, String(c.criseMaisForte) + '<small> /10</small>', 'num'],
    [T.rpt_most_med, esc(c.remedioMaisUsado || '—'), 'text'],
    [T.rpt_most_symptom, esc(c.sintomaMaisComum || '—'), 'text'],
  ].map(([label, value, cls]) =>
    '<div class="kpi"><div class="label">' + label + '</div><div class="value ' + cls + '">' + value + '</div></div>',
  ).join('')

  const nEmerg = c.emergencias || 0
  const seloEmerg = nEmerg > 0
    ? '<div class="insight emergencia-selo" style="margin-top:14px"><div class="icn">🏥</div><div class="body"><span class="h">' + T.rpt_emerg_heading + '</span><b>' + nEmerg + '</b> ' + (nEmerg === 1 ? T.rpt_emerg_singular : T.rpt_emerg_plural) + ' ' + T.rpt_emerg_suffix + '</div></div>'
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
        '<div><p class="eyebrow">' + T.rpt_eyebrow + '</p>' +
        '<h1>' + T.rpt_title + '<span class="sub">' + T.rpt_subtitle + '</span></h1></div>' +
        '<div class="meta" style="flex:none;white-space:nowrap"><b>' + esc(d.paciente.nome || '—') + '</b><br>' + T.rpt_period + ' ' + esc(periodoLabel) + '<br>' + T.rpt_focus_month + ' <b>' + esc(mesFocoLabel) + '</b><br>' + T.rpt_issued + ' ' + fmtDate(d.geradoEm) + '</div>' +
      '</div>' +
      '<div class="sec" style="margin-top:22px;">' +
        '<div class="sec-head"><h2>' + T.rpt_summary + '</h2><div class="rule"></div><span class="tag">' + T.rpt_6m + '</span></div>' +
        '<div class="kpis">' + kpis + '</div>' + seloEmerg +
      '</div>' +
      '<div class="sec">' +
        '<div class="sec-head"><h2>' + T.rpt_compare_heading + '</h2><div class="rule"></div></div>' +
        '<div class="charts-2">' +
          '<div class="panel"><p class="pt">' + T.rpt_crises_per_month + '</p><p class="ps">' + T.rpt_crises_per_month_sub + '</p>' +
            '<svg viewBox="0 0 520 210"><line x1="50" y1="180" x2="500" y2="180" stroke="#E1DBCC"/>' + barsCrises + '</svg></div>' +
          '<div class="panel"><p class="pt">' + T.rpt_avg_per_month + '</p><p class="ps">' + T.rpt_avg_per_month_sub + '</p>' +
            '<svg viewBox="0 0 520 210"><line x1="50" y1="180" x2="500" y2="180" stroke="#E1DBCC"/>' +
            '<polyline points="' + polyline + '" fill="none" stroke="#C25B47" stroke-width="2.5" stroke-linejoin="round"/>' + dots + '</svg></div>' +
        '</div>' +
      '</div>' +
      episodeTable(d, T) +
      '<div class="foot"><span><b>MigraLog</b> · ' + T.rpt_footer + '</span><span>' + T.rpt_page1 + '</span></div>' +
    '</section>'
  )
}

function hbar(nome, contagem, max, cor) {
  const w = max > 0 ? Math.round((contagem / max) * 100) : 0
  return '<div class="hbar"><span class="hl">' + esc(nome) + '</span><span class="ht"><span class="hf" style="width:' + w + '%;background:' + cor + '"></span></span><span class="hv">' + contagem + '</span></div>'
}

// ---- Página 2: detalhamento do mês + correlação ----
function renderPagina2(d, T) {
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
    '<span><i style="background:#6FA88E"></i>' + T.sev_leve + '</span>' +
    '<span><i style="background:#E0A458"></i>' + T.sev_moderada + '</span>' +
    '<span><i style="background:#D08440"></i>' + T.sev_forte + '</span>' +
    '<span><i style="background:#C25B47"></i>' + T.sev_muitoforte + '</span>' +
    (hasEmerg ? '<span><i style="background:transparent;border:2px solid #0A3F3B;border-radius:50%"></i>' + T.sev_emerg + '</span>' : '') +
    '</div>'
  const lolliSvg = mf.crises.length
    ? '<svg viewBox="0 0 700 210"><line x1="34" y1="180" x2="680" y2="180" stroke="#E1DBCC"/>' +
      '<line x1="34" y1="100" x2="680" y2="100" stroke="#ECE7DA"/>' + lolli + '</svg>' + legenda
    : '<p class="ps">' + T.rpt_none_month + '</p>'

  const maxS = Math.max(1, ...mf.sintomas.map((s) => s.contagem))
  const sintomas = mf.sintomas.length
    ? mf.sintomas.map((s) => hbar(s.nome, s.contagem, maxS, '#0F5C57')).join('')
    : '<p class="ps">' + T.no_symptoms + '</p>'

  const maxM = Math.max(1, ...mf.medicacoes.map((m) => m.contagem))
  const meds = mf.medicacoes.length
    ? mf.medicacoes.map((m) => hbar(m.nome, m.contagem, maxM, '#2F7B72')).join('')
    : '<p class="ps">' + T.no_meds + '</p>'

  const h = mf.horarios
  const maxH = Math.max(1, h.manha, h.tarde, h.noite)
  const horarios =
    hbar(T.morning, h.manha, maxH, '#D08440') +
    hbar(T.afternoon, h.tarde, maxH, '#E8C08A') +
    hbar(T.night, h.noite, maxH, '#E8C08A')

  // correlação (degradação graciosa)
  let correlacaoHtml
  if (d.correlacao == null) {
    correlacaoHtml = '<div class="panel"><p class="ps">' + T.rpt_physio_insufficient + '</p></div>'
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
      '<div class="panel"><p class="ps">' + T.rpt_physio_compare_sub + '</p><div class="cmp">' +
      cmp(T.rpt_sleep_label, 'índice 0–100', cc.comCrise.sono, cc.semCrise.sono, 100, T.with_attack, T.without_attack) +
      cmp(T.rpt_stress_label, 'índice 0–100', cc.comCrise.estresse, cc.semCrise.estresse, 100, T.with_attack, T.without_attack) +
      cmp(T.hr_full, 'bpm', cc.comCrise.fc, cc.semCrise.fc, 120, T.with_attack, T.without_attack) +
      '</div></div>'
  }

  return (
    '<section class="page">' +
      '<div class="brandmark"><span class="dot"></span><span>MigraLog</span></div>' +
      '<div class="sec-head" style="margin-top:6px;"><h2>' + T.rpt_detail_month + esc(focoLabel) + '</h2><div class="rule"></div><span class="tag">' + mf.crises.length + ' crises</span></div>' +
      '<div class="panel" style="margin-bottom:16px;"><p class="pt">' + T.rpt_intensity_chart + '</p><p class="ps">' + T.rpt_intensity_chart_sub + '</p>' + lolliSvg + '</div>' +
      '<div class="charts-3">' +
        '<div class="panel"><p class="pt">' + T.sym_freq_title + '</p><p class="ps">' + T.sym_freq_sub + '</p><div style="margin-top:10px;">' + sintomas + '</div></div>' +
        '<div class="panel"><p class="pt">' + T.med_used_title + '</p><p class="ps">' + T.med_used_sub + '</p><div style="margin-top:10px;">' + meds + '</div>' +
          '<p class="pt" style="margin-top:18px;">' + T.rpt_horarios_heading + '</p><div style="margin-top:10px;">' + horarios + '</div></div>' +
      '</div>' +
      '<div class="sec" style="margin-top:18px;"><div class="sec-head"><h2>' + T.rpt_physio_heading + '</h2><div class="rule"></div><span class="tag">' + T.rpt_physio_tag + '</span></div>' + correlacaoHtml + '</div>' +
      '<div class="disclaimer">' + T.rpt_disclaimer + '</div>' +
      '<div class="foot"><span><b>MigraLog</b> · ' + T.rpt_footer + '</span><span>' + T.rpt_page2 + '</span></div>' +
    '</section>'
  )
}

export function renderReport(data) {
  const d = Object.assign({}, unpackReport(data || {}))
  d.paciente = d.paciente || {}
  d.periodo = d.periodo || { de: {}, ate: {}, mesFoco: {} }
  d.consolidado6m = d.consolidado6m || { totalCrises: 0, intensidadeMedia: 0, criseMaisForte: 0, porMes: [] }
  d.mesFoco = d.mesFoco || { crises: [], sintomas: [], medicacoes: [], horarios: { manha: 0, tarde: 0, noite: 0 } }
  const T = I18N[pickLang(data)]
  return renderPagina1(d, T) + renderPagina2(d, T)
}
