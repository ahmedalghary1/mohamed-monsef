// Entries: id, slug, type (campaign/image/video), status, title:{en,ar},
// summary:{en,ar}, media:[{src,kind,alt:{en,ar},poster,captions}],
// permissionConfirmed, featured; optional industry/objective/role/approach/metrics.
export const projects = [];
export function publishableProjects(entries) {
  return entries.filter(p => p.status === 'published' && p.permissionConfirmed === true &&
    ['campaign','image','video'].includes(p.type) && p.id && p.title?.en && p.title?.ar &&
    p.summary?.en && p.summary?.ar && p.media?.length &&
    p.media.every(m => /^\/assets\//.test(m.src) && m.alt?.en && m.alt?.ar &&
      ['image','video'].includes(m.kind) && (m.kind !== 'video' || /^\/assets\//.test(m.poster || ''))));
}
