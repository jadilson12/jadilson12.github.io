# 🎨 Ícones do jadilson.dev

Este diretório contém os ícones do site em formato SVG (vetorial) e PNG.

## 📁 Arquivos

- `icon.svg` - Ícone principal em formato vetorial (recomendado)
- `icon-{size}x{size}.png` - Ícones em diferentes tamanhos para PWA

## 🔧 Como gerar os PNGs a partir do SVG

### Opção 1: Usando rsvg-convert (Recomendado)

```bash
# Instalar rsvg-convert
brew install librsvg

# Gerar todos os ícones
node scripts/generate-icons.js
```

### Opção 2: Usando online converter

Você pode usar https://convertio.co/svg-png/ ou https://cloudconvert.com/svg-to-png para converter manualmente os tamanhos necessários:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Opção 3: Usando sips (macOS nativo)

O sips não suporta SVG diretamente, por isso é necessário primeiro ter um PNG base.

## 🎨 Design

Os ícones foram criados com:
- **Cores**: Preto (#0a0a0a) + Verde-limão (#c9f31d, #a3e635)
- **Estilo**: Minimalista, moderno, com efeitos de brilho
- **Logo**: Monograma "JD" estilizado + ".dev"
