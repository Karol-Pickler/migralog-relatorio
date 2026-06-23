// Codec de transporte do relatório: poda lossless do #fragment.
// buildReport produz o objeto rico; packReport o compacta para caber na URL
// (episódios viram tuplas posicionais, sem repetir nomes de campo nem ts/year/month);
// unpackReport reconstrói o objeto rico. Puras e idempotentes em dado já no formato alvo.

const CR_FIELDS = ['day', 'hour', 'minute', 'intensity', 'location', 'symptoms', 'medications', 'hr', 'sleep', 'stress', 'emergencia']

export function packReport(report) {
  if (!report || !report.mesFoco || !Array.isArray(report.mesFoco.crises)) return report
  const crisesT = report.mesFoco.crises.map((e) => CR_FIELDS.map((f) => e[f]))
  const mesFoco = Object.assign({}, report.mesFoco, { crisesT })
  delete mesFoco.crises
  return Object.assign({}, report, { mesFoco })
}

export function unpackReport(packed) {
  if (!packed || !packed.mesFoco || !Array.isArray(packed.mesFoco.crisesT)) return packed
  const crises = packed.mesFoco.crisesT.map((t) => {
    const e = {}
    CR_FIELDS.forEach((f, i) => { e[f] = t[i] })
    return e
  })
  const mesFoco = Object.assign({}, packed.mesFoco, { crises })
  delete mesFoco.crisesT
  return Object.assign({}, packed, { mesFoco })
}
