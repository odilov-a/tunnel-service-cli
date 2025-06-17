# 🌀 MyTunnel CLI

**MyTunnel** — bu lokal portni public URL orqali ochish imkonini beruvchi tunneling CLI. Bu sizning lokal serveringizni tashqi dunyoga xavfsiz tarzda ulash imkonini beradi.

## 📦 O‘rnatish

```bash
git clone https://github.com/yourusername/mytunnel-cli.git
cd mytunnel-cli
npm install
```

Agar global ishlatmoqchi bo‘lsangiz:

```bash
npm link
```

## 🚀 Ishlatish

```bash
node index.mjs -s <subdomain> -p <localPort> -t <token>
```

Yoki `mytunnel` nomi bilan (agar `npm link` qilgan bo‘lsangiz):

```bash
mytunnel -s <subdomain> -p <localPort> -t <token>
```

### ⚙️ Parametrlar:

| Parametr      | Qisqacha | Tavsif                                          | Majburiy |
|---------------|----------|-------------------------------------------------|----------|
| `--subdomain` | `-s`     | Siz tanlagan subdomain nomi (`myapp`, `test1`) | ✅       |
| `--port`      | `-p`     | Lokal port (masalan: `3000`, `5000`)           | ✅       |
| `--token`     | `-t`     | JWT token (sayt orqali login qiling)          | ✅       |

### 🔰 Misol:

```bash
mytunnel -s mycli -p 3000 -t eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Agar muvaffaqiyatli ulanilsa, siz quyidagiga o‘xshash xabarni ko‘rasiz:

```
✔ Connected to tunnel server
🌐 Your public URL: http://localhost:7000/api/tunnels/mycli/
→ Forwarding GET /api/tunnels/mycli/ ➶ http://localhost:3000/
```

## 🔐 Token qayerdan olinadi?

1. Web sayt orqali ro‘yxatdan o‘ting yoki login qiling
2. Shaxsiy sahifangizda **token** hosil qiling
3. Shu tokenni CLI'da ishlating

## ❗️ Xatoliklar

- **"Token not found"** — `-t` parametrini kiritmagansiz
- **"Invalid token"** — token noto‘g‘ri yoki muddati tugagan
- **"Subdomain already in use"** — bu subdomain band, boshqa nom tanlang

## 📄 Litsenziya

MIT

