// Kode Proxy yang Lebih Andal
export default async function handler(request, response) {
  // Menangani permintaan pre-flight CORS dari browser
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    response.status(200).end();
    return;
  }

  // Mengambil URL target dari parameter query
  const targetUrl = request.query.url;

  if (!targetUrl) {
    response.status(400).send('Parameter "url" diperlukan.');
    return;
  }

  try {
    // Men-decode URL untuk memastikan formatnya benar
    const decodedUrl = decodeURIComponent(targetUrl);

    // Mengambil konten dari URL target dengan header yang menyamar sebagai browser
    const targetResponse = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    // Memeriksa apakah permintaan ke situs target berhasil
    if (!targetResponse.ok) {
      throw new Error(`Situs target merespons dengan status: ${targetResponse.status}`);
    }

    // Mengambil data sebagai teks
    const data = await targetResponse.text();

    // Mengatur header CORS untuk respons aktual agar bisa diakses
    response.setHeader('Access-Control-Allow-Origin', '*');

    // Mengirim konten yang diambil kembali ke aplikasi Anda
    response.status(200).send(data);

  } catch (error) {
    console.error('Kesalahan Proxy:', error);
    response.status(500).send(`Terjadi kesalahan pada server proxy: ${error.message}`);
  }
}
