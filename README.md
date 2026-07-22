# DocWave

Ferramentas de manipulação de PDF que rodam **inteiramente no navegador**. Nenhum arquivo enviado pelo usuário sai do dispositivo — sem upload para servidor, sem cadastro, sem espera de fila de processamento.

## Por que client-side?

Privacidade é o diferencial de produto do DocWave. Mesclar, dividir, assinar ou remover a senha de um documento não deveria exigir confiar seu conteúdo a um servidor de terceiros. Todo o processamento — incluindo OCR e assinatura digital — acontece em WebAssembly/JS diretamente no navegador do usuário.

## Ferramentas

| Ferramenta | Rota | Descrição |
| --- | --- | --- |
| Organizar PDF | `/organizar` | Reordene, gire e remova páginas |
| Mesclar PDFs | `/mesclar` | Combine vários arquivos em um só |
| Dividir PDF | `/dividir` | Separe páginas em arquivos individuais (.zip) |
| Girar PDF | `/girar` | Gire páginas em 90° |
| Comprimir PDF | `/comprimir` | Reduza o tamanho recomprimindo páginas como imagem |
| Marca d'água | `/marca-dagua` | Adicione texto sobre todas as páginas |
| Numerar páginas | `/numerar-paginas` | Numeração automática "N / total" |
| PDF para imagem | `/pdf-para-imagem` | Exporte páginas como PNG |
| Imagem para PDF | `/imagem-para-pdf` | Combine imagens (PNG/JPG) em um PDF |
| PDF para texto | `/pdf-para-texto` | Extraia o texto para `.docx` |
| OCR | `/ocr` | Reconheça texto em PDFs escaneados (PT/EN) |
| Proteger PDF | `/proteger` | Adicione uma senha ao arquivo |
| Remover senha | `/remover-senha` | Remova a senha de um PDF protegido |
| Assinar PDF | `/assinar` | Assinatura digital real (PKCS#7) com certificado `.p12` próprio |

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS**
- **[@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib)** — fork MIT de `pdf-lib` com suporte a criptografia (merge, split, rotação, marca d'água, numeração, proteger/remover senha, comprimir)
- **[pdfjs-dist](https://mozilla.github.io/pdf.js/)** — preview de páginas, renderização e extração de texto
- **[tesseract.js](https://github.com/naptha/tesseract.js)** — OCR (WebAssembly + Web Worker próprios)
- **[@signpdf/signpdf](https://github.com/vbuch/node-signpdf)** + **[node-forge](https://github.com/digitalbazaar/forge)** — assinatura digital PKCS#7
- **docx**, **fflate** — geração de `.docx` e `.zip` no navegador
- **zustand** — estado do documento atual
- **Vitest** + **Playwright** — testes unitários e end-to-end

> `pdf-lib` (puro) e `mupdf` foram avaliados e descartados: o primeiro não suporta criptografia e o segundo é licenciado AGPL-3.0, o que exigiria abrir todo o código do projeto sob a mesma licença — por isso o projeto usa `@cantoo/pdf-lib`.

## Como rodar localmente

Pré-requisitos: Node.js 20.9+ e npm.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de produção (Turbopack)
npm start       # serve o build de produção
npm run lint    # ESLint
```

## Testes

```bash
npm test         # testes unitários (Vitest) — lib/pdf/*
npm run test:e2e # end-to-end (Playwright) — upload → processar → download
```

Os testes unitários rodam em Node puro, gerando PDFs de amostra em memória com `@cantoo/pdf-lib`. Os testes e2e sobem o próprio dev server e cobrem mesclar, dividir e proteger.

## Estrutura do projeto

```
app/
  page.tsx              landing page (grid de ferramentas)
  sitemap.ts, robots.ts  SEO
  (tools)/<ferramenta>/  uma rota por ferramenta
components/              PdfWorkspace, ToolLayout e formulários de cada ferramenta
lib/
  pdf/                   uma função pura por operação (merge, split, sign, ocr, ...)
  tools.ts               lista central de ferramentas (landing + sitemap)
store/                   estado global (zustand) do documento atual
test/
  unit/                  Vitest
  e2e/                   Playwright
```

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL base usada em `metadataBase`/Open Graph, `sitemap.xml` e `robots.txt`. Sem ela, cai em um placeholder — configure ao publicar o domínio real. |

## Limitações conhecidas

- **PDF → texto**: exporta apenas o texto, sem reconstrução de layout, tabelas ou imagens — restrição inerente a rodar 100% no navegador.
- **Assinatura digital**: aplica uma assinatura PKCS#7 real, mas exige que o usuário forneça seu próprio certificado `.p12`/`.pfx`. O DocWave não emite certificados nem verifica identidade.
- **OCR**: reconhece apenas português e inglês nesta fase.
