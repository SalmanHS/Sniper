# تعليمات رفع الكود على GitHub

## المشكلة الحالية
Git ينتظر بيانات المصادقة (Username & Password/Token)

## الحل: استخدم Terminal مباشرة

افتح Terminal في مجلد المشروع وشغل:

```bash
cd /Users/salmanx/BinMa
git push -u origin main
```

### عند طلب المصادقة:

#### 1. Username:
```
SalmanHS
```

#### 2. Password:
**لا تستخدم كلمة المرور العادية!** استخدم Personal Access Token:

**إنشاء Token:**
1. اذهب إلى: https://github.com/settings/tokens
2. اضغط "Generate new token" → "Generate new token (classic)"
3. اسم Token: `BinMa Deploy`
4. اختر Expiration: 90 days (أو أي مدة)
5. ضع علامة على: `repo` (كل الصلاحيات تحته)
6. اضغط "Generate token"
7. **انسخ Token** (يظهر مرة واحدة فقط!)
8. استخدمه ككلمة مرور في Terminal

---

## طريقة بديلة: استخدام SSH (موصى به)

### 1. تحقق من وجود SSH key:
```bash
ls -al ~/.ssh
```

### 2. إن لم يكن موجود، أنشئ واحد:
```bash
ssh-keygen -t ed25519 -C "salooomx@gmail.com"
```
(اضغط Enter 3 مرات)

### 3. انسخ المفتاح العام:
```bash
cat ~/.ssh/id_ed25519.pub
```

### 4. أضفه لـ GitHub:
- اذهب إلى: https://github.com/settings/keys
- اضغط "New SSH key"
- الصق المفتاح
- احفظ

### 5. غير الـ remote لـ SSH:
```bash
cd /Users/salmanx/BinMa
git remote set-url origin git@github.com:SalmanHS/Sniper.git
git push -u origin main
```

---

## التحقق من النجاح

بعد الرفع، افتح:
https://github.com/SalmanHS/Sniper

يجب أن ترى جميع الملفات هناك!

---

## الخطوة التالية: Vercel

بعد رفع الكود على GitHub:
1. اذهب إلى: https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط "Add New Project"
4. اختر `Sniper`
5. اضغط "Deploy"
6. انتظر 2-3 دقائق
7. ✅ الموقع جاهز!
