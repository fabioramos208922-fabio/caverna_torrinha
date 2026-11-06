// Identifica de onde o visitante veio (UTM, cliques de anúncio e site de origem)
// e monta um texto legível que vai junto na mensagem do WhatsApp.
(function (root, factory) { const api = factory(); if (typeof module !== 'undefined' && module.exports) module.exports = api; if (root) root.TorrinhaUTM = api; })(typeof window !== 'undefined' ? window : globalThis, function () {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
  const normalize = (value) => String(value || '').trim().toLowerCase().slice(0, 60).replace(/[^a-z0-9_.%\-]/g, '_');
  const ownHosts = ['cavernatorrinha.com', 'fabioramos208922-fabio.github.io'];

  // Site de origem (quando não há UTM) -> [origem, meio]
  const fromReferrer = (host) => {
    if (!host || ownHosts.includes(host)) return ['direto', ''];
    if (/(^|\.)google\.[a-z.]+$/.test(host)) return ['google', 'organic'];
    if (host === 'bing.com' || host.endsWith('.bing.com')) return ['bing', 'organic'];
    if (host.endsWith('yahoo.com') || host === 'duckduckgo.com' || host.endsWith('ecosia.org')) return [host.split('.').slice(-2, -1)[0], 'organic'];
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') return ['youtube', 'social'];
    if (host.endsWith('instagram.com')) return ['instagram', 'social'];
    if (host.endsWith('facebook.com') || host === 'fb.com') return ['facebook', 'social'];
    if (host.endsWith('tiktok.com')) return ['tiktok', 'social'];
    if (host === 't.co' || host === 'x.com' || host === 'twitter.com') return ['x', 'social'];
    if (host.endsWith('whatsapp.com') || host === 'wa.me') return ['whatsapp', 'social'];
    if (host === 'chatgpt.com' || host === 'chat.openai.com') return ['chatgpt', 'referral'];
    if (host.endsWith('tripadvisor.com') || host.endsWith('tripadvisor.com.br')) return ['tripadvisor', 'referral'];
    return [host, 'referral'];
  };

  const read = (search, referrer) => {
    const p = new URLSearchParams(search || '');
    const out = {};
    keys.forEach((k) => { const v = p.get(k); if (v) out[k] = k === 'fbclid' ? 'sim' : normalize(v); });
    const googleAds = out.gclid || out.gbraid || out.wbraid;
    if (!out.utm_source) {
      if (googleAds) { out.utm_source = 'google'; out.utm_medium = out.utm_medium || 'cpc'; }
      else if (out.fbclid) { out.utm_source = 'meta'; out.utm_medium = out.utm_medium || 'social'; }
      else {
        let host = '';
        try { host = referrer ? new URL(referrer).hostname.toLowerCase().replace(/^www\./, '') : ''; } catch {}
        const [source, medium] = fromReferrer(host);
        out.utm_source = normalize(source);
        if (medium && !out.utm_medium) out.utm_medium = medium;
      }
    } else if (googleAds && !out.utm_medium) {
      out.utm_medium = 'cpc';
    }
    return out;
  };

  const isPaid = (m) => ['cpc', 'ppc', 'paid', 'paid_search', 'paid_social', 'ads', 'display'].includes(m);
  const names = { google: 'Google', bing: 'Bing', youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook', meta: 'Facebook/Instagram', ig: 'Instagram', fb: 'Facebook', tiktok: 'TikTok', x: 'X (Twitter)', whatsapp: 'WhatsApp', chatgpt: 'ChatGPT', tripadvisor: 'Tripadvisor' };
  const pretty = (s) => String(s || '').replace(/_/g, ' ');

  // Canal em português claro, ex.: "Google Ads", "Google (pesquisa orgânica)", "Instagram (bio)"
  const canal = (v) => {
    const s = v.utm_source || 'direto';
    const m = v.utm_medium || '';
    const nome = names[s] || pretty(s);
    if (s === 'direto') return 'Acesso direto (link digitado, salvo ou sem rastreio)';
    if (s === 'google' && isPaid(m)) return 'Google Ads';
    if (['meta', 'facebook', 'instagram', 'fb', 'ig'].includes(s) && isPaid(m)) return `Anúncio ${nome}`;
    if (isPaid(m)) return `Anúncio ${nome}`;
    if (m === 'organic') return `${nome} (pesquisa orgânica)`;
    if (m === 'qrcode') return `QR code (${nome})`;
    if (m === 'referral') return `Site ${nome}`;
    if (m && m !== 'social') return `${nome} (${pretty(m)})`;
    return nome;
  };

  const origem = (v) => {
    if (!v || !v.utm_source) return '';
    const parts = [canal(v)];
    if (v.utm_campaign) parts.push(`campanha: ${pretty(v.utm_campaign)}`);
    if (v.utm_content) parts.push(`anúncio/link: ${pretty(v.utm_content)}`);
    if (v.utm_term) parts.push(`palavra-chave: ${pretty(v.utm_term)}`);
    return parts.join(' · ');
  };

  // Sem informação nova nesta visita (acesso direto) => vale a origem guardada da sessão.
  const hasNewInfo = (v) => v && v.utm_source && v.utm_source !== 'direto';

  return { keys, normalize, read, origem, canal, hasNewInfo };
});
