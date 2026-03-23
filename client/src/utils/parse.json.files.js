export async function parseJsonFiles(files) {
  const contents = await Promise.all(
    files.map(async (file) => {
      if (!file.name.endsWith('.json')) {
        throw new Error(`${file.name} is not a JSON file`);
      }

      const text = await file.text();

      try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [data];
      } catch {
        throw new Error(`Invalid JSON in ${file.name}`);
      }
    })
  );

  return contents.flat(); 
}
