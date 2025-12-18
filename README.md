# Lunar Calendar App - Lịch Âm Dương Việt Nam

Ứng dụng lịch âm dương Việt Nam với tính năng tính ngày lễ, giờ hoàng đạo, và quản lý sự kiện cá nhân.

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **date-fns** - Date Utilities
- **Vitest** - Testing

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd lunar-calendar-app

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Chạy tests
npm run test
```

## Tính năng chính

- Hiển thị lịch âm dương song song
- Tính toán ngày lễ âm lịch Việt Nam
- Xem giờ hoàng đạo, hắc đạo
- Quản lý sự kiện cá nhân
- Giao diện responsive, hỗ trợ mobile
- Dark mode support

## Deploy lên Vercel

1. Push code lên GitHub
2. Truy cập [vercel.com](https://vercel.com)
3. Import repository từ GitHub
4. Vercel tự động detect Vite config
5. Click "Deploy"

Hoặc dùng Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Deploy lên Netlify

1. Push code lên GitHub
2. Truy cập [netlify.com](https://netlify.com)
3. "Add new site" > "Import an existing project"
4. Chọn repository
5. Build settings đã được config trong `netlify.toml`
6. Click "Deploy site"

Hoặc dùng Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Screenshots

<!-- Thêm screenshots ở đây -->
![Calendar View](./screenshots/calendar.png)
![Event Modal](./screenshots/event-modal.png)
![Mobile View](./screenshots/mobile.png)

## Cấu trúc thư mục

```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── stores/         # Zustand stores
├── utils/          # Utility functions
├── types/          # TypeScript types
└── App.tsx         # Main app component
```

## License

MIT
# licham
