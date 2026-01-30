# إعداد GitHub

## الخطوات المتبقية:

### 1. إنشاء Repository على GitHub

1. اذهب إلى [github.com](https://github.com)
2. اضغط على زر "+" في الأعلى
3. اختر "New repository"
4. اسم المستودع: `BinMa` (أو أي اسم تفضله)
5. اختر **Private** (للمشاريع الخاصة)
6. **لا** تضع علامة على "Initialize with README"
7. اضغط "Create repository"

### 2. ربط المشروع مع GitHub

بعد إنشاء المستودع، GitHub سيعطيك أوامر. استخدم هذه الأوامر:

```bash
# استبدل YOUR_USERNAME باسم المستخدم على GitHub
git remote add origin https://github.com/YOUR_USERNAME/BinMa.git
git branch -M main
git push -u origin main
```

أو إذا كنت تستخدم SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/BinMa.git
git branch -M main
git push -u origin main
```

### 3. التحقق

بعد الرفع، اذهب إلى المستودع على GitHub وتأكد من أن جميع الملفات موجودة.

## ملاحظة

- ملف `data/users.json` لن يُرفع (محمي في .gitignore)
- جميع الملفات الأخرى جاهزة للرفع
