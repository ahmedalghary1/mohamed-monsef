// Entries: id, slug, type (campaign/image/video), status, title:{en,ar},
// summary:{en,ar}, media:[{src,kind,alt:{en,ar},poster,captions}],
// permissionConfirmed, featured; optional industry/objective/role/approach/metrics.
// One entry may group many campaign assets in media (landscape, vertical, square,
// image and video). Add only supplied, approved assets; no artificial project limit.
// Optional comparison:{permissionConfirmed,width,height,before:{src,alt:{en,ar}},
// after:{src,alt:{en,ar}}}; both images need matching composition/dimensions.
// Optional localized overview/challenge/objective/strategy/execution/testing/
// optimization/lessons/direction and attribution; tools is an approved string array.
// Dialogs expose shareable #project=client-ID links without empty detail routes.
export const projects = [];
export function publishableProjects(entries) {
  return entries.filter(p => p.status === 'published' && p.permissionConfirmed === true &&
    ['campaign','image','video'].includes(p.type) && p.id && p.title?.en && p.title?.ar &&
    p.summary?.en && p.summary?.ar && p.media?.length &&
    p.media.every(m => /^\/assets\//.test(m.src) && m.alt?.en && m.alt?.ar &&
      ['image','video'].includes(m.kind) && (m.kind !== 'video' || /^\/assets\//.test(m.poster || ''))));
}
