import React, { useState, useRef } from 'react';
import { ChefHat, X, CheckCircle2, Building2, MapPin, User, Phone, ArrowRight, UploadCloud, FileCheck, ShieldCheck, AlertCircle, ScanLine, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentVerificationResult, analyzeDocumentImage } from '../../utils/aiDocumentVerifier';

export const KitchenRegisterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { lang } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [kitchenName, setKitchenName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');

  // AI Document verification state
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<DocumentVerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    setVerificationResult(null);

    // Multi-stage AI scanning steps
    setAnalysisStep(lang === 'kz' ? 'Құжат құрылымы мен бланкісін сканерлеу...' : lang === 'en' ? 'Scanning document layout & seals...' : 'Сканирование бланка и гербовых печатей...');
    await new Promise(r => setTimeout(r, 600));

    setAnalysisStep(lang === 'kz' ? 'БСН / ЖСН деректерін тану...' : lang === 'en' ? 'Extracting BIN / IIN credentials...' : 'Распознавание БИН / ИИН и реквизитов...');
    await new Promise(r => setTimeout(r, 600));

    setAnalysisStep(lang === 'kz' ? 'ЭҚЖЖ (ОКЭД) қоғамдық тамақтану сәйкестігін тексеру...' : lang === 'en' ? 'Checking catering NACE / OKED classification...' : 'Проверка ОКЭД на профиль Общественное питание...');
    await new Promise(r => setTimeout(r, 500));

    try {
      const result = await analyzeDocumentImage(file);
      setVerificationResult(result);
      if (result.isValid && result.businessName && !kitchenName) {
        setKitchenName(result.businessName);
      }
    } catch (err) {
      console.error(err);
      setVerificationResult({
        isValid: false,
        confidence: 15,
        documentType: 'Ошибка обработки',
        isFoodService: false,
        checks: [],
        warning: 'Не удалось обработать изображение. Попробуйте другой файл.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenName.trim() || !phone.trim()) return;

    // Save registration inquiry
    const inquiries = JSON.parse(localStorage.getItem('foodmaxxing_kitchen_inquiries') || '[]');
    inquiries.push({
      id: `reg_${Date.now()}`,
      kitchenName: kitchenName.trim(),
      locationName: locationName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      aiVerified: verificationResult?.isValid || false,
      binIin: verificationResult?.binIin || null,
      okedCode: verificationResult?.okedCode || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(inquiries));

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setKitchenName('');
    setLocationName('');
    setContactName('');
    setPhone('');
    setUploadedImagePreview(null);
    setVerificationResult(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Асхананы тіркеу' : lang === 'en' ? 'Register Cafeteria / Kitchen' : 'Зарегистрировать кухню'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'FoodMaxxing желісіне қосылу және құжаттарды AI арқылы тексеру' : lang === 'en' ? 'Partner onboarding with AI business document verification' : 'Подключение столовой к системе FoodMaxxing с верификацией документов'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">
                {lang === 'kz' ? 'Өтінім сәтті қабылданды!' : lang === 'en' ? 'Application Received Successfully!' : 'Заявка успешно принята!'}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {lang === 'kz'
                  ? 'Біздің инженерлік топ 15 минут ішінде хабарласып, асханаңызға арналған аспаз экраны мен сөрелерді баптап береді.'
                  : lang === 'en'
                  ? 'Our engineering team will contact you within 15 minutes to provision your cook screen and shelf bays.'
                  : 'Мы свяжемся с вами в течение 15 минут для выдачи учетной записи, настройки экрана поваров и тепловых полок.'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-left font-mono space-y-1.5">
              <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Детали заявки:</div>
              <div className="font-bold text-gray-900 text-sm">{kitchenName}</div>
              <div className="text-gray-600">{locationName || (lang === 'kz' ? 'Орналасқан жері' : lang === 'en' ? 'Location' : 'Локация')}</div>
              <div className="text-orange-600 font-bold">{phone}</div>
              {verificationResult?.isValid && (
                <div className="pt-2 border-t border-gray-200 mt-2 flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Верифицировано AI • БИН/ИИН: {verificationResult.binIin}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs transition-all"
            >
              {lang === 'kz' ? 'Жабу' : lang === 'en' ? 'Close' : 'Отлично, закрыть'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* AI Document Upload & Verification Section */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-400 rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 font-black text-gray-900 text-xs">
                    <FileCheck className="w-4 h-4 text-orange-600" />
                    <span>
                      {lang === 'kz' ? 'AI Құжат тексеруі (Талон / Свидетельство)' : lang === 'en' ? 'AI Business Document Verification' : 'AI-верификация заведения (Талон ИП / ТОО / Уведомление)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {lang === 'kz'
                      ? 'Заңды тұлға немесе қоғамдық тамақтану нысаны екеніңізді растау үшін құжат фотосын жүктеңіз'
                      : lang === 'en'
                      ? 'Upload business registration or food license to verify legitimate catering entity'
                      : 'Загрузите фото талона ИП/ТОО или уведомления о начале деятельности общепита для мгновенного подтверждения статуса'}
                  </p>
                </div>
              </div>

              {/* Upload Input & Drop Area */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />

              {!uploadedImagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-orange-50/50 hover:border-orange-300 transition-all space-y-2 group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      {lang === 'kz' ? 'Құжат фотосын таңдау немесе сүйреп әкелу' : lang === 'en' ? 'Upload or drag & drop document photo' : 'Нажмите для загрузки фото документа (PNG, JPG)'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Талон ИП, Свидетельство ТОО, Уведомление СЭС об объекте питания
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Document Preview with Laser Scan Effect */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-300 max-h-48 bg-black flex items-center justify-center">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded Document"
                      className="w-full h-44 object-cover opacity-90"
                    />

                    {/* Laser Scanner Line while analyzing */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce" />
                        <div className="bg-black/60 backdrop-blur-xs p-2 text-center text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center space-x-2">
                          <ScanLine className="w-4 h-4 animate-spin" />
                          <span>{analysisStep}</span>
                        </div>
                      </div>
                    )}

                    {/* Change document button */}
                    {!isAnalyzing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Заменить фото</span>
                      </button>
                    )}
                  </div>

                  {/* AI Verification Results Card */}
                  {verificationResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                        verificationResult.isValid
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-bold">
                          {verificationResult.isValid ? (
                            <>
                              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-emerald-900 font-black">
                                Документ подтвержден AI ({verificationResult.confidence}%)
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span className="text-amber-900 font-black">
                                Требуется проверка документа
                              </span>
                            </>
                          )}
                        </div>
                        {verificationResult.isValid && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold">
                            ОКЭД: {verificationResult.okedCode}
                          </span>
                        )}
                      </div>

                      {verificationResult.isValid ? (
                        <div className="space-y-1 text-[11px] text-gray-700 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Тип документа:</span>
                            <span className="font-semibold text-gray-900 text-right">{verificationResult.documentType}</span>
                          </div>
                          {verificationResult.binIin && (
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-500 font-sans">БИН / ИИН:</span>
                              <span className="font-bold text-gray-900">{verificationResult.binIin}</span>
                            </div>
                          )}
                          {verificationResult.businessName && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Юр. лицо / ИП:</span>
                              <span className="font-bold text-emerald-900">{verificationResult.businessName}</span>
                            </div>
                          )}
                          {verificationResult.okedTitle && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Профиль ОКЭД:</span>
                              <span className="font-semibold text-gray-800 text-right">{verificationResult.okedTitle}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {verificationResult.warning || 'Загруженное изображение не похоже на официальный регистрационный талон.'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Standard Form Inputs */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-600" />
                <span>{lang === 'kz' ? 'Асхана / нүктенің атауы' : lang === 'en' ? 'Cafeteria / Venue Name' : 'Название столовой или заведения'} *</span>
              </label>
              <input
                type="text"
                required
                value={kitchenName}
                onChange={e => setKitchenName(e.target.value)}
                placeholder="e.g. Столовая Главного корпуса, Burger Hub"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{lang === 'kz' ? 'Орналасқан жері' : lang === 'en' ? 'Location' : 'Локация'}</span>
              </label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="e.g. Блок С, 1 этаж / ул. Абая 10"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>{lang === 'kz' ? 'Байланыс тұлғасы' : lang === 'en' ? 'Manager Name' : 'Имя управляющего'}</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Азамат С."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kz' ? 'Телефон' : lang === 'en' ? 'Phone Number' : 'Номер телефона'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (7XX) XXX-XX-XX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-900 leading-relaxed">
              <strong>Бесплатный пилотный запуск:</strong> подключение, предоставление планшета с экраном повара и обучение персонала занимают менее 24 часов.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs"
              >
                <span>{lang === 'kz' ? 'Қосылуға өтінім жіберу' : lang === 'en' ? 'Submit Kitchen Application' : 'Отправить заявку на подключение'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
