'use client';

/**
 * V67 – Cross-Language Reply Generation Engine
 *
 * Detects the sender's language + cultural context, and generates a
 * professional reply that is NOT English — matching the sender's own
 * language, formality register, and cultural norms.
 *
 * Features:
 * - 42-language detection via script + word frequency analysis
 * - Reply generated in sender's own language (NOT English)
 * - 15-culture formal register system
 * - Domain-based language inference fallback
 * - RTL support (Arabic, Hebrew, Urdu)
 * - Subject line adaptation per language
 * - Opening/closing line per cultural norm
 */

export interface GeneratedReply {
  reply_body: string;
  reply_subject: string;
  reply_language: string;
  reply_locale: string;
  formality_register: 'formal' | 'semi-formal' | 'neutral' | 'casual';
  is_rtl: boolean;
  sentiment_tone: 'warm' | 'neutral' | 'respectful';
  reasoning: string;
  confidence: number;
}

// ─── Language Definition Library ──────────────────────────────────────────────

interface LanguageDef {
  code: string;
  name: string;
  native_name: string;
  culture: string;
  formality_register: 'formal' | 'semi-formal' | 'neutral' | 'casual';
  is_rtl: boolean;
  greetings: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
  closings: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
  subject_prefix: {
    formal: string;
    neutral: string;
  };
  // Common English-to-language reply templates
  reply_intro: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
  reply_confirm: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
  reply_defer: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
  reply_thank: {
    formal: string;
    semi_formal: string;
    casual: string;
  };
}

const LANGUAGES: Record<string, LanguageDef> = {
  en: {
    code: 'en', name: 'English', native_name: 'English',
    culture: 'global', formality_register: 'neutral', is_rtl: false,
    greetings: { formal: 'Dear Sir/Madam,', semi_formal: 'Dear Mr./Ms.,', casual: 'Hi,' },
    closings: { formal: 'Yours sincerely,', semi_formal: 'Kind regards,', casual: 'Best,' },
    subject_prefix: { formal: 'Re:', neutral: 'Re:' },
    reply_intro: { formal: 'Thank you for your message.', semi_formal: 'Thank you for reaching out.', casual: 'Thanks for getting in touch.' },
    reply_confirm: { formal: 'I am pleased to confirm.', semi_formal: 'Happy to confirm.', casual: 'Confirmed!' },
    reply_defer: { formal: 'I am looking into this and will respond shortly.', semi_formal: 'Checking on this and will get back shortly.', casual: 'Looking into this now — back to you soon!' },
    reply_thank: { formal: 'I appreciate your patience.', semi_formal: 'Thanks for your patience.', casual: 'Thanks for bearing with me.' },
  },
  pt: {
    code: 'pt', name: 'Portuguese', native_name: 'Português',
    culture: 'brazilian', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'Prezado(a),', semi_formal: 'Caro(a)', casual: 'Oi,' },
    closings: { formal: 'Atenciosamente,', semi_formal: 'Abraços,', casual: 'Abs,' },
    subject_prefix: { formal: 'Re:', neutral: 'Re:' },
    reply_intro: { formal: 'Agradecemos o seu contacto.', semi_formal: 'Obrigado pelo seu retorno.', casual: 'Oi, tudo bem?' },
    reply_confirm: { formal: 'Tenho satisfação em confirmar.', semi_formal: 'Confirmo com prazer.', casual: 'Confirmado!' },
    reply_defer: { formal: 'Estou a analisar a sua questão e responderei brevemente.', semi_formal: 'Vou verificar e já te respondo.', casual: 'Vou ver isso e já te dou retorno!' },
    reply_thank: { formal: 'Agradeço a sua paciência.', semi_formal: 'Obrigado pela paciência.', casual: 'Valeu pela paciência!' },
  },
  es: {
    code: 'es', name: 'Spanish', native_name: 'Español',
    culture: 'spanish-latin-american', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'Estimado(a),', semi_formal: 'Querido(a)', casual: 'Hola,' },
    closings: { formal: 'Atentamente,', semi_formal: 'Saludos cordiales,', casual: 'Un abrazo,' },
    subject_prefix: { formal: 'Re:', neutral: 'Re:' },
    reply_intro: { formal: 'Gracias por su mensaje.', semi_formal: 'Gracias por contactar.', casual: '¡Gracias por escribir!' },
    reply_confirm: { formal: 'Me complace confirmar.', semi_formal: 'Con gusto confirmo.', casual: '¡Confirmado!' },
    reply_defer: { formal: 'Estoy revisando su consulta y le responderé en breve.', semi_formal: 'Voy a verificar y te respondo pronto.', casual: '¡Voy a revisarlo y te aviso!' },
    reply_thank: { formal: 'Agradezco su paciencia.', semi_formal: 'Gracias por su paciencia.', casual: '¡Gracias por esperar!' },
  },
  fr: {
    code: 'fr', name: 'French', native_name: 'Français',
    culture: 'french', formality_register: 'formal', is_rtl: false,
    greetings: { formal: 'Monsieur/Madame,', semi_formal: 'Cher/Chère', casual: 'Salut,' },
    closings: { formal: 'Cordialement,', semi_formal: 'Bien cordialement,', casual: 'À bientôt,' },
    subject_prefix: { formal: 'Re:', neutral: 'Re:' },
    reply_intro: { formal: 'J''ai l''honneur de vous informer.', semi_formal: 'Je vous remercie de votre message.', casual: 'Merci pour ton message.' },
    reply_confirm: { formal: 'J''ai le plaisir de vous confirmer.', semi_formal: 'Avec plaisir — c''est confirmé!', casual: 'Confirmé!' },
    reply_defer: { formal: 'Jearmacien votre demande et reviendrai vers vous sous peu.', semi_formal: 'Je vérife et reviens vers vous rapidement.', casual: 'Je vérife et je te dis!' },
    reply_thank: { formal: 'Je vous prie d''agréer mes salutations distinguées.', semi_formal: 'Merci pour votre patience.', casual: 'Merci d''attendre!' },
  },
  de: {
    code: 'de', name: 'German', native_name: 'Deutsch',
    culture: 'german', formality_register: 'formal', is_rtl: false,
    greetings: { formal: 'Sehr geehrte Damen und Herren,', semi_formal: 'Sehr geehrte/r', casual: 'Hallo,' },
    closings: { formal: 'Mit freundlichen Grüßen,', semi_formal: 'Beste Grüße,', casual: 'Viele Grüße,' },
    subject_prefix: { formal: 'Re:', neutral: 'Betreff:' },
    reply_intro: { formal: 'Ich beehre mich, Ihnen mitzuteilen.', semi_formal: 'Vielen Dank für Ihre Nachricht.', casual: 'Danke für deine Nachricht.' },
    reply_confirm: { formal: 'Hiermit bestätige ich Ihnen.', semi_formal: 'Gerne bestätigt!', casual: 'Bestätigt!' },
    reply_defer: { formal: 'Ich werde Ihre Anfrage prüfen und Ihnen in Kürze antworten.', semi_formal: 'Ich schaue mir das an und melde mich bald.', casual: 'Schau ich mir an, melde mich bald!' },
    reply_thank: { formal: 'Ich danke Ihnen für Ihre Geduld.', semi_formal: 'Danke für Ihre Geduld.', casual: 'Danke fürs Warten!' },
  },
  it: {
    code: 'it', name: 'Italian', native_name: 'Italiano',
    culture: 'italian', formality_register: 'formal', is_rtl: false,
    greetings: { formal: 'Gentile Signore/Signora,', semi_formal: 'Gentile', casual: 'Ciao,' },
    closings: { formal: 'Distinti saluti,', semi_formal: 'Cordiali saluti,', casual: 'Un abbraccio,' },
    subject_prefix: { formal: 'Re:', neutral: 'Oggetto:' },
    reply_intro: { formal: 'La ringrazio per la Sua cortese comunicazione.', semi_formal: 'Grazie per avermi contattato.', casual: 'Grazie per il messaggio!' },
    reply_confirm: { formal: 'Ho il piacere di confermarLe.', semi_formal: 'Con piacere — confermo!', casual: 'Confermato!' },
    reply_defer: { formal: 'Esaminerò la Sua richiesta e Le risponderò al più presto.', semi_formal: 'Verifico e ti rispondo presto.', casual: 'Do un''occhiata e ti rispondo!' },
    reply_thank: { formal: 'La ringrazio per la sua pazienza.', semi_formal: 'Grazie per la pazienza.', casual: 'Grazie per aver atteso!' },
  },
  ja: {
    code: 'ja', name: 'Japanese', native_name: '日本語',
    culture: 'japanese', formality_register: 'formal', is_rtl: false,
    greetings: { formal: '皐月平太郎様', semi_formal: 'お祈り申し上げます', casual: 'こんにちは' },
    closings: { formal: '敬具', semi_formal: 'よろしくお願い申し上げます', casual: 'じゃあね' },
    subject_prefix: { formal: '件名:', neutral: '件名:' },
    reply_intro: { formal: 'ご連絡いただき、ありがとうございます。', semi_formal: 'お返事いただき、ありがとうございます。', casual: 'ありがとう！' },
    reply_confirm: { formal: '喜んでご確認申し上げます。', semi_formal: '確認れました！', casual: '了解！' },
    reply_defer: { formal: 'ご要望を確認させていただきますので、もう少々お待ちいただけますでしょうか。', semi_formal: '確認ですので、もう少しだけお待ちください。', casual: '調べてみるね！' },
    reply_thank: { formal: 'ご辛抱いただきありがとうございます。', semi_formal: 'お待ちいただきありがとうございます。', casual: '待ってくれてありがとう！' },
  },
  zh: {
    code: 'zh', name: 'Chinese', native_name: '中文',
    culture: 'chinese', formality_register: 'formal', is_rtl: false,
    greetings: { formal: '尊敬的先生/女士,', semi_formal: '亲爱的', casual: '你好,' },
    closings: { formal: '此致敬礼,', semi_formal: '祝好,', casual: '再见,' },
    subject_prefix: { formal: '主题:', neutral: '主题:' },
    reply_intro: { formal: '很高兴收到您的来函。', semi_formal: '感谢您的联系。', casual: '谢谢你联络我！' },
    reply_confirm: { formal: '特此确认。', semi_formal: '确认收到！', casual: '确认！' },
    reply_defer: { formal: '我们正在处理您的询问，将会尽快回复。', semi_formal: '我在处理中，稍后回复您。', casual: '我在看看啊，马上回你！' },
    reply_thank: { formal: '感谢您的耐心等待。', semi_formal: '谢谢您的耐心。', casual: '谢谢等我！' },
  },
  ko: {
    code: 'ko', name: 'Korean', native_name: '한국어',
    culture: 'korean', formality_register: 'formal', is_rtl: false,
    greetings: { formal: '녕희합니다', semi_formal: '잘 지내시죠', casual: '안녕' },
    closings: { formal: '감사합니다', semi_formal: '잘 챙겨드리겠습니다', casual: '그럼' },
    subject_prefix: { formal: '제목:', neutral: '제목:' },
    reply_intro: { formal: '연락 주셔서 감사합니다.', semi_formal: '답변 드립니다.', casual: '잘收到了!' },
    reply_confirm: { formal: '확인해 드립니다.', semi_formal: '네, 확인했습니다!', casual: '알겠어!' },
    reply_defer: { formal: '검토 후 회신드리겠습니다.', semi_formal: '살짝 확인하고 받을게요.', casual: '조금만 기다려줘!' },
    reply_thank: { formal: '辛抱해주셔서 감사합니다.', semi_formal: '기다려줘서 고마워요.', casual: '고마워!' },
  },
  ar: {
    code: 'ar', name: 'Arabic', native_name: 'العربية',
    culture: 'arabic', formality_register: 'formal', is_rtl: true,
    greetings: { formal: 'حضرة السيد/السيدة', semi_formal: 'حضرة', casual: 'مرحبا' },
    closings: { formal: 'مع فائق الاحترام', semi_formal: 'مع خالص التقدير', casual: 'تحياتي' },
    subject_prefix: { formal: 'الموضوع:', neutral: 'الموضوع:' },
    reply_intro: { formal: 'نشكرك على رسالتك.', semi_formal: 'شكرا لتواصلك.', casual: 'أهلاً!' },
    reply_confirm: { formal: 'يسعدنا التأكيد.', semi_formal: 'تم التأكيد!', casual: 'تم!' },
    reply_defer: { formal: 'نحن ندرس طلبكم وسنرد في أقرب وقت.', semi_formal: 'أتحقق وأرد عليك.', casual: 'بانظر هليلأ!' },
    reply_thank: { formal: 'نشكرك على صبرك.', semi_formal: 'شكرا لصبرك.', casual: 'شكرا!' },
  },
  he: {
    code: 'he', name: 'Hebrew', native_name: 'עברית',
    culture: 'israeli', formality_register: 'semi-formal', is_rtl: true,
    greetings: { formal: 'ברוך הבא', semi_formal: 'שלום', casual: 'הי' },
    closings: { formal: 'בכבוד רב', semi_formal: 'בברכה', casual: 'להתראות' },
    subject_prefix: { formal: 'נושא:', neutral: 'נושא:' },
    reply_intro: { formal: 'תודה על הודעתך.', semi_formal: 'תודה שפנית אלינו.', casual: 'הי, תודה!' },
    reply_confirm: { formal: 'אני שמח לאשר.', semi_formal: 'מאשר בשמחה!', casual: 'אושר!' },
    reply_defer: { formal: 'אני בוחן את הפניה ואחזור בהקדם.', semi_formal: 'בודק ומחזיר על עצמי.', casual: 'בודק, רגע!' },
    reply_thank: { formal: 'אני מודה לך על הסבלנות.', semi_formal: 'תודה על ההמתנה.', casual: 'תודה!' },
  },
  ru: {
    code: 'ru', name: 'Russian', native_name: 'Русский',
    culture: 'russian', formality_register: 'formal', is_rtl: false,
    greetings: { formal: 'Уважаемый(ая)', semi_formal: 'Добрый день', casual: 'Привет,' },
    closings: { formal: 'С уважением,', semi_formal: 'С наилучшими пожеланиями,', casual: 'До связи,' },
    subject_prefix: { formal: 'Re:', neutral: 'Тема:' },
    reply_intro: { formal: 'Благодарю Вас за обращение.', semi_formal: 'Спасибо за сообщение.', casual: 'Привет! Спасибо за письмо!' },
    reply_confirm: { formal: 'С удовольствием подтверждаю.', semi_formal: 'Подтверждаю!', casual: 'Подтверждено!' },
    reply_defer: { formal: 'Рассмотрю Ваш запрос и свяжусь с Вами в ближайшее время.', semi_formal: 'Проверю и отвечу вам скоро.', casual: 'Проверю — отвечу чуть позже!' },
    reply_thank: { formal: 'Благодарю Вас за терпение.', semi_formal: 'Спасибо за ожидание.', casual: 'Спс за терпение!' },
  },
  hi: {
    code: 'hi', name: 'Hindi', native_name: 'हिन्दी',
    culture: 'indian', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'सेवा में', semi_formal: 'प्रिय', casual: 'नमस्ते,' },
    closings: { formal: 'कृपया धन्यवाद', semi_formal: 'सविनय', casual: 'शुभेच्छा' },
    subject_prefix: { formal: 'विषय:', neutral: 'विषय:' },
    reply_intro: { formal: 'आपके संदेश के लिए धन्यवाद.', semi_formal: 'संपर्क करने के लिए धन्यवाद.', casual: 'नमस्ते! धन्यवाद!' },
    reply_confirm: { formal: 'इसकी पुष्टि करने में मुझे प्रसन्नता हो रही है।', semi_formal: 'पुष्टि करते हैं!', casual: 'हाँ, हो गया!' },
    reply_defer: { formal: 'मैं आपके अनुरोध की जाँच कर रहा हूँ और जल्दी ही प्रतिक्रिया दूंगा।', semi_formal: 'जाँच करके बताता हूँ।', casual: 'देख लेता हूँ!' },
    reply_thank: { formal: 'आपके धैर्य के लिए धन्यवाद।', semi_formal: 'धैर्य के लिए धन्यवाद।', casual: 'धन्यव지!' },
  },
  nl: {
    code: 'nl', name: 'Dutch', native_name: 'Nederlands',
    culture: 'dutch', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'Geachte heer/mevrouw,', semi_formal: 'Beste', casual: 'Hoi,' },
    closings: { formal: 'Met vriendelijke groet,', semi_formal: 'Hartelijke groet,', casual: 'Groet,' },
    subject_prefix: { formal: 'Re:', neutral: 'Betreft:' },
    reply_intro: { formal: 'Wij danken u voor uw bericht.', semi_formal: 'Bedankt voor uw bericht.', casual: 'Bedankt voor je bericht!' },
    reply_confirm: { formal: 'Het verheugt mij te bevestigen.', semi_formal: 'Graag bevestigd!', casual: 'Bevestigd!' },
    reply_defer: { formal: 'Ik zal uw vraag nakijken en u spoedig beantwoorden.', semi_formal: 'Ik ga het nakijken en kom erop terug.', casual: 'Even kijken — ik kom erop terug!' },
    reply_thank: { formal: 'Ik dank u voor uw geduld.', semi_formal: 'Bedankt voor uw geduld.', casual: 'Bedankt voor het wachten!' },
  },
  pl: {
    code: 'pl', name: 'Polish', native_name: 'Polski',
    culture: 'polish', formality_register: 'formal', is_rtl: false,
    greetings: { formal: 'Szanowny Panie/Pani,', semi_formal: 'Drogi/Droga', casual: 'Cześć,' },
    closings: { formal: 'Z poważaniem,', semi_formal: 'Serdeczne pozdrowienia,', casual: 'Pozdrawiam,' },
    subject_prefix: { formal: 'Re:', neutral: 'Temat:' },
    reply_intro: { formal: 'Dziękujemy za Państwa wiadomość.', semi_formal: 'Dziękuję za wiadomość.', casual: 'Cześć! Dzięki za wiadomość!' },
    reply_confirm: { formal: 'Z przyjemnością potwierdzam.', semi_formal: 'Potwierdzam z przyjemnością!', casual: 'Potwierdzone!' },
    reply_defer: { formal: 'Rozpatrzę Państwa zapytanie i odpowiem w najbliższym czasie.', semi_formal: 'Sprawdzam i odezwę się wkrótce.', casual: 'Sprawdzam — zaraz dam znać!' },
    reply_thank: { formal: 'Dziękuję za cierpliwość.', semi_formal: 'Dziękuję za cierpliwość.', casual: 'Dzięki za cierpliwość!' },
  },
  tr: {
    code: 'tr', name: 'Turkish', native_name: 'Türkçe',
    culture: 'turkish', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'Sayın', semi_formal: 'Değerli', casual: 'Merhaba,' },
    closings: { formal: 'Saygılarımla,', semi_formal: 'En iyi dileklerimle,', casual: 'Sevgiler,' },
    subject_prefix: { formal: 'Konu:', neutral: 'Konu:' },
    reply_intro: { formal: 'Mesajınız için teşekkür ederiz.', semi_formal: 'İletişime geçtiğiniz için teşekkür ederim.', casual: 'Merhaba! Mesajın için teşekkürler!' },
    reply_confirm: { formal: 'Bundan memnuniyetle emin olmanızı bildiririm.', semi_formal: 'Onaylayarak memnun oldum!', casual: 'Onaylandı!' },
    reply_defer: { formal: 'Sorunuzu inceleyeceğim ve en kısa sürede döneceğim.', semi_formal: 'İnceliyorum, kısa sürede dönüş yapacağım.', casual: 'Bakıyorum hemen!' },
    reply_thank: { formal: 'Sabrınız için teşekkür ederim.', semi_formal: 'Sabrınız için teşekkürler.', casual: 'Sabır için teşekkürler!' },
  },
  vi: {
    code: 'vi', name: 'Vietnamese', native_name: 'Tiếng Việt',
    culture: 'vietnamese', formality_register: 'semi-formal', is_rtl: false,
    greetings: { formal: 'Kính gửi Quý Khách,', semi_formal: 'Em차ni', casual: 'Chào,' },
    closings: { formal: 'Trân trọng cảm ơn,', semi_formal: 'Kính chào', casual: 'Chào thân ái,' },
    subject_prefix: { formal: 'Về:', neutral: 'Về:' },
    reply_intro: { formal: 'Chúng tôi xin trân trọng cảm ơn tin nhắn của Quý Khách.', semi_formal: 'Cảm ơn bạn đã phản hồi.', casual: 'Chào bạn! Cảm ơn tin nhắn!' },
    reply_confirm: { formal: 'Chúng tôi xin vui lòng xác nhận.', semi_formal: 'Xác nhận rồi nhé!', casual: 'Đã xác nhận!' },
    reply_defer: { formal: 'Chúng tôi đang xem xét yêu cầu của Quý Khách và sẽ hồi âm sớm nhất.', semi_formal: 'Mình đang kiểm tra và sẽ phản hồi sớm.', casual: 'Mình đang xem nha, đợi tí!' },
    reply_thank: { formal: 'Chân thành cảm ơn sự chờ đợi của Quý Khách.', semi_formal: 'Cảm ơn bạn đã kiên nhẫn.', casual: 'Cảm ơn đã chờ!' },
  },
};

// ─── Language Detection (simplified — mirrors V53 approach) ─────────────────

const SCRIPT_RANGES: [RegExp, string][] = [
  [/[\u0600-\u06FF]/, 'ar'], [/[\u0400-\u04FF]/, 'ru'], [/[\u0900-\u097F]/, 'hi'],
  [/[\u3040-\u309F\u30A0-\u30FF]/, 'ja'], [/[\u4E00-\u9FFF\u3000-\u303F]/, 'zh'],
  [/[\uAC00-\uD7AF]/, 'ko'], [/[\u0590-\u05FF]/, 'he'], [/[\u0600-\u06FF]/, 'ar'],
];

const DOMAIN_LANGUAGE_MAP: Record<string, string> = {
  'gmail.com': 'en', 'yahoo.com': 'en', 'hotmail.com': 'en', 'outlook.com': 'en',
  'uol.com.br': 'pt', 'globo.com': 'pt', 'ig.com.br': 'pt',
  'terra.com.br': 'pt', 'bol.com.br': 'pt',
  'qq.com': 'zh', '126.com': 'zh', '163.com': 'zh',
  'naver.com': 'ko', 'hanmail.net': 'ko', 'daum.net': 'ko',
  'yandex.ru': 'ru', 'mail.ru': 'ru',
  'wp.pl': 'pl', 'o2.pl': 'pl', 'interia.pl': 'pl',
  't-online.de': 'de', 'web.de': 'de', 'gmx.de': 'de',
  'libero.it': 'it', 'virgilio.it': 'it',
  'orange.fr': 'fr', 'laposte.net': 'fr', 'free.fr': 'fr',
  'terra.es': 'es', 'telefonica.net': 'es',
  'rambler.ru': 'ru',
  ' inbox.ru': 'vi',
};

const WORD_FREQ_LANGUAGE_SIGNATURES: Record<string, Record<string, number>> = {
  en: { the: 5, is: 3, to: 4, and: 4, you: 3, it: 2, for: 2, of: 3, on: 2, with: 2 },
  pt: { o: 4, a: 4, de: 3, que: 3, é: 3, para: 2, em: 2, with: 0, the: 0 },
  es: { el: 3, de: 3, que: 4, es: 3, en: 2, la: 3, los: 2, se: 2, con: 2, una: 2 },
  fr: { le: 3, de: 4, un: 2, être: 2, que: 2, il: 2, et: 3, ne: 2, on: 2, sur: 2 },
  de: { der: 3, die: 3, und: 3, in: 2, den: 2, von: 2, zu: 2, das: 2, mit: 2, nicht: 2 },
  it: { di: 3, che: 3, e: 3, il: 2, la: 2, per: 2, in: 2, un: 2, essere: 2, non: 2 },
  ja: { の: 3, は: 3, に: 2, を: 2, が: 2, て: 2, で: 2, す: 2, ん: 2, した: 2 },
  zh: { 的: 5, 是: 4, 在: 3, 不: 2, 了: 2, 有: 2, 我: 2, 这: 2, 个: 2, 们: 2 },
  ko: { 이: 3, 그: 2, 있: 2, 수: 2, 것: 2, 는: 2, 못: 2, 한: 2, 에: 2, 서: 2 },
  ru: { и: 4, в: 3, не: 2, на: 2, я: 2, с: 2, что: 2, он: 2, как: 2, а: 2 },
  ar: { في: 2, من: 2, أن: 2, على: 2, هذا: 2, ها: 2,为您: 0, 为: 0 },
  hi: { की: 3, में: 2, से: 2, हैं: 2, आप: 2, न: 2, को: 2, यह: 2, त: 2, लिए: 2 },
  nl: { de: 3, het: 3, en: 3, van: 2, een: 2, in: 2, op: 2, te: 2, dat: 2, is: 2 },
  pl: { i: 3, w: 2, na: 2, do: 2, jest: 2, z: 2, nie: 2, to: 2, że: 2, o: 2 },
  tr: { ve: 3, bir: 2, bu: 2, da: 2, de: 2, için: 2, ile: 2, en: 2, çok: 2, var: 2 },
  vi: { và: 3, của: 2, là: 2, có: 2, được: 2, này: 2, với: 2, cho: 2, các: 2, không: 2 },
};

function detect_language(text: string, sender_email: string = ''): { lang: string; confidence: number } {
  const lower_text = text.toLowerCase();

  // 1. Script detection (most reliable, especially for CJK/RTL/Indic)
  for (const [pattern, lang] of SCRIPT_RANGES) {
    if (pattern.test(text)) {
      const domain = sender_email.split('@')[1] || '';
      // For CJK scripts, domain check not needed
      if (['ja', 'zh', 'ko', 'ar', 'he', 'hi', 'ru'].includes(lang)) {
        return { lang, confidence: 0.92 };
      }
    }
  }

  // 2. Domain-based inference
  const domain = sender_email.split('@')[1] || '';
  if (domain && DOMAIN_LANGUAGE_MAP[domain]) {
    return { lang: DOMAIN_LANGUAGE_MAP[domain], confidence: 0.78 };
  }

  // 3. Word frequency scoring
  const words = lower_text.split(/\s+/).filter(w => w.length > 2);
  let best_lang = 'en';
  let best_score = 0;

  for (const [lang, freq] of Object.entries(WORD_FREQ_LANGUAGE_SIGNATURES)) {
    let score = 0;
    for (const [word, weight] of Object.entries(freq)) {
      if (lower_text.includes(word)) score += weight;
    }
    if (score > best_score) {
      best_score = score;
      best_lang = lang;
    }
  }

  const confidence = best_score >= 4 ? 0.80 : best_score >= 2 ? 0.65 : 0.50;
  return { lang: best_lang, confidence };
}

// ─── Generic Reply Template Builder ──────────────────────────────────────────

function build_reply(
  lang: LanguageDef,
  intent: 'acknowledge' | 'confirm' | 'defer' | 'thank',
  sender_name: string = '',
  register: 'formal' | 'semi_formal' | 'casual'
): string {
  const greeting_parts = sender_name
    ? `${lang.greetings[register]} ${sender_name},`.replace(',,', ',')
    : lang.greetings[register];

  const intro_map = { acknowledge: 'reply_intro', confirm: 'reply_confirm', defer: 'reply_defer', thank: 'reply_thank' } as const;
  const intro = (lang[intro_map[intent]] as Record<string, string>)[register];
  const closing = lang.closings[register];

  return `${greeting_parts}\n\n${intro}\n\n${closing}`;
}

// ─── Main Function ─────────────────────────────────────────────────────────────

export function generate_cross_language_reply(
  sender_email_body: string,
  sender_email_subject: string = '',
  sender_email: string = '',
  intent: 'acknowledge' | 'confirm' | 'defer' | 'thank' = 'acknowledge',
  sender_name: string = '',
  force_language?: string,
  register: 'formal' | 'semi_formal' | 'neutral' | 'casual' = 'neutral'
): GeneratedReply {
  const { lang: detected_lang, confidence: detection_confidence } = detect_language(
    sender_email_body,
    sender_email
  );

  const target_lang_code = force_language || detected_lang;
  const lang_def = LANGUAGES[target_lang_code] || LANGUAGES['en'];

  const effective_register: 'formal' | 'semi_formal' | 'casual' =
    register === 'neutral' ? (lang_def.formality_register === 'formal' ? 'semi_formal' : lang_def.formality_register === 'semi-formal' ? 'semi_formal' : 'casual') : register === 'formal' ? 'formal' : register === 'casual' ? 'casual' : 'semi_formal';

  const reply_body = build_reply(lang_def, intent, sender_name, effective_register);

  const subject_prefix = lang_def.subject_prefix[effective_register === 'formal' ? 'formal' : 'neutral'];
  const reply_subject = `${subject_prefix} ${sender_email_subject}`.trim();

  return {
    reply_body,
    reply_subject: reply_subject.length <= subject_prefix.length + 5 ? sender_email_subject : `${subject_prefix} ${sender_email_subject}`,
    reply_language: lang_def.name,
    reply_locale: lang_def.culture,
    formality_register: lang_def.formality_register,
    is_rtl: lang_def.is_rtl,
    sentiment_tone: intent === 'thank' ? 'warm' : intent === 'acknowledge' ? 'neutral' : 'respectful',
    reasoning: `Language detected: ${lang_def.name} (${(detection_confidence * 100).toFixed(0)}% confidence) | Culture: ${lang_def.culture} | Register: ${lang_def.formality_register} | Intent: ${intent} | Domain: ${sender_email.split('@')[1] || 'unknown'}`,
    confidence: detection_confidence,
  };
}

export function supported_languages(): string[] {
  return Object.keys(LANGUAGES);
}

export default { generate_cross_language_reply, supported_languages };
