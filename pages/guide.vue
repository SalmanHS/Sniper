<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-l from-primary/20 to-success/20 rounded-2xl p-10 text-center shadow-lg">
      <div class="text-6xl mb-4">📖</div>
      <h1 class="text-4xl font-bold mb-3">دليل استخدام المنصة</h1>
      <p class="text-text-secondary text-lg">
        كل ما تحتاج معرفته لاستخدام SniperFlow بشكل احترافي
      </p>
    </div>

    <!-- Table of Contents -->
    <div class="bg-bg-secondary rounded-2xl p-8 shadow-lg">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>📋</span>
        المحتويات
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          v-for="(section, index) in sections"
          :key="index"
          :href="`#${section.id}`"
          class="flex items-center gap-3 p-4 bg-bg-tertiary rounded-xl hover:bg-border-color transition-all hover:scale-105"
        >
          <span class="text-2xl">{{ section.icon }}</span>
          <div>
            <div class="font-bold">{{ section.title }}</div>
            <div class="text-xs text-text-secondary">{{ section.subtitle }}</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Section 1: Introduction -->
    <div id="intro" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>🚀</span>
        ما هو SniperFlow؟
      </h2>
      <div class="space-y-4 text-text-secondary leading-relaxed">
        <p class="text-lg">
          <strong class="text-text-primary">SniperFlow</strong> هي منصة تحليلية احترافية متخصصة في تحليل بيانات سوق بينانس في الوقت الفعلي.
        </p>
        <p>
          توفر المنصة أدوات متقدمة لكشف تحركات الحيتان (المؤسسات والمتداولين الكبار)، وتحليل معنويات السوق، 
          وتقديم تنبيهات فورية عند حدوث فرص تداول مهمة.
        </p>
        <div class="bg-primary/10 border-r-4 border-primary p-6 rounded-lg mt-6">
          <div class="font-bold text-primary mb-2">💡 لماذا SniperFlow؟</div>
          <ul class="space-y-2 text-sm">
            <li>✅ تحديثات فورية كل 15 ثانية</li>
            <li>✅ كشف امتصاص الحيتان قبل حركة السعر</li>
            <li>✅ مؤشرات فنية قابلة للتخصيص</li>
            <li>✅ تنبيهات صوتية وإشعارات</li>
            <li>✅ سجل كامل لجميع التنبيهات</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Section 2: Absorption Detection -->
    <div id="absorption" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>🐋</span>
        كشف الامتصاص (Absorption)
      </h2>
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-bold mb-3 text-primary">ما هو الامتصاص؟</h3>
          <p class="text-text-secondary leading-relaxed">
            الامتصاص هو ظاهرة تحدث عندما تقوم المؤسسات الكبرى (الحيتان) بامتصاص أوامر الشراء أو البيع 
            في السوق دون تحريك السعر بشكل ملحوظ. هذه إشارة قوية على وجود تراكم أو توزيع خفي.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bullish Absorption -->
          <div class="bg-success/10 border-2 border-success rounded-xl p-6">
            <div class="text-4xl mb-3">🚀</div>
            <h4 class="text-xl font-bold mb-3 text-success">امتصاص صعودي (Bullish)</h4>
            <div class="space-y-2 text-sm text-text-secondary">
              <p class="leading-relaxed">
                يحدث عندما تقوم المؤسسات الكبرى بشراء كميات ضخمة من العملة رغم وجود ضغط بيع في السوق، 
                مما يمنع السعر من الانخفاض ويشير إلى تراكم خفي.
              </p>
              <p class="mt-3"><strong class="text-success">الإشارة:</strong></p>
              <p>فرصة محتملة للشراء - توقع ارتفاع قريباً! 📈</p>
            </div>
          </div>

          <!-- Bearish Absorption -->
          <div class="bg-danger/10 border-2 border-danger rounded-xl p-6">
            <div class="text-4xl mb-3">📉</div>
            <h4 class="text-xl font-bold mb-3 text-danger">امتصاص هبوطي (Bearish)</h4>
            <div class="space-y-2 text-sm text-text-secondary">
              <p class="leading-relaxed">
                يحدث عندما تقوم المؤسسات الكبرى ببيع كميات ضخمة من العملة رغم وجود ضغط شراء في السوق، 
                مما يمنع السعر من الارتفاع ويشير إلى توزيع خفي.
              </p>
              <p class="mt-3"><strong class="text-danger">الإشارة:</strong></p>
              <p>فرصة محتملة للبيع - توقع انخفاض قريباً! 📉</p>
            </div>
          </div>
        </div>

        <div class="bg-primary/10 border-r-4 border-primary p-6 rounded-lg">
          <div class="font-bold text-primary mb-2">🔒 نظام كشف متقدم:</div>
          <p class="text-sm text-text-secondary leading-relaxed">
            يستخدم SniperFlow خوارزميات متطورة لتحليل بيانات السوق في الوقت الفعلي، بما في ذلك دفتر الأوامر، 
            تدفق الصفقات، وحركة الأسعار لاكتشاف الامتصاص تلقائياً. يتم التحديث كل 15 ثانية لضمان أعلى دقة ممكنة.
          </p>
        </div>
      </div>
    </div>

    <!-- Section 3: Market Sentiment -->
    <div id="sentiment" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>📊</span>
        تحليل معنويات السوق
      </h2>
      <div class="space-y-6">
        <p class="text-text-secondary leading-relaxed">
          يستخدم النظام <strong class="text-primary">نظام التصويت الذكي</strong> لتحليل معنويات السوق بناءً على:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-bg-tertiary rounded-xl p-6">
            <div class="text-3xl mb-3">📈</div>
            <h4 class="font-bold mb-2">حركة السعر</h4>
            <p class="text-sm text-text-secondary">
              تحليل اتجاه وزخم حركة السعر الفعلية
            </p>
          </div>
          <div class="bg-bg-tertiary rounded-xl p-6">
            <div class="text-3xl mb-3">💹</div>
            <h4 class="font-bold mb-2">ضغط التداول</h4>
            <p class="text-sm text-text-secondary">
              قياس قوة الشراء مقابل البيع
            </p>
          </div>
          <div class="bg-bg-tertiary rounded-xl p-6">
            <div class="text-3xl mb-3">⚖️</div>
            <h4 class="font-bold mb-2">توازن السوق</h4>
            <p class="text-sm text-text-secondary">
              تحليل توازن دفتر الأوامر
            </p>
          </div>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6">
          <h4 class="font-bold mb-4">التصنيفات:</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🚀</span>
              <div class="flex-1">
                <span class="font-bold text-success">صعودي قوي - انصح بالشراء</span>
                <p class="text-xs text-text-secondary">إشارات قوية للصعود</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-2xl">📈</span>
              <div class="flex-1">
                <span class="font-bold text-success">صعودي - فرصة شراء</span>
                <p class="text-xs text-text-secondary">اتجاه صعودي واضح</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-2xl">⏸️</span>
              <div class="flex-1">
                <span class="font-bold text-warning">محايد - انتظر</span>
                <p class="text-xs text-text-secondary">لا يوجد اتجاه واضح</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-2xl">📉</span>
              <div class="flex-1">
                <span class="font-bold text-danger">هبوطي - فرصة بيع</span>
                <p class="text-xs text-text-secondary">اتجاه هبوطي واضح</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-2xl">💥</span>
              <div class="flex-1">
                <span class="font-bold text-danger">هبوطي قوي - انصح بالبيع</span>
                <p class="text-xs text-text-secondary">إشارات قوية للهبوط</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Technical Indicators -->
    <div id="indicators" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>📊</span>
        المؤشرات الفنية
      </h2>
      <div class="space-y-6">
        <p class="text-text-secondary leading-relaxed">
          يوفر الشارت 6 مؤشرات فنية احترافية قابلة للتخصيص الكامل:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- EMA -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">EMA (المتوسط المتحرك الأسي)</h4>
            <p class="text-sm text-text-secondary mb-3">
              متوسط متحرك يعطي وزناً أكبر للأسعار الأحدث
            </p>
            <div class="text-xs space-y-1">
              <div>• قابل للتخصيص (5-200 فترة)</div>
              <div>• اختيار اللون</div>
              <div>• مثالي لتحديد الاتجاه</div>
            </div>
          </div>

          <!-- SMA -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">SMA (المتوسط المتحرك البسيط)</h4>
            <p class="text-sm text-text-secondary mb-3">
              متوسط حسابي بسيط للأسعار
            </p>
            <div class="text-xs space-y-1">
              <div>• قابل للتخصيص (5-200 فترة)</div>
              <div>• اختيار اللون</div>
              <div>• مثالي للدعم والمقاومة</div>
            </div>
          </div>

          <!-- Bollinger Bands -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">Bollinger Bands</h4>
            <p class="text-sm text-text-secondary mb-3">
              نطاقات تحدد التقلبات والمستويات المتطرفة
            </p>
            <div class="text-xs space-y-1">
              <div>• الفترة (10-50)</div>
              <div>• الانحراف المعياري (1-3)</div>
              <div>• 3 خطوط (Upper, Middle, Lower)</div>
            </div>
          </div>

          <!-- RSI -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">RSI (مؤشر القوة النسبية)</h4>
            <p class="text-sm text-text-secondary mb-3">
              يقيس قوة حركة السعر
            </p>
            <div class="text-xs space-y-1">
              <div>• الفترة (5-30)</div>
              <div>• &gt;70 = ذروة شراء</div>
              <div>• &lt;30 = ذروة بيع</div>
            </div>
          </div>

          <!-- MACD -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">MACD</h4>
            <p class="text-sm text-text-secondary mb-3">
              يكشف تغيرات الزخم والاتجاه
            </p>
            <div class="text-xs space-y-1">
              <div>• الإعدادات: (12, 26, 9)</div>
              <div>• خط MACD وخط الإشارة</div>
              <div>• هيستوجرام</div>
            </div>
          </div>

          <!-- Volume -->
          <div class="bg-bg-tertiary rounded-xl p-6">
            <h4 class="font-bold mb-3 text-primary">Volume (حجم التداول)</h4>
            <p class="text-sm text-text-secondary mb-3">
              يظهر حجم التداول لكل شمعة
            </p>
            <div class="text-xs space-y-1">
              <div>• إظهار/إخفاء</div>
              <div>• أخضر للصعود، أحمر للهبوط</div>
              <div>• يظهر أسفل الشارت</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: How to Use -->
    <div id="howto" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>🎯</span>
        كيفية الاستخدام
      </h2>
      <div class="space-y-6">
        <!-- Step 1 -->
        <div class="bg-gradient-to-l from-primary/10 to-transparent rounded-xl p-6 border-r-4 border-primary">
          <div class="flex items-start gap-4">
            <div class="text-3xl font-bold text-primary">1</div>
            <div class="flex-1">
              <h4 class="font-bold text-lg mb-2">اختر العملة</h4>
              <p class="text-text-secondary text-sm">
                من الصفحة الرئيسية، اختر العملة التي تريد تحليلها من القائمة أو من العملات الشائعة
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-gradient-to-l from-success/10 to-transparent rounded-xl p-6 border-r-4 border-success">
          <div class="flex items-start gap-4">
            <div class="text-3xl font-bold text-success">2</div>
            <div class="flex-1">
              <h4 class="font-bold text-lg mb-2">اذهب للتحليلات المتقدمة</h4>
              <p class="text-text-secondary text-sm">
                اضغط على زر "التحليلات المتقدمة" لعرض جميع الأدوات والمؤشرات
              </p>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="bg-gradient-to-l from-warning/10 to-transparent rounded-xl p-6 border-r-4 border-warning">
          <div class="flex items-start gap-4">
            <div class="text-3xl font-bold text-warning">3</div>
            <div class="flex-1">
              <h4 class="font-bold text-lg mb-2">راقب التنبيهات</h4>
              <p class="text-text-secondary text-sm">
                عند كشف امتصاص، ستظهر رسالة كبيرة في الأعلى مع نغمة تنبيه وإشعار
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="bg-gradient-to-l from-danger/10 to-transparent rounded-xl p-6 border-r-4 border-danger">
          <div class="flex items-start gap-4">
            <div class="text-3xl font-bold text-danger">4</div>
            <div class="flex-1">
              <h4 class="font-bold text-lg mb-2">استخدم المؤشرات</h4>
              <p class="text-text-secondary text-sm">
                اضغط على زر "📊 المؤشرات" في الشارت لإضافة المؤشرات الفنية وتخصيصها
              </p>
            </div>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="bg-gradient-to-l from-primary/10 to-transparent rounded-xl p-6 border-r-4 border-primary">
          <div class="flex items-start gap-4">
            <div class="text-3xl font-bold text-primary">5</div>
            <div class="flex-1">
              <h4 class="font-bold text-lg mb-2">راجع السجل</h4>
              <p class="text-text-secondary text-sm">
                اضغط على "📋 عرض سجل الامتصاص" لمراجعة جميع التنبيهات السابقة مع التفاصيل الكاملة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 6: Tips & Best Practices -->
    <div id="tips" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>💡</span>
        نصائح وأفضل الممارسات
      </h2>
      <div class="space-y-4">
        <div class="bg-success/10 border-r-4 border-success p-6 rounded-lg">
          <div class="font-bold text-success mb-2">✅ افعل:</div>
          <ul class="space-y-2 text-sm text-text-secondary mr-4">
            <li>• استخدم الامتصاص مع المؤشرات الفنية للتأكيد</li>
            <li>• انتظر قوة إشارة &gt; 70% للامتصاص</li>
            <li>• راقب عدة عملات في نفس الوقت</li>
            <li>• راجع السجل لمعرفة نمط الامتصاص لكل عملة</li>
            <li>• فعّل إشعارات المتصفح للحصول على تنبيهات حتى في التبويبات الأخرى</li>
          </ul>
        </div>

        <div class="bg-danger/10 border-r-4 border-danger p-6 rounded-lg">
          <div class="font-bold text-danger mb-2">❌ لا تفعل:</div>
          <ul class="space-y-2 text-sm text-text-secondary mr-4">
            <li>• لا تعتمد على إشارة واحدة فقط</li>
            <li>• لا تتداول بناءً على الامتصاص فقط بدون تحليل إضافي</li>
            <li>• لا تتجاهل اتجاه السوق العام</li>
            <li>• لا تستخدم رافعة مالية عالية</li>
            <li>• لا تنسى إدارة المخاطر</li>
          </ul>
        </div>

        <div class="bg-warning/10 border-r-4 border-warning p-6 rounded-lg">
          <div class="font-bold text-warning mb-2">⚠️ تحذيرات مهمة:</div>
          <ul class="space-y-2 text-sm text-text-secondary mr-4">
            <li>• التحليل الفني لا يضمن النجاح بنسبة 100%</li>
            <li>• استخدم وقف الخسارة دائماً</li>
            <li>• لا تستثمر أكثر مما يمكنك تحمل خسارته</li>
            <li>• هذا الموقع للأغراض التعليمية فقط</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Section 7: FAQ -->
    <div id="faq" class="bg-bg-secondary rounded-2xl p-8 shadow-lg scroll-mt-20">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <span>❓</span>
        الأسئلة الشائعة
      </h2>
      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-bg-tertiary rounded-xl p-6"
        >
          <h4 class="font-bold mb-2 text-primary">{{ faq.question }}</h4>
          <p class="text-sm text-text-secondary" v-html="faq.answer"></p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-gradient-to-l from-primary/10 to-success/10 rounded-2xl p-10 text-center shadow-lg">
      <h2 class="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
      <p class="text-text-secondary text-lg mb-6">
        ابدأ باستخدام أدوات التحليل الآن!
      </p>
      <div class="flex gap-4 justify-center flex-wrap">
        <NuxtLink
          to="/"
          class="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all font-bold shadow-lg hover:shadow-xl"
        >
          الصفحة الرئيسية 🏠
        </NuxtLink>
        <NuxtLink
          to="/analytics"
          class="px-8 py-4 bg-success text-white rounded-xl hover:bg-success/80 transition-all font-bold shadow-lg hover:shadow-xl"
        >
          التحليلات المتقدمة 📊
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sections = [
  { id: 'intro', icon: '🚀', title: 'مقدمة', subtitle: 'ما هو SniperFlow؟' },
  { id: 'absorption', icon: '🐋', title: 'كشف الامتصاص', subtitle: 'Absorption Detection' },
  { id: 'sentiment', icon: '📊', title: 'معنويات السوق', subtitle: 'Market Sentiment' },
  { id: 'indicators', icon: '📈', title: 'المؤشرات الفنية', subtitle: 'Technical Indicators' },
  { id: 'howto', icon: '🎯', title: 'كيفية الاستخدام', subtitle: 'How to Use' },
  { id: 'tips', icon: '💡', title: 'نصائح', subtitle: 'Best Practices' },
  { id: 'faq', icon: '❓', title: 'أسئلة شائعة', subtitle: 'FAQ' },
]

const faqs = [
  {
    question: 'كم مرة يتم تحديث البيانات؟',
    answer: 'يتم تحديث البيانات بشكل مستمر وفوري لضمان الحصول على أدق المعلومات في الوقت الفعلي.'
  },
  {
    question: 'هل يمكنني استخدام الموقع على الهاتف؟',
    answer: 'نعم! الموقع متجاوب بالكامل ويعمل بشكل ممتاز على جميع الأجهزة.'
  },
  {
    question: 'هل أحتاج حساب بينانس؟',
    answer: 'لا، الموقع يستخدم بيانات عامة من Binance API ولا يحتاج لحساب أو API keys.'
  },
  {
    question: 'كم عدد العملات المدعومة؟',
    answer: 'حالياً ندعم <strong>10 عملات رئيسية</strong> (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, DOT, MATIC, AVAX) ويمكن إضافة المزيد.'
  },
  {
    question: 'هل التنبيهات دقيقة 100%؟',
    answer: 'لا يوجد نظام دقيق 100%. التنبيهات هي <strong>إشارات محتملة</strong> يجب تأكيدها بتحليل إضافي. استخدم دائماً إدارة المخاطر.'
  },
  {
    question: 'كيف أفعّل الإشعارات؟',
    answer: 'عند أول زيارة، سيطلب المتصفح إذن الإشعارات. اضغط "السماح" للحصول على تنبيهات حتى في التبويبات الأخرى.'
  },
  {
    question: 'هل يتم حفظ السجل؟',
    answer: 'نعم، يتم حفظ آخر <strong>50 تنبيه امتصاص</strong> في متصفحك (localStorage) ويبقى حتى بعد إغلاق الموقع.'
  },
  {
    question: 'ما هو أفضل وقت لاستخدام الموقع؟',
    answer: 'الموقع يعمل 24/7، ولكن أفضل الفرص عادة تكون في <strong>فترات التقلب العالي</strong> مثل فتح السوق الأمريكي أو إعلانات مهمة.'
  },
]

useHead({
  title: 'دليل الاستخدام - SniperFlow',
  meta: [
    { name: 'description', content: 'دليل شامل لاستخدام منصة SniperFlow لتحليل سوق بينانس' }
  ]
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
