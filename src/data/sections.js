// Keep this order aligned with the generated homepage. Child item numbers are separate.
export const sectionOrder = ['campaign', 'creative', 'motion', 'services', 'story', 'about', 'experience', 'skills', 'builder', 'contact'];
export function sectionLabel(id, label) {
  const index = sectionOrder.indexOf(id);
  if (index < 0) throw new Error(`Unknown section: ${id}`);
  return `${String(index + 1).padStart(2, '0')} / ${label}`;
}
