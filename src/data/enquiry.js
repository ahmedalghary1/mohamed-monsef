// Stable service IDs are shared by editorial CTAs and the enquiry choices.
export const serviceIds = ["media-buying","performance-analysis","ai-images","ai-videos"];
export const enquiry = {
  "en": {
    "title": "Tell me about your project.",
    "intro": "Choose what you need. Review your message, then open WhatsApp or copy it. Your description is never saved or sent automatically.",
    "services": "Required services",
    "serviceOptions": [
      "Media buying",
      "Performance analysis",
      "AI image creation",
      "AI video creation"
    ],
    "industry": "Business industry",
    "industries": [
      "E-commerce",
      "Real estate",
      "Retail",
      "Fashion",
      "Food and beverage",
      "Services",
      "Other"
    ],
    "details": "Project details",
    "budget": "Estimated budget (optional)",
    "budgets": [
      "Not decided yet",
      "Prefer to discuss"
    ],
    "preview": "Message preview",
    "send": "Open WhatsApp with this message",
    "copy": "Copy message",
    "copied": "Message copied.",
    "copyFallback": "Select and copy the message from the preview.",
    "validation": "Select at least one service and describe your project.",
    "greeting": "Hello Mohamed,\n\nI visited your portfolio and would like to discuss a new project.",
    "labels": [
      "Required services",
      "Business industry",
      "Estimated budget",
      "Project details"
    ],
    "industryPrompt": "Choose an industry (optional)",
    "budgetPrompt": "Choose a budget preference",
    "placeholder": "What are you promoting, who is it for, and what would you like to achieve?",
    "selected": "Service added to your project."
  },
  "ar": {
    "title": "أخبرني عن مشروعك.",
    "intro": "اختر ما تحتاجه وراجع الرسالة، ثم افتح واتساب أو انسخها. لا نحفظ وصف مشروعك ولا نرسل شيئًا تلقائيًا.",
    "services": "الخدمات المطلوبة",
    "serviceOptions": [
      "الإعلانات المدفوعة",
      "تحليل الأداء الإعلاني",
      "إنتاج الصور بالذكاء الاصطناعي",
      "إنتاج الفيديو بالذكاء الاصطناعي"
    ],
    "industry": "مجال النشاط",
    "industries": [
      "التجارة الإلكترونية",
      "العقارات",
      "التجزئة",
      "الأزياء",
      "الأغذية والمشروبات",
      "الخدمات",
      "أخرى"
    ],
    "details": "تفاصيل المشروع",
    "budget": "الميزانية التقديرية (اختياري)",
    "budgets": [
      "لم أحدد بعد",
      "أفضل مناقشتها"
    ],
    "preview": "معاينة الرسالة",
    "send": "افتح واتساب بهذه الرسالة",
    "copy": "انسخ الرسالة",
    "copied": "تم نسخ الرسالة.",
    "copyFallback": "يمكنك تحديد الرسالة ونسخها من المعاينة.",
    "validation": "اختر خدمة واحدة على الأقل واكتب وصفًا لمشروعك.",
    "greeting": "مرحبًا محمد،\n\nتصفحت البورتفوليو الخاص بك وأرغب في مناقشة مشروع جديد.",
    "labels": [
      "الخدمات المطلوبة",
      "مجال النشاط",
      "الميزانية التقريبية",
      "تفاصيل المشروع"
    ],
    "industryPrompt": "اختر مجال النشاط (اختياري)",
    "budgetPrompt": "اختر تفضيل الميزانية",
    "placeholder": "ما المنتج أو الخدمة؟ من جمهورك؟ وما الهدف الذي تريد تحقيقه؟",
    "selected": "أُضيفت الخدمة إلى متطلبات مشروعك."
  }
};
export function buildEnquiry(copy,{services,industry,budget,details}){
 const fields=[services.length?services.join(' / '):'',industry,budget,details.trim()];
 return [copy.greeting,fields.map((value,i)=>value?`${copy.labels[i]}: ${value}`:'').filter(Boolean).join('\n')].filter(Boolean).join('\n\n');
}
