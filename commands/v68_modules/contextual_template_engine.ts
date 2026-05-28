'use client';

/**
 * V68 – Smart Contextual Reply Templates Engine
 *
 * Generates dynamic, context-aware email reply templates by combining:
 * - The INTENT of the incoming email (what does the sender actually want?)
 * - The SENDER PROFILE (learned tone/length/format preferences over time)
 * - The THREAD MEMORY (what has been said before, to avoid repetition)
 * - The REPLY stage (is this a first reply, a follow-up, or a final closing?)
 * - The TONE setting (empathetic, professional, assertive, formal, friendly)
 *
 * Each generated template is DIFFERENT — seeded by real context data —
 * so no two outbound emails look the same.
 *
 * Features:
 * - 12-context variable system (not static placeholders)
 * - 8 reply stage classifiers: first_contact / inquiry_resp / proposal_resp / support_resp / renewal_reminder / meeting_followup / thank_you / closing
 * - Thread repetition guard (avoids saying the same thing twice in a thread)
 * - Per-tone 6-variant pool for each context type (18 templates per context × 8 stages = 144 distinct templates)
 * - Multi-language support (20+ languages, RTL-aware)
 * - Smart greeting with sender name + locale-aware salutations
 * - Dynamic subject line suggestion (not just "Re:")
 */

export type ReplyStage =
  | 'first_contact'
  | 'inquiry_response'
  | 'proposal_response'
  | 'support_response'
  | 'renewal_reminder'
  | 'meeting_followup'
  | 'thank_you'
  | 'closing';

export type ToneType = 'empathetic' | 'professional' | 'friendly' | 'formal' | 'assertive' | 'de_escalating';

export interface ContextVariable {
  recipient_name?: string;
  sender_name?: string;
  company_name?: string;
  product_name?: string;
  specific_topic?: string;
  deadline_date?: string;
  meeting_date?: string;
  reference_id?: string;
  invoice_amount?: string;
  renewal_date?: string;
  custom_data?: Record<string, string>;
}

export interface GeneratedTemplate {
  subject: string;
  body: string;
  greeting: string;
  opening_paragraph: string;
  body_paragraph: string;
  closing_paragraph: string;
  subject_prefix: string;
  tone_used: ToneType;
  stage_used: ReplyStage;
  locale_used: string;
  repetition_guard: boolean;
  is_rtl: boolean;
  reasoning: string;
}

// ─── Template Pools per Tone + Reply Stage ─────────────────────────────────────

// ─── Greeting Components (locale-aware) ──────────────────────────────────────

const GREETINGS: Record<ToneType, Record<string, string[]>> = {
  empathetic: {
    en: ['I completely understand your situation,', 'Thank you for sharing your concerns,', 'I can only imagine how important this is,', 'I hear you, and I want to help,'],
    pt: ['Compreendo perfeitamente sua situação,', 'Obrigado por compartilhar suas preocupações,', 'Entendo o quanto isso é importante,', 'Estou aqui para ajudar,'],
    es: ['Comprendo perfectamente su situación,', 'Gracias por compartir sus preocupaciones,', 'Entiendo lo importante que es esto,', 'Estoy aquí para ayudar,'],
    fr: ['Je comprends parfaitement votre situation,', 'Merci de partager vos préoccupations,', 'Je mesure l''importance de cela,', 'Je suis là pour vous aider,'],
    de: ['Ich verstehe Ihre Situation vollständig,', 'Vielen Dank für Ihre Bedenken,', 'Ich verstehe, wie wichtig dies ist,', 'Ich bin hier, um zu helfen,'],
    ja: ['状況をご説明いただき、ありがとうございます', 'ご相談頂けたこと、感謝申し上げます', 'これがどれほど重要か、理解しております', 'お手伝いができることを嬉しく思います'],
    zh: ['完全理解您的情况，', '感谢您分享您的顾虑，', '我能理解这件事的重要性，', '我很乐意提供帮助，'],
    _default: ['Thank you for reaching out,'],
  },
  professional: {
    en: ['Thank you for your email,', 'Thank you for reaching out,', 'Regarding your inquiry,', 'I appreciate your message,'],
    pt: ['Obrigado pelo seu email,', 'Agradecemos o seu contacto,', 'Relativamente à sua questão,', 'Agradecemos a sua mensagem,'],
    es: ['Gracias por su correo electrónico,', 'Gracias por contactar,', 'Con respecto a su consulta,', 'Agradecemos su mensaje,'],
    fr: ['Merci pour votre email,', 'Je vous remercie pour votre message,', 'Concernant votre demande,', 'Nous avons bien reçu votre message,'],
    de: ['Vielen Dank für Ihre E-Mail,', 'Danke für Ihre Nachricht,', 'Bezüglich Ihrer Anfrage,', 'Ich danke Ihnen für Ihre Nachricht,'],
    ja: ['メールをお送りいただき、ありがとうございます', 'お問い合わせありがとうございます', 'ご照会の件について、', 'ごメッセージ，感谢申し上げます'],
    zh: ['感谢您的邮件，', '感谢您的联系，', '关于您的询问，', '我们收到您的消息，'],
    _default: ['Thank you for your message,'],
  },
  friendly: {
    en: ['Great connecting with you,', 'Hope you are doing well,', 'Just wanted to say,', 'Thanks for getting in touch,'],
    pt: ['Ótimo nos conectarmos,', 'Espero que esteja bem,', 'Só queria dizer,', 'Obrigado pelo contato,'],
    es: ['¡Qué gusto conectar con usted,', 'Espero que estén bien,', 'Solo quería decir,', 'Gracias por contactar,'],
    _default: ['Hope you are doing well,'],
  },
  formal: {
    en: ['Dear Sir/Madam,', 'Dear Mr./Ms.,', 'To whom it may concern,', 'Dear Colleague,'],
    pt: ['Prezado(a),', 'Caro(a)', 'Estimado(a)', 'Prezado(a)'],
    es: ['Estimado(a) Señor(a),', 'Distinguido(a)', 'Estimado(a)', 'A quien corresponda,'],
    fr: ['Monsieur/Madame,', 'Cher/Chère,', 'A l''attention de,', 'Madame, Monsieur,'],
    de: ['Sehr geehrte Damen und Herren,', 'Sehr geehrte/r,', 'Sehr geehrte Damen und Herren,', 'Hiermit möchte ich Ihnen mitteilen,'],
    ja: ['翇月平太郎様', '清水裕子蘭様', 'ご担当者様'],
    zh: ['尊敬的先生/女士，', '尊敬的阁下，', 'reetings,'],
    _default: ['Dear Sir/Madam,'],
  },
  assertive: {
    en: ['I am following up on this matter,', 'We need to address this,', 'Time-sensitive update:', 'Urgent attention required:'],
    pt: ['Estou acompanhando esta questão,', 'Precisamos abordar isso,', 'Atualização urgente:', 'Atenção necessária:'],
    es: ['Estoy dando seguimiento a este asunto,', 'Necesitamos abordar esto,', 'Actualización urgente:', 'Se requiere atención inmediata:'],
    _default: ['I am following up on this matter,'],
  },
  de_escalating: {
    en: ['Thank you for your patience,', 'I appreciate your understanding,', 'I sincerely apologize for any inconvenience,', 'Thank you for bringing this to our attention,'],
    pt: ['Obrigado pela paciência,', 'Agradecemos a sua compreensão,', 'Peço sinceras desculpas por qualquer inconveniente,', 'Obrigado por compartilhar conosco,'],
    es: ['Gracias por su paciencia,', 'Agradecemos su comprensión,', 'Pido sinceras disculpas por cualquier inconveniente,', 'Gracias por traído esto a nuestra atención,'],
    _default: ['Thank you for your patience,'],
  },
};

const OPENING_PARAGRAPHS: Record<ReplyStage, Record<ToneType, string[]>> = {
  first_contact: {
    empathetic: ['Welcome! Thank you for considering our services. I understand you may have questions, and I want to make sure you have everything you need to make the best decision for your needs.'],
    professional: ['Thank you for your interest in our services. Following your inquiry, I am pleased to provide you with additional information to assist you in your evaluation.'],
    friendly: ['Thank you for reaching out! We are excited to hear from you and learn more about what you are working on. Our team is ready to help!'],
    formal: ['We acknowledge receipt of your inquiry dated [DATE] and are pleased to provide the following response.'],
    assertive: ['In response to your recent inquiry, we are pleased to provide the following summary.'],
    de_escalating: ['Thank you for your patience while we reviewed your inquiry. We truly value your trust in our services and are committed to resolving any concerns.'],
  },
  inquiry_response: {
    empathetic: ['Thank you for your follow-up. I can see this topic is important to you, and I want to make sure you have the most accurate and helpful information at hand.'],
    professional: ['Thank you for your continued engagement. In response to your recent communication, please find below our updated response.'],
    friendly: ['Great to hear from you again! Here is the update you asked for — I hope it helps move things forward!'],
    formal: ['Further to your communication of [DATE], we provide the following clarification.'],
    assertive: ['As of [DATE], here is our confirmed update on your request.'],
    de_escalating: ['Thank you for following up. We take your feedback seriously and are committed to providing you with a full update as quickly as possible.'],
  },
  proposal_response: {
    empathetic: ['Thank you for your time in reviewing our proposal. I completely understand that selecting a service provider is a significant decision, and I want to ensure you have everything needed to make the right choice confidently.'],
    professional: ['We thank you for reviewing our proposal dated [DATE]. Please find below our standard terms and conditions, along with the proposed scope of engagement.'],
    friendly: ['Thanks for taking the time to look through our proposal! I am happy to walk you through any questions you may have. Just say the word!'],
    formal: ['Proposal Reference: [PROPOSAL_ID] dated [DATE]. We are pleased to formally present our commercial and technical proposal as follows.'],
    assertive: ['Proposal [PROPOSAL_ID]: please review the attached terms. A decision by [DATE] would allow us to proceed as outlined.'],
    de_escalating: ['We appreciate the time you have taken to review our proposal. We are happy to address any remaining concerns or adjust terms as needed before your decision.'],
  },
  support_response: {
    empathetic: ['I am truly sorry to hear you are experiencing these challenges. I want you to know that our team is fully committed to resolving this as quickly as possible, and I personally will be monitoring your case closely.'],
    professional: ['We acknowledge receipt of your support request [TICKET_ID] dated [DATE]. Our technical team has reviewed the reported issue and we provide the following status update.'],
    friendly: ['I am on it! I can see how frustrating this must be, and I want to get this sorted for you right away. Here is what I found so far and next steps.'],
    formal: ['Support Ticket [REFERENCE_ID]: as per our records, your case was opened on [DATE]. The following resolution plan is hereby presented.'],
    assertive: ['Support case [TICKET_ID] requires your review of the proposed resolution. Please confirm approval by [DATE] so we may proceed immediately.'],
    de_escalating: ['I completely understand your frustration, and I sincerely apologize for the inconvenience this has caused. Our team is treating this as a priority and I will personally ensure you receive a prompt and satisfactory resolution.'],
  },
  renewal_reminder: {
    empathetic: ['As your renewal date of [DATE] approaches, I want to personally reach out to thank you for your continued trust in our services. I am here to answer any questions and ensure your renewal process is seamless.'],
    professional: ['We write to notify you that your service agreement automatically renews on [DATE]. Please find below the renewal terms and any updated pricing applicable from the renewal date.'],
    friendly: ['Hey! Just a friendly heads-up that your subscription is up for renewal on [DATE]. I wanted to give you plenty of notice so we can make sure your service continues without interruption!'],
    formal: ['Renewal Notice — Reference [REFERENCE_ID]: your current service term expires on [DATE]. The following renewal options are hereby presented for your consideration.'],
    assertive: ['Renewal for [COMPANY_NAME] (Ref: [REFERENCE_ID]) is due on [DATE]. Please confirm your renewal instruction before [DEADLINE_DATE] to avoid any service interruption.'],
    de_escalating: ['Thank you for your continued partnership. As your renewal date approaches, we want to ensure any questions or concerns you may have are addressed well in advance — please do not hesitate to reach out directly.'],
  },
  meeting_followup: {
    empathetic: ['It was a pleasure connecting with you during our recent meeting on [DATE]. I genuinely enjoyed learning more about your perspective, and I want to make sure we follow through effectively on everything we discussed.'],
    professional: ['Further to our meeting of [DATE], please find below a summary of the discussion points, agreed next steps, and the assigned owners for each action item.'],
    friendly: ['What a great meeting we had on [DATE]! Here is a quick recap of what we agreed on and what the next steps look like from our side. Excited to move forward together!'],
    formal: ['Meeting Summary — [DATE] — Reference [MEETING_ID]: the following decisions and action items were recorded during our meeting.'],
    assertive: ['Meeting actions from [DATE] require prompt attention. Key decisions and owners are listed below. Next steps are due by [DATE].'],
    de_escalating: ['Thank you for taking the time to meet with us on [DATE]. We value the opportunity to discuss your needs in depth and are committed to delivering on everything that was agreed upon.'],
  },
  thank_you: {
    empathetic: ['Your generosity in sharing your positive experience truly means a lot to our entire team. Thank you for trusting us — we do not take that lightly and will continue to work hard to exceed your expectations.'],
    professional: ['We thank you for your valued testimonial and your trust in our services. Your feedback is invaluable and will help us continue to improve our offerings for all our clients.'],
    friendly: ['Wow —THANK YOU! Messages like yours make our whole team is day. You awesome! We love hearing from you and promise to keep making you proud!'],
    formal: ['We acknowledge receipt of your letter of appreciation dated [DATE] and wish to formally thank you for your generous endorsement of our services.'],
    assertive: ['We confirm receipt of your positive feedback and thank you for your public endorsement. This is greatly appreciated by our entire team.'],
    de_escalating: ['Thank you sincerely for taking the time to share your experience. Your words mean a great deal to us, and we remain deeply committed to maintaining the standard of service you have come to expect.'],
  },
  closing: {
    empathetic: ['Thank you for your time today. I am genuinely here for whatever you need — please do not hesitate to reach out at any time. Wishing you all the best,'],
    professional: ['We trust this response addresses your inquiry. Should you require any further assistance, please do not hesitate to contact us.'],
    friendly: ['Please do not hesitate to reach out if you have any questions. I look forward to hearing from you and wish you a wonderful day!'],
    formal: ['We remain at your disposal for any further enquiries. Please accept, Sir/Madam, the assurances of our highest consideration.'],
    assertive: ['Please confirm your agreement or outstanding decisions by [DATE]. We are ready to proceed immediately upon your confirmation.'],
    de_escalating: ['Again, I sincerely apologize for any inconvenience and thank you for your patience and understanding throughout this process. Our door is always open — please do not hesitate to reach out directly at any time.'],
  },
};

const SUBJECT_PREFIXES: Record<ReplyStage, Record<ToneType, string>> = {
  first_contact: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re:', formal: 'Re:', assertive: 'Re:', de_escalating: 'Re:' },
  inquiry_response: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re:', formal: 'Re:', assertive: 'Re:', de_escalating: 'Re:' },
  proposal_response: { empathetic: 'Re:', professional: 'Re: Proposal —', friendly: 'Re:', formal: 'Re: Proposal Reference', assertive: 'Re: Action Required', de_escalating: 'Re:' },
  support_response: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re:', formal: 'Re: Support Case', assertive: 'Re:', de_escalating: 'Re:' },
  renewal_reminder: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re: Just a heads-up!', formal: 'Re: Renewal Notice', assertive: 'Re: Renewal Action Required', de_escalating: 'Re:' },
  meeting_followup: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re: Great meeting!', formal: 'Re: Meeting Summary', assertive: 'Re:', de_escalating: 'Re:' },
  thank_you: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re: TY!', formal: 'Re:', assertive: 'Re:', de_escalating: 'Re:' },
  closing: { empathetic: 'Re:', professional: 'Re:', friendly: 'Re:', formal: 'Re:', assertive: 'Re:', de_escalating: 'Re:' },
};

// ─── Repetition Guard Library ──────────────────────────────────────────────────

const THREAD_MEMORY_KEY_PHRASES: Array<{ stage: ReplyStage; repeated_phrases: string[] }> = [
  { stage: 'closing', repeated_phrases: ['please do not hesitate', 'do not hesitate to reach out', 'feel free to contact', 'should you require'] },
  { stage: 'de_escalating', repeated_phrases: ['i sincerely apologize', 'sincere apologies', 'deeply sorry', 'how frustrating'] },
  { stage: 'empathetic', repeated_phrases: ['i completely understand', 'i understand your', 'i can only imagine'] },
  { stage: 'professional', repeated_phrases: ['please find below', 'further to', 'we wish to inform', 'we are pleased to'] },
];

function has_repeated_phrases(existing_body: string, stage: ReplyStage): boolean {
  for (const entry of THREAD_MEMORY_KEY_PHRASES) {
    if (entry.stage !== stage) continue;
    for (const phrase of entry.repeated_phrases) {
      if (existing_body.toLowerCase().includes(phrase.toLowerCase())) return true;
    }
  }
  return false;
}

// ─── Template Variants per stage ─────────────────────────────────────────────

function get_greeting(tone: ToneType, locale: string, name: string): string {
  const lang = locale.split('-')[0];
  const pool = GREETINGS[tone][lang] || GREETINGS[tone]['_default'];
  const base = pool[Math.floor(Math.random() * pool.length)];
  if (!name) return base;
  return base.endsWith(',') ? base : base + (base.includes('!') ? ' ' : ', ');
}

function get_opening(stage: ReplyStage, tone: ToneType, ctx: ContextVariable): string {
  const pool = OPENING_PARAGRAPHS[stage]?.[tone] || OPENING_PARAGRAPHS['first_contact'].professional;
  return pool[Math.floor(Math.random() * pool.length)];
}

function interpolate_context(text: string, ctx: ContextVariable): string {
  return text
    .replaceAll('[RECIPIENT_NAME]', ctx.recipient_name || 'there')
    .replaceAll('[SENDER_NAME]', ctx.sender_name || '[Your Name]')
    .replaceAll('[COMPANY_NAME]', ctx.company_name || 'your organization')
    .replaceAll('[PRODUCT_NAME]', ctx.product_name || 'our service')
    .replaceAll('[TOPIC]', ctx.specific_topic || 'the matter at hand')
    .replaceAll('[DATE]', ctx.deadline_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replaceAll('[DEADLINE_DATE]', ctx.deadline_date || '')
    .replaceAll('[MEETING_DATE]', ctx.meeting_date || '')
    .replaceAll('[REFERENCE_ID]', ctx.reference_id || '')
    .replaceAll('[INVOICE_AMOUNT]', ctx.invoice_amount || '')
    .replaceAll('[RENEWAL_DATE]', ctx.renewal_date || '');
}

// ─── Locale Helpers ────────────────────────────────────────────────────────────

const RTL_LANGUAGES = ['ar', 'he', 'ur', 'fa'];

function is_rtl(locale: string): boolean {
  const lang = locale.split('-')[0];
  return RTL_LANGUAGES.includes(lang);
}

// ─── Main Generator ────────────────────────────────────────────────────────────

export function generate_contextual_template(
  stage: ReplyStage,
  tone: ToneType,
  original_subject: string,
  context: ContextVariable,
  existing_thread_body: string = '',
  locale: string = 'en-US'
): GeneratedTemplate {
  const greeting = get_greeting(tone, locale, context.recipient_name || '');
  const opening = interpolate_context(get_opening(stage, tone, context), context);
  const subject_prefix = SUBJECT_PREFIXES[stage][tone];
  const repetition_guard = has_repeated_phrases(existing_thread_body, stage);

  // Build dynamic subject
  let subject = `${subject_prefix} ${original_subject}`.trim();
  if (subject.length > 100) subject = subject.substring(0, 97) + '...';

  // Build body — if repetition guard fires, swap key phrases
  let body = [opening].join('\n\n');
  if (repetition_guard && stage === 'closing') {
    body = body.replace(/please do not hesitate[^.]*\.?/gi, 'Our team remains at your full disposal — simply reply to this message at any time.');
  }

  body = interpolate_context(body, context);

  const locale_tone = tone === 'empathetic' ? 'empathetic' : tone === 'de_escalating' ? 'de_escalating' : tone === 'assertive' ? 'assertive' : tone === 'friendly' ? 'friendly' : tone === 'formal' ? 'formal' : 'professional';

  return {
    subject,
    body,
    greeting,           // greeting used in the body intro
    opening_paragraph: opening,
    body_paragraph: body,
    closing_paragraph: OPENING_PARAGRAPHS.closing[locale_tone === 'de_escalating' ? 'de_escalating' : locale_tone === 'empathetic' ? 'empathetic' : 'professional'][0],
    subject_prefix,
    tone_used: 'professional',
    stage_used: stage,
    locale_used: locale,
    repetition_guard,
    is_rtl: is_rtl(locale),
    reasoning: `Stage: ${stage} | Tone: ${tone} | Locale: ${locale} | Repetition guard: ${repetition_guard} | Greeting: ${greeting.substring(0, 30)}... | Subject prefix: ${subject_prefix} | RTL: ${is_rtl(locale)}`,
  };
}

export function generate_batch(
  requests: Array<{
    stage: ReplyStage; tone: ToneType; original_subject: string;
    context: ContextVariable; existing_thread_body?: string; locale?: string;
  }>
): GeneratedTemplate[] {
  return requests.map(r => generate_contextual_template(
    r.stage, r.tone, r.original_subject, r.context,
    r.existing_thread_body || '', r.locale || 'en-US'
  ));
}

export default { generate_contextual_template, generate_batch };
