const assert = require('node:assert/strict');
const { read, origem, normalize, hasNewInfo } = require('../js/utm.js');
let n = 0; const t = (got, want) => { assert.equal(got, want); n++; };

// Google Ads (auto-tagging): gclid sem UTM, vindo do google.com
t(origem(read('?gclid=abc', 'https://www.google.com/')), 'Google Ads');
t(read('?gclid=abc', '').utm_medium, 'cpc');
t(read('?gclid=abc', '').gclid, 'abc');
t(origem(read('?gbraid=x', '')), 'Google Ads');
t(origem(read('?wbraid=x', '')), 'Google Ads');
// Google Ads com modelo de rastreamento (UTM + palavra-chave)
t(origem(read('?utm_source=google&utm_medium=cpc&utm_campaign=caverna_chapada&utm_term=caverna+torrinha&gclid=1', '')), 'Google Ads · campanha: caverna chapada · palavra-chave: caverna torrinha');
// Google orgânico e outros buscadores
t(origem(read('', 'https://www.google.com.br/')), 'Google (pesquisa orgânica)');
t(origem(read('', 'https://www.bing.com/search?q=x')), 'Bing (pesquisa orgânica)');
// Redes sociais
t(origem(read('?fbclid=x', '')), 'Facebook/Instagram');
t(origem(read('', 'https://l.instagram.com/')), 'Instagram');
t(origem(read('?utm_source=instagram&utm_medium=bio', '')), 'Instagram (bio)');
t(origem(read('?utm_source=facebook&utm_medium=paid_social&utm_campaign=verao&utm_content=video1', '')), 'Anúncio Facebook · campanha: verao · anúncio/link: video1');
t(origem(read('', 'https://youtube.com/watch')), 'YouTube');
t(origem(read('?utm_source=youtube&utm_medium=video&utm_content=descricao', '')), 'YouTube (video) · anúncio/link: descricao');
// QR code, sites parceiros e acesso direto
t(origem(read('?utm_source=pousada_x&utm_medium=qrcode', '')), 'QR code (pousada x)');
t(origem(read('', 'https://www.tripadvisor.com.br/x')), 'Site Tripadvisor');
t(origem(read('', '')), 'Acesso direto (link digitado, salvo ou sem rastreio)');
t(origem(read('', 'https://cavernatorrinha.com/termos.html')), 'Acesso direto (link digitado, salvo ou sem rastreio)');
// Regras auxiliares
t(hasNewInfo(read('', '')), false);
t(hasNewInfo(read('?gclid=1', '')), true);
t(normalize(' Áçento <teste>! '), '__ento__teste__');
console.log(`UTM tests: ${n} passed`);
