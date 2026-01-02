const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `Masukan URL TikTok!\n\nContoh:\n${usedPrefix + command} https://vt.tiktok.com/xxxx`;

  if (!/tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/.test(text))
    throw 'URL TikTok tidak valid!';

  await m.reply('⏳ Mengunduh video TikTok...');

  try {
    const { data } = await axios.get('https://tikwm.com/api/', {
      params: {
        url: text,
        hd: 1
      },
      timeout: 15000
    });

    if (!data || data.code !== 0)
      throw 'Gagal mengambil data video.';

    const {
      title,
      play,
      music
    } = data.data;

    let caption = `乂 *T I K T O K*\n\n`;
    caption += `◦ *Title* : ${title || '-'}\n`;

    // Kirim video
    await conn.sendFile(
      m.chat,
      play,
      'tiktok.mp4',
      caption,
      m
    );

    // Kirim audio jika ada
    if (music) {
      await conn.sendMessage(
        m.chat,
        { audio: { url: music }, mimetype: 'audio/mpeg' },
        { quoted: m }
      );
    }

  } catch (e) {
    console.error(e);
    throw '❌ Gagal download TikTok (coba link lain).';
  }
};

handler.help = ['tiktok'];
handler.command = /^(tiktok|tt|tiktokdl|ttdl)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;

module.exports = handler;