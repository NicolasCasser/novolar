export function resolveImageUrl(url: string): string {
  const apiUrl = import.meta.env.VITE_API_URL.replace('/graphql', '');
  return /^https?:\/\//.test(url) ? url : `${apiUrl}${url}`;
}
