export default async function handler(request, response) {
  // Mengambil URL target dari query string
  const targetUrl = request.query.url;

  if (!targetUrl) {
    response.status(400).send('Parameter "url" diperlukan.');
    return;
  }

  try {
    // Mengambil konten dari URL target
    const res = await fetch(decodeURIComponent(targetUrl), {
      headers: {
        // Meniru header browser untuk menghindari blokir
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Mendapatkan data sebagai teks
    const data = await res.text();

    // Mengatur header CORS agar bisa diakses dari mana saja
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    // Mengirimkan konten kembali ke aplikasi kita
    response.status(200).send(data);

  } catch (error) {
    response.status(500).send(`Gagal mengambil URL: ${error.message}`);
  }
}
