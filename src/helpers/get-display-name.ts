export default function getDisplayName(
  component: React.ComponentType,
  fallback?: string
) {
  return component.displayName || component.name || fallback || 'Unknown';
}
