import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: { campaigns:'Campaigns', stories:'Stories', login:'Login', join:'Join Now', dashboard:'Dashboard', admin:'Admin', logout:'Logout' },
      home: { hero_title:'Stand With', hero_em:'Palestine.', hero_sub:'Give Today.', hero_desc:'NASEER connects you to verified humanitarian campaigns. Every rupee reaches those who need it most.', browse:'Browse Campaigns', create:'Create Account', total_raised:'Total Raised', active_campaigns:'Active Campaigns', donors:'Donors', transparent:'Transparent', featured:'Featured Campaigns', view_all:'View All Campaigns →' },
      campaigns: { title:'Choose Where', em:'You Make a Difference', desc:'Every campaign is verified and transparent.', all:'All', filter_label:'AI Recommendation', no_results:'No campaigns found', show_all:'Show All' },
      donate: { back:'← Back to Campaigns', make_donation:'Make a Donation', confirm:'Confirm Donation', processing:'Processing...', secure:'🔒 Secure simulated payment · 100% goes to the campaign', suggested:'Suggested Amounts', type:'Donation Type', name:'Full Name', email:'Email', payment:'Payment Method', anonymous:'Donate anonymously' },
      receipt: { title:'JazakAllah Khair', subtitle:'Your donation has been confirmed', donate_again:'Donate Again', dashboard:'My Dashboard', receipt_id:'Receipt ID', campaign:'Campaign', type:'Donation Type', payment:'Payment', date:'Date', status:'Status', amount:'Amount', confirmed:'✅ Confirmed' },
      auth: { signin:'Sign In', register:'Create Account', email:'Email', password:'Password', confirm_pass:'Confirm Password', first_name:'First Name', last_name:'Last Name', no_account:"No account?", have_account:'Already have an account?', create_link:'Create one →', signin_link:'Sign in →', demo:'Demo Accounts' },
      dashboard: { my_account:'My Account', total_donated:'Total Donated', campaigns_count:'Campaigns', types:'Types Used', history:'Donation History', no_donations:'No donations yet', browse:'Browse Campaigns', date:'Date', campaign:'Campaign', type:'Type', payment_method:'Payment', amount:'Amount', status:'Status' },
      errors: { required:'All fields are required.', email_invalid:'Valid email is required.', password_short:'Password must be at least 8 characters.', password_mismatch:'Passwords do not match.', login_failed:'Login failed.', register_failed:'Registration failed.' },
      chatbot: { title:'NASEER AI Assistant', placeholder:'Ask me anything about campaigns...', typing:'NASEER is thinking...', open:'Ask NASEER', close:'Close' },
      notifications: { title:'Notifications', mark_all:'Mark all read', empty:'No notifications yet' },
    }
  },
  ur: {
    translation: {
      nav: { campaigns:'مہمات', stories:'کہانیاں', login:'لاگ ان', join:'ابھی شامل ہوں', dashboard:'ڈیش بورڈ', admin:'ایڈمن', logout:'لاگ آؤٹ' },
      home: { hero_title:'فلسطین کے ساتھ', hero_em:'کھڑے ہوں۔', hero_sub:'آج عطیہ کریں۔', hero_desc:'ناصر آپ کو تصدیق شدہ انسانی مہمات سے جوڑتا ہے۔', browse:'مہمات دیکھیں', create:'اکاؤنٹ بنائیں', total_raised:'کل جمع شدہ', active_campaigns:'فعال مہمات', donors:'عطیہ دہندگان', transparent:'شفاف', featured:'نمایاں مہمات', view_all:'تمام مہمات دیکھیں →' },
      campaigns: { title:'چنیں جہاں', em:'آپ فرق ڈالیں', desc:'ہر مہم تصدیق شدہ اور شفاف ہے۔', all:'سب', filter_label:'AI تجویز', no_results:'کوئی مہم نہیں ملی', show_all:'سب دکھائیں' },
      donate: { back:'← مہمات پر واپس', make_donation:'عطیہ کریں', confirm:'عطیہ کی تصدیق کریں', processing:'پروسیس ہو رہا ہے...', secure:'🔒 محفوظ ادائیگی · 100% مہم کو جاتا ہے', suggested:'تجویز کردہ رقمیں', type:'عطیہ کی قسم', name:'پورا نام', email:'ای میل', payment:'ادائیگی کا طریقہ', anonymous:'گمنام عطیہ' },
      receipt: { title:'جزاک اللہ خیر', subtitle:'آپ کا عطیہ تصدیق ہو گیا', donate_again:'دوبارہ عطیہ کریں', dashboard:'میرا ڈیش بورڈ', receipt_id:'رسید نمبر', campaign:'مہم', type:'قسم', payment:'ادائیگی', date:'تاریخ', status:'حیثیت', amount:'رقم', confirmed:'✅ تصدیق شدہ' },
      auth: { signin:'سائن ان', register:'اکاؤنٹ بنائیں', email:'ای میل', password:'پاس ورڈ', confirm_pass:'پاس ورڈ کی تصدیق', first_name:'پہلا نام', last_name:'آخری نام', no_account:'اکاؤنٹ نہیں؟', have_account:'پہلے سے اکاؤنٹ ہے؟', create_link:'بنائیں →', signin_link:'سائن ان کریں →', demo:'ڈیمو اکاؤنٹ' },
      dashboard: { my_account:'میرا اکاؤنٹ', total_donated:'کل عطیہ', campaigns_count:'مہمات', types:'استعمال شدہ اقسام', history:'عطیہ کی تاریخ', no_donations:'ابھی تک کوئی عطیہ نہیں', browse:'مہمات دیکھیں', date:'تاریخ', campaign:'مہم', type:'قسم', payment_method:'ادائیگی', amount:'رقم', status:'حیثیت' },
      errors: { required:'تمام فیلڈز ضروری ہیں۔', email_invalid:'درست ای میل ضروری ہے۔', password_short:'پاس ورڈ کم از کم 8 حروف ہونا چاہیے۔', password_mismatch:'پاس ورڈ میل نہیں کھاتے۔', login_failed:'لاگ ان ناکام۔', register_failed:'رجسٹریشن ناکام۔' },
      chatbot: { title:'ناصر AI معاون', placeholder:'مہمات کے بارے میں پوچھیں...', typing:'ناصر سوچ رہا ہے...', open:'ناصر سے پوچھیں', close:'بند کریں' },
      notifications: { title:'اطلاعات', mark_all:'سب پڑھا ہوا نشان کریں', empty:'ابھی تک کوئی اطلاع نہیں' },
    }
  },
  ar: {
    translation: {
      nav: { campaigns:'الحملات', stories:'القصص', login:'تسجيل الدخول', join:'انضم الآن', dashboard:'لوحة التحكم', admin:'المشرف', logout:'تسجيل الخروج' },
      home: { hero_title:'قفوا مع', hero_em:'فلسطين.', hero_sub:'تبرعوا اليوم.', hero_desc:'ناصر يربطكم بحملات إنسانية موثقة. كل روبية تصل إلى من يحتاجها.', browse:'تصفح الحملات', create:'إنشاء حساب', total_raised:'إجمالي التبرعات', active_campaigns:'الحملات النشطة', donors:'المتبرعون', transparent:'شفاف 100%', featured:'الحملات المميزة', view_all:'عرض جميع الحملات →' },
      campaigns: { title:'اختر أين', em:'تُحدث فرقاً', desc:'كل حملة موثقة وشفافة.', all:'الكل', filter_label:'توصية الذكاء الاصطناعي', no_results:'لا توجد حملات', show_all:'عرض الكل' },
      donate: { back:'← العودة إلى الحملات', make_donation:'قدّم تبرعاً', confirm:'تأكيد التبرع', processing:'جارٍ المعالجة...', secure:'🔒 دفع آمن محاكى · 100% يذهب للحملة', suggested:'مبالغ مقترحة', type:'نوع التبرع', name:'الاسم الكامل', email:'البريد الإلكتروني', payment:'طريقة الدفع', anonymous:'التبرع بشكل مجهول' },
      receipt: { title:'جزاك الله خيراً', subtitle:'تم تأكيد تبرعك', donate_again:'تبرع مجدداً', dashboard:'لوحتي', receipt_id:'رقم الإيصال', campaign:'الحملة', type:'نوع التبرع', payment:'الدفع', date:'التاريخ', status:'الحالة', amount:'المبلغ', confirmed:'✅ مؤكد' },
      auth: { signin:'تسجيل الدخول', register:'إنشاء حساب', email:'البريد الإلكتروني', password:'كلمة المرور', confirm_pass:'تأكيد كلمة المرور', first_name:'الاسم الأول', last_name:'اسم العائلة', no_account:'ليس لديك حساب؟', have_account:'لديك حساب بالفعل؟', create_link:'أنشئ واحداً →', signin_link:'سجل دخولك →', demo:'حسابات تجريبية' },
      dashboard: { my_account:'حسابي', total_donated:'إجمالي التبرعات', campaigns_count:'الحملات', types:'الأنواع المستخدمة', history:'سجل التبرعات', no_donations:'لا توجد تبرعات بعد', browse:'تصفح الحملات', date:'التاريخ', campaign:'الحملة', type:'النوع', payment_method:'الدفع', amount:'المبلغ', status:'الحالة' },
      errors: { required:'جميع الحقول مطلوبة.', email_invalid:'البريد الإلكتروني غير صحيح.', password_short:'كلمة المرور يجب أن تكون 8 أحرف على الأقل.', password_mismatch:'كلمتا المرور غير متطابقتين.', login_failed:'فشل تسجيل الدخول.', register_failed:'فشل التسجيل.' },
      chatbot: { title:'مساعد ناصر الذكي', placeholder:'اسألني عن الحملات...', typing:'ناصر يفكر...', open:'اسأل ناصر', close:'إغلاق' },
      notifications: { title:'الإشعارات', mark_all:'تحديد الكل كمقروء', empty:'لا توجد إشعارات بعد' },
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('naseer_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
