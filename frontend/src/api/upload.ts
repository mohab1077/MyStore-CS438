export async function uploadImagesToBackend(
  files: File[],
  apiUrl: string = import.meta.env.VITE_API_URL
): Promise<string[]> {

  const form = new FormData();

  files.forEach((file) => {
    form.append("images", file);
  });

  const res = await fetch(`${apiUrl}/upload/images`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  return data.urls as string[];
}