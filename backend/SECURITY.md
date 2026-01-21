# Security Implementation - Telkom Asset Management

## Keamanan yang Telah Diimplementasikan

### ✅ 1. Environment Variables (.env)
- JWT Secret disimpan di environment variables
- Konfigurasi CORS yang dapat dikustomisasi
- Rate limiting yang dapat dikonfigurasi
- WAJIB set JWT_SECRET minimal 32 karakter

### ✅ 2. Authentication & Authorization
- JWT token dengan expiry time
- Middleware authentication untuk semua protected routes
- Role-based access control (Admin, Teknisi)
- Token verification yang aman

### ✅ 3. Rate Limiting
- General API: 100 requests per 15 menit
- Login endpoint: 5 attempts per 15 menit (anti brute force)
- Automatic IP blocking sementara

### ✅ 4. CORS Protection
- Whitelist domain yang diizinkan
- Credentials support
- Method restriction

### ✅ 5. Input Validation & Sanitization
- Express-validator untuk semua input
- Status validation (hanya To-Do, In Progress, Done)
- Username/password format validation
- XSS protection

### ✅ 6. Security Headers (Helmet)
- Content Security Policy
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### ✅ 7. Error Handling
- Logging semua errors
- Hide internal errors di production
- Specific error messages untuk debugging (dev only)

### ✅ 8. Logging (Morgan)
- Development: detailed logs
- Production: combined format
- Track semua HTTP requests

## Cara Deploy ke Production

### 1. Update .env file
```bash
NODE_ENV=production
JWT_SECRET=your-super-strong-secret-key-min-32-characters-random
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 2. Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup HTTPS
- Gunakan reverse proxy (Nginx/Apache)
- Install SSL certificate (Let's Encrypt)
- Redirect HTTP ke HTTPS

### 4. Database
- Pertimbangkan upgrade ke PostgreSQL/MySQL untuk production
- Setup regular backup
- Enable foreign keys dan constraints

### 5. Monitoring
- Setup logging service (ELK Stack, CloudWatch)
- Setup uptime monitoring
- Alert untuk failed login attempts

### 6. Firewall & Network
- Restrict database port (jangan expose ke public)
- Whitelist IP jika memungkinkan
- DDoS protection (Cloudflare, AWS Shield)

## Best Practices Tambahan

1. **Password Policy**
   - Minimum 8 karakter
   - Kombinasi huruf besar, kecil, angka, simbol
   - Password rotation setiap 90 hari

2. **Session Management**
   - Token expiry: 2 jam (sudah diimplementasi)
   - Refresh token untuk long session
   - Logout dari semua device

3. **Audit Logging**
   - Log semua perubahan data
   - Track who, when, what
   - Retention policy

4. **Backup Strategy**
   - Daily automated backup
   - Off-site backup storage
   - Test restore procedure

5. **Security Updates**
   - Regular dependency updates
   - Security patch monitoring
   - Vulnerability scanning

## Testing Security

```bash
# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:4000/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"wrong"}'; done

# Test authentication
curl -X GET http://localhost:4000/api/reports
# Should return 401 Unauthorized

# Test CORS
curl -X GET http://localhost:4000/api/health -H "Origin: http://malicious.com"
# Should be blocked
```

## Production Checklist

- [ ] JWT_SECRET diset dengan nilai random minimal 32 karakter
- [ ] NODE_ENV=production
- [ ] ALLOWED_ORIGINS hanya domain production
- [ ] HTTPS enabled
- [ ] Database backup automated
- [ ] Logging setup
- [ ] Monitoring setup
- [ ] Firewall configured
- [ ] Rate limiting tested
- [ ] Change default passwords
- [ ] Security headers verified
