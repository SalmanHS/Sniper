# إعداد SSH Key

## تم إنشاء SSH Key بنجاح! ✅

## الخطوة التالية: أضف المفتاح لـ GitHub

### 1. افتح هذا الرابط:
https://github.com/settings/ssh/new

### 2. املأ البيانات:
- **Title**: `BinMa MacBook`
- **Key**: انسخ المفتاح التالي (يبدأ بـ `ssh-ed25519`)

### 3. اضغط "Add SSH key"

---

## بعد إضافة المفتاح في GitHub:

شغل هذا الأمر في Terminal:

```bash
cd /Users/salmanx/BinMa
ssh -T git@github.com
# سيطلب منك تأكيد - اكتب: yes
# يجب أن ترى رسالة نجاح

git push -u origin main
```

✅ الكود سيُرفع مباشرة بدون طلب password!
