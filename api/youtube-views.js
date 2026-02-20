/**
 * Vercel Serverless Function — YouTube View Count Fetcher
 * 
 * Fetches view counts for all project YouTube videos by parsing
 * YouTube page metadata. No API key required.
 * 
 * Endpoint: GET /api/youtube-views
 * Response: { "videoId": viewCount, ... }
 */

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Cache for 1 hour on CDN, 5 min in browser
    res.setHeader('Cache-Control', 's-maxage=3600, max-age=300, stale-while-revalidate=600');

    // Collect video IDs from query param or use all known IDs
    const VIDEO_IDS = [
        'lrLXToiFsVw', // project 10
        '6Kkd3FxtHhM', // project 9
        'qg1WRX4tOLE', // project 8
        'bHKD0xGFJ3A', // project 7
        'hGzRDIapU40', // project 6
        'kfnX66HhwdI', // project 5
        '1TvsqxpVQdI', // project 4
        '0I3Cm0k2OpU', // project 3
        'pY25tXNK5uM', // project 2
        'ZpYoE54rmpI', // project 1
    ];

    const results = {};

    // Fetch all video pages in parallel
    const fetchPromises = VIDEO_IDS.map(async (videoId) => {
        try {
            const response = await fetch(
                `https://www.youtube.com/watch?v=${videoId}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
                        'Accept-Language': 'en-US,en;q=0.9',
                    }
                }
            );

            if (!response.ok) {
                results[videoId] = 0;
                return;
            }

            const html = await response.text();

            // Method 1: Extract from meta tag
            const metaMatch = html.match(/itemprop="interactionCount"\s+content="(\d+)"/);
            if (metaMatch) {
                results[videoId] = parseInt(metaMatch[1], 10);
                return;
            }

            // Method 2: Extract from JSON-LD structured data
            const jsonLdMatch = html.match(/"viewCount"\s*:\s*"(\d+)"/);
            if (jsonLdMatch) {
                results[videoId] = parseInt(jsonLdMatch[1], 10);
                return;
            }

            // Method 3: Extract from ytInitialData
            const ytDataMatch = html.match(/"viewCount"\s*:\s*\{\s*"simpleText"\s*:\s*"([\d,]+)\s+views?"/);
            if (ytDataMatch) {
                results[videoId] = parseInt(ytDataMatch[1].replace(/,/g, ''), 10);
                return;
            }

            results[videoId] = 0;
        } catch (err) {
            results[videoId] = 0;
        }
    });

    await Promise.all(fetchPromises);

    res.status(200).json(results);
};
