# دليل النشر على Vercel

## خطوات النشر

### الطريقة الأولى: استخدام Vercel CLI (الأسرع)

```bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. تسجيل الدخول
vercel login

# 3. رفع المشروع (اختبار)
vercel

# 4. رفع للإنتاج
vercel --prod
```

### الطريقة الثانية: استخدام GitHub (موصى به)

1. **ارفع المشروع على GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/BinMa.git
   git push -u origin main
   ```

2. **اربط المشروع مع Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل الدخول بحساب GitHub
   - اضغط "Add New Project"
   - اختر المستودع `BinMa`
   - Vercel سيكتشف تلقائياً أنه Nuxt 3
   - اضغط "Deploy"

3. **انتظر حتى يكتمل البناء** (عادة 2-3 دقائق)

## ملاحظات مهمة

### ⚠️ قاعدة البيانات

**المشكلة:** ملف `users.json` سيُحفظ في `/tmp` في Vercel، وهذا يعني:
- البيانات ستُحذف عند كل إعادة نشر (redeploy)
- البيانات ستُحذف بعد فترة من عدم الاستخدام

**الحلول المقترحة:**

1. **استخدام Vercel KV** (موصى به للإنتاج)
   ```bash
   # تثبيت Vercel KV
   npm install @vercel/kv
   ```

2. **استخدام Supabase** (موصى به للإنتاج)
   - أنشئ حساب على [supabase.com](https://supabase.com)
   - أنشئ مشروع جديد
   - استخدم Supabase كقاعدة بيانات

3. **استخدام MongoDB Atlas** (مجاني)
   - أنشئ حساب على [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - استخدم MongoDB كقاعدة بيانات

### ✅ ما تم إعداده

- ✅ ملف `vercel.json` - إعدادات Vercel
- ✅ ملف `.vercelignore` - ملفات مستثناة من الرفع
- ✅ تحديث `nuxt.config.ts` - إضافة preset Vercel
- ✅ تحديث جميع API endpoints - دعم `/tmp` في Vercel

### Environment Variables

لا حاجة لإضافة متغيرات بيئية حالياً. جميع الإعدادات موجودة في `nuxt.config.ts`.

## بعد النشر

1. **اختبر الموقع:**
   - افتح الرابط الذي أعطاك إياه Vercel
   - جرب تسجيل حساب جديد
   - جرب تسجيل الدخول

2. **تعيين مدير:**
   - بعد أول تسجيل، استخدم API endpoint:
   ```bash
   curl -X POST https://YOUR_DOMAIN.vercel.app/api/users/set-admin \
     -H "Content-Type: application/json" \
     -d '{"email": "salooomx@gmail.com"}'
   ```

## تحديثات مستقبلية

عند تحديث الكود:
```bash
git add .
git commit -m "Update"
git push
```

Vercel سيقوم تلقائياً بإعادة البناء والنشر.

## الدعم

إذا واجهت مشاكل:
1. تحقق من logs في Vercel Dashboard
2. تأكد من أن جميع dependencies مثبتة
3. تأكد من أن build ينجح محلياً: `npm run build`
