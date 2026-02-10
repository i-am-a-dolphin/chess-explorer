<div align="center">
  <h1>♟️ Chess Explorer</h1>
  <p>
    <strong>Opening and endgame explorer for chess beginners</strong>
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## ✨ Features

### 🔍 Opening Explorer

- Browse and explore chess openings with an interactive board
- View well-known next moves for any position
- Search through Lichess's extensive opening database
- See opening names and variations in real-time

### 🎯 Puzzle Practice

- Solve chess puzzles from Lichess database
- Multiple puzzle variants and difficulty levels
- Track puzzle ratings and themes

### ♔ Endgame Tablebase

- Access Lichess tablebase for perfect endgame play
- See evaluation and best moves for endgame positions
- Learn optimal endgame technique

### 🌐 Internationalization

- Full support for English and Korean
- Easy to extend to more languages
- Localized opening names and UI

### 🎨 Modern UI

- Clean, responsive design with Tailwind CSS
- Dark mode support
- Smooth animations and transitions
- Mobile-friendly interface

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yongjun21/chess-explorer.git
cd chess-explorer
```

2. Install dependencies

```bash
pnpm install
```

3. Generate Lichess data

```bash
pnpm generate
```

4. Run the development server

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm generate` - Generate opening and puzzle data from Lichess

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Chess Board**: [@lichess-org/chessground](https://github.com/lichess-org/chessground)
- **Chess Logic**: [chess.js](https://github.com/jhlywa/chess.js) + [chessops](https://github.com/niklasf/chessops)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **TypeScript**: Type-safe development
- **Package Manager**: pnpm

---

## 📁 Project Structure

```
chess-explorer/
├── app/                    # Next.js app directory
│   └── [locale]/          # Internationalized routes
├── components/            # React components
│   ├── shadcn-ui/        # shadcn/ui components
│   └── ...               # Custom components
├── features/             # Feature-based modules
│   ├── chess/           # Chess game logic
│   ├── chessground/     # Board UI
│   ├── opening-tree/    # Opening explorer
│   └── puzzle-info/     # Puzzle features
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── messages/            # i18n translations
├── scripts/             # Data generation scripts
├── services/            # API services
└── types/               # TypeScript types
```

---

## 🌍 Data Sources

- **Openings**: [Lichess Opening Explorer](https://lichess.org/api#tag/Opening-Explorer)
- **Puzzles**: [Lichess Puzzle Database](https://database.lichess.org/#puzzles)
- **Endgame Tablebase**: [Lichess Tablebase API](https://lichess.org/api#tag/Tablebase)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Lichess](https://lichess.org/) for providing free chess APIs and data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- The chess community for continuous inspiration

---

<div align="center">
  <p>Made with ♟️ and ❤️</p>
  <p>
    <a href="https://github.com/i-am-a-dolphin/chess-explorer">⭐ Star this repo</a>
  </p>
</div>
