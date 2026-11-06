# Links com rastreamento (UTM)

Toda mensagem que chega pelo WhatsApp do site termina com uma linha **"Origem: …"**
dizendo de onde a pessoa veio. Para essa linha ser precisa, use os links abaixo.
Nomes sempre em minúsculas, sem acento e sem espaço (use `_`).

Base: `https://cavernatorrinha.com/`

## Google Ads (mais importante)

O auto-tagging (gclid) já faz a mensagem dizer **"Google Ads"**. Para também saber a
**campanha** e a **palavra-chave**, coloque este **modelo de rastreamento** na conta
(Administrador → Configurações da conta → Rastreamento → Modelo de rastreamento):

```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

Resultado na mensagem: `Origem: Google Ads · campanha: 123456 · anúncio/link: 789 · palavra-chave: caverna torrinha`
(o número da campanha aparece no Google Ads, na coluna "ID da campanha").

## Redes sociais e outros

| Onde o link fica | Link | Aparece como |
|---|---|---|
| Instagram – bio | `?utm_source=instagram&utm_medium=bio` | Instagram (bio) |
| Instagram – stories | `?utm_source=instagram&utm_medium=story` | Instagram (story) |
| Facebook – página | `?utm_source=facebook&utm_medium=pagina` | Facebook (pagina) |
| Meta Ads | `?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` | Anúncio Facebook/Instagram · campanha · anúncio |
| YouTube – descrição | `?utm_source=youtube&utm_medium=video&utm_content=descricao` | YouTube (video) |
| Perfil da empresa no Google (Maps) | `?utm_source=google&utm_medium=perfil_empresa` | Google (perfil empresa) |
| QR code em parceiro | `?utm_source=NOME_DO_PARCEIRO&utm_medium=qrcode` | QR code (nome do parceiro) |

## Sem UTM

Sem parâmetros, o site tenta adivinhar pelo site anterior: Google/Bing orgânico,
Instagram, Facebook, YouTube, TikTok, Tripadvisor, ChatGPT etc. Aplicativos como
Instagram e WhatsApp muitas vezes **não informam** o site anterior; nesses casos aparece
"Acesso direto" — por isso vale usar sempre os links acima.

Para testar, abra o site com `&utm_debug=1` no fim do link e veja o console do navegador.
