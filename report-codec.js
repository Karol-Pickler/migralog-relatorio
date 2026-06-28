// Codec de transporte do relatório: poda lossless do #fragment.
// buildReport produz o objeto rico; packReport o compacta para caber na URL
// (episódios viram tuplas posicionais, sem repetir nomes de campo nem ts/year/month);
// unpackReport reconstrói o objeto rico. Puras e idempotentes em dado já no formato alvo.

const CR_FIELDS = ['day', 'hour', 'minute', 'intensity', 'location', 'symptoms', 'medications', 'hr', 'sleep', 'stress', 'emergencia']

function packAutonomic(a) {
  const s = (a.serie || []).map((p) => p.dia + '.' + p.valor + '.' + (p.crise ? 1 : 0)).join('!')
  const c = (a.crises || []).map((x) =>
    x.dia + '~' + x.hora + '~' + x.onset + '~' + x.baseline7d + '~' + ((x.pre || []).join('.')),
  ).join('!')
  return { s, c, comparacao: a.comparacao || null, diasValidos: a.diasValidos || 0 }
}

function unpackAutonomic(a) {
  const serie = a.s ? a.s.split('!').map((seg) => {
    const f = seg.split('.')
    return { dia: Number(f[0]), valor: Number(f[1]), crise: f[2] === '1' }
  }) : []
  const crises = a.c ? a.c.split('!').map((seg) => {
    const f = seg.split('~')
    const pre = f[4] ? f[4].split('.').map(Number) : []
    return { dia: Number(f[0]), hora: Number(f[1]), onset: Number(f[2]), baseline7d: Number(f[3]), pre }
  }) : []
  return { serie, comparacao: a.comparacao || null, diasValidos: a.diasValidos || 0, crises }
}

export function packReport(report) {
  if (!report || !report.mesFoco || !Array.isArray(report.mesFoco.crises)) return report
  const crisesT = report.mesFoco.crises.map((e) => CR_FIELDS.map((f) => e[f]))
  const mesFoco = Object.assign({}, report.mesFoco, { crisesT })
  delete mesFoco.crises
  let out = Object.assign({}, report, { mesFoco })
  if (report.autonomic) out = Object.assign({}, out, { autonomic: packAutonomic(report.autonomic) })
  return out
}

export function unpackReport(packed) {
  if (!packed) return packed
  let out = packed
  if (packed.mesFoco && Array.isArray(packed.mesFoco.crisesT)) {
    const crises = packed.mesFoco.crisesT.map((t) => {
      const e = {}
      CR_FIELDS.forEach((f, i) => { e[f] = t[i] })
      return e
    })
    const mesFoco = Object.assign({}, packed.mesFoco, { crises })
    delete mesFoco.crisesT
    out = Object.assign({}, out, { mesFoco })
  }
  if (packed.autonomic && (typeof packed.autonomic.s === 'string' || typeof packed.autonomic.c === 'string')) {
    out = Object.assign({}, out, { autonomic: unpackAutonomic(packed.autonomic) })
  }
  return out
}
