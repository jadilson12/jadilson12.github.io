# Cartão de compartilhamento

Home, blog, sobre e contato usam `/og/profile-card/image.png` em `og:image` e
`twitter:image`, com dimensões de 1200 × 630, tipo `image/png` e texto
alternativo. A URL é absoluta e identifica o domínio principal. Os artigos
mantêm suas próprias capas com título e assuntos.

O cartão é gerado no build por `ImageResponse`, a partir de
`src/components/og/ProfileCard.tsx`. Nome, profissão e caminho da foto vêm de
`src/lib/site.ts`. A foto pública usada no site foi incorporada em
`public/images/jadilson-guedes.jpg`, obtida de
`https://github.com/jadilson12.png?size=640`; a geração da imagem não precisa
consultar o GitHub. Para atualizar o retrato, substitua esse arquivo e faça um
novo build.

O endereço anterior `/og/site/image.png` continua funcionando e também renderiza
o cartão. O novo endereço permite distinguir a imagem das versões antigas já
armazenadas por serviços de compartilhamento.

Para conferir localmente, abra
`http://localhost:3000/og/profile-card/image.png`. Depois do build, execute
`yarn check:seo` para validar o arquivo PNG, dimensões e metadados, incluindo o
uso do cartão nas quatro páginas. Os workflows de publicação executam essa
verificação antes do deploy.

Os metadados ficam no HTML estático e a imagem é exportada como PNG, sem exigir
JavaScript de quem busca a prévia. Após publicar, serviços de compartilhamento
podem manter uma prévia antiga em cache até consultar a página novamente. Os
ícones fazem parte da imagem; o link compartilhado abre a página do site.
