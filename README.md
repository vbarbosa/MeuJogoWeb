# MeuJogoWeb — Breakout Web 🎮

Versão **Blazor WebAssembly** do clássico Breakout com uma reviravolta: a bolinha sofre **gravidade**, que aumenta conforme sua pontuação sobe. Roda inteiramente no navegador, sem backend.

É a versão web do projeto desktop [BreakoutPC_Controlled](https://github.com/vbarbosa/BreakoutPC_Controlled).

## Como jogar

- Use as **setas do teclado** (← →) para mover a barra vermelha.
- Impeça que a bolinha caia — cada rebatida vale ponto.
- A **gravidade aumenta** com o score, deixando o jogo progressivamente mais difícil.

## Stack

- **.NET 9** / Blazor WebAssembly
- Renderização via `<canvas>` HTML5 (interop JS)
- Bootstrap para o layout

## Rodando localmente

Pré-requisito: [.NET 9 SDK](https://dotnet.microsoft.com/download).

```bash
dotnet restore
dotnet run
```

Acesse a URL exibida no terminal (normalmente `https://localhost:5001`).

## Build de produção

```bash
dotnet publish -c Release
```

Os arquivos estáticos ficam em `bin/Release/net9.0/publish/wwwroot` e podem ser hospedados em qualquer host estático.

## Deploy

O repositório inclui um workflow de **Azure Static Web Apps** em [.github/workflows](.github/workflows/) que publica automaticamente a cada push.

## Licença

Veja [LICENSE.txt](LICENSE.txt).
