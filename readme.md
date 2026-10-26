# demoblaze-qa-automation

Bộ test tự động cho [demoblaze.com](https://www.demoblaze.com), viết bằng Playwright + TypeScript.

## Yêu cầu

- Node.js 20 trở lên (đang dùng Node 24)
- npm

## Cài đặt

```bash
# 1. Cài dependencies
npm install

# 2. Tải browser cho Playwright (Chromium, Firefox, WebKit)
npx playwright install

# 3. Linux: cài thư viện hệ thống mà browser cần (cần sudo, bắt buộc với WebKit)
sudo npx playwright install-deps

# 4. Tạo file biến môi trường
cp .env.example .env
```

## Biến môi trường

Khai báo trong file `.env`. Biến nào không khai báo thì dùng giá trị mặc định.

| Biến       | Mặc định                     | Dùng cho                              |
| ---------- | ---------------------------- | ------------------------------------- |
| `BASE_URL` | `https://www.demoblaze.com`  | Test UI (project chromium/firefox/webkit) |
| `API_URL`  | `https://api.demoblaze.com`  | Test API (project `api`)              |
| `CI`       | _(không đặt)_                | Bật retry 2 lần, chặn `test.only`     |

## Chạy test

| Lệnh                     | Tác dụng                                  |
| ------------------------ | ----------------------------------------- |
| `npm test`               | Chạy tất cả project                       |
| `npm run test:api`       | Chỉ chạy test API (`02.test/00.integration`) |
| `npm run test:e2e`       | Chạy test UI trên cả 3 browser (`02.test/01.e2e`) |
| `npm run test:chromium`  | Chạy test UI chỉ trên Chromium            |
| `npm run test:headed`    | Chạy trên Chromium, có mở cửa sổ browser  |
| `npm run test:ui`        | Mở Playwright UI mode để chạy và debug    |
| `npm run report`         | Mở HTML report của lần chạy gần nhất      |
| `npm run typecheck`      | Kiểm tra lỗi TypeScript                   |

Chạy riêng một file hoặc một test:

```bash
npx playwright test 02.test/01.e2e/login.spec.ts
npx playwright test -g "tên test"
```

Khi test lỗi, trace, screenshot và video được lưu trong `test-results/`. Xem trace bằng `npx playwright show-trace <đường dẫn trace.zip>`.

## Cấu trúc thư mục

```
00.test_case/          Tài liệu test case
01.src/
  00.infras/           Lớp nền: base page, API client
  01.business/         Page object và luồng nghiệp vụ
  02.fixture/          Playwright fixtures
  03.data/             Dữ liệu test
  04.utils/            Hàm tiện ích
02.test/
  00.integration/      Test API (project `api`)
  01.e2e/              Test UI (project chromium/firefox/webkit)
  02.perf/             Test hiệu năng (Playwright không chạy thư mục này)
03.config/             Cấu hình môi trường (env.ts)
playwright.config.ts   Cấu hình Playwright
```

Có thể import theo alias thay cho đường dẫn tương đối: `@config/*`, `@infras/*`, `@business/*`, `@fixture/*`, `@data/*`, `@utils/*` (khai báo trong `tsconfig.json`).
