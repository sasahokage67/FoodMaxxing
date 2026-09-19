export type Language = 'kz' | 'ru' | 'en';

export interface Translations {
  brandTitle: string;
  brandSubtitle: string;
  customerApp: string;
  kitchenKds: string;
  resetDemo: string;
  advance5m: string;
  
  // Real-time clock, sound & enhancements
  soundOn: string;
  soundOff: string;
  liveClock: string;
  countdownPrefix: string;
  countdownReady: string;
  countdownMins: string;
  countdownSecs: string;
  shareWhatsApp: string;
  shareWhatsAppText: string;
  tagHalal: string;
  tagVeg: string;
  tagHit: string;
  filterAll: string;
  filterHalal: string;
  filterHit: string;
  filterVeg: string;

  // My Orders & Photo Receipt
  myOrders: string;
  activeOrders: string;
  completedOrders: string;
  noOrders: string;
  noOrdersDesc: string;
  viewStatusPass: string;
  viewReceipt: string;
  receiptModalTitle: string;
  downloadPhoto: string;
  downloading: string;
  paidCard: string;
  transactionId: string;
  copyReceipt: string;
  copied: string;
  
  // Venue
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  badge3steps: string;
  badge3stepsDesc: string;
  badgeWait: string;
  badgeWaitDesc: string;
  badgeShelf: string;
  badgeShelfDesc: string;
  selectLocation: string;
  cafeteriaName: string;
  cafeteriaLoc: string;
  activeNow: string;
  kitchenNormal: string;
  prepTimeAvg: string;
  orderBtn: string;
  secondaryCafe: string;
  secondaryLoc: string;
  opensAt13: string;
  noSmsTitle: string;
  noSmsDesc: string;

  // Menu
  categories: {
    all: string;
    burgers: string;
    snacks: string;
    pizza: string;
    drinks: string;
  };
  backToVenues: string;
  expressPickupActive: string;
  step1Selected: string;
  step2ChooseTime: string;
  addToCart: string;
  minAbbr: string;
  priceKzt: string;

  // Cart & Slot
  step2Title: string;
  backToMenu: string;
  orderSummary: string;
  total: string;
  selectSlotHeader: string;
  prepEst: string;
  slotDesc: string;
  slotIdeal: string;
  slotPeak: string;
  slotFull: string;
  step3Title: string;
  nameInputLabel: string;
  nameInputPlaceholder: string;
  phoneInputLabel: string;
  zeroFrictionNote: string;
  reservingSlot: string;
  confirmOrderBtn: string;

  // Tracking
  orderNumberLabel: string;
  customerLabel: string;
  statusScheduled: string;
  statusCooking: string;
  statusReady: string;
  statusPickedUp: string;
  statusCancelled: string;
  stepScheduled: string;
  stepCooking: string;
  stepReady: string;
  delayAlertTitle: string;
  delayAlertDesc: string;
  shelfLocationLabel: string;
  shelfLocationDesc: string;
  openPasscardBtn: string;
  orderDetailsTitle: string;
  cancelScheduledBtn: string;
  cancelBlockedNote: string;
  confirmCancelPrompt: string;

  // Passcard
  passcardTitle: string;
  readyHeader: string;
  goDirectlyTo: string;
  scanQrPrompt: string;
  passcardFooter: string;
  backToStatus: string;

  // Kitchen KDS
  kdsTitle: string;
  kdsSubtitle: string;
  liveBadge: string;
  scannerBtn: string;
  stationsBtn: string;
  workloadTitle: string;
  workloadSubtitle: string;
  colScheduled: string;
  colCooking: string;
  colReady: string;
  autoFires: string;
  activeSlots: string;
  awaitingScan: string;
  emptyScheduled: string;
  emptyCooking: string;
  emptyReady: string;
  fireJitTime: string;
  targetPickupTime: string;
  delayedBy: string;
  startCookingBtn: string;
  markReadyBtn: string;
  delay5mBtn: string;
  completeHandoverBtn: string;
  telemetryTitle: string;
  measuredDwell: string;

  // Scanner & Settings Modals
  scannerModalTitle: string;
  scannerModalSubtitle: string;
  scanInputLabel: string;
  verifyBtn: string;
  stagedOnShelves: string;
  clickToSimulate: string;
  noReadyOrders: string;
  settingsModalTitle: string;
  settingsModalSubtitle: string;
  applySettingsBtn: string;

  // Simulation Lab
  simHeroBadge: string;
  simHeroTitle: string;
  simHeroDesc: string;
  runSimBtn: string;
  runningSimBtn: string;
  metricThroughput: string;
  metricAvgWait: string;
  metricPeakQueue: string;
  metricAbandoned: string;
  scenATitle: string;
  scenASubtitle: string;
  scenADesc1: string;
  scenADesc2: string;
  scenADesc3: string;
  scenBTitle: string;
  scenBSubtitle: string;
  scenBDesc1: string;
  scenBDesc2: string;
  scenBDesc3: string;
  qaTitle: string;
  qa1Title: string;
  qa1Text: string;
  qa2Title: string;
  qa2Text: string;
  qa3Title: string;
  qa3Text: string;

  staffAccess: string;
  enterPin: string;
  pinPlaceholder: string;
  unlockKitchen: string;
  exitKitchen: string;
  wrongPin: string;
  clientProfile: string;
  sharePhotoWhatsApp: string;
  photoCopiedToast: string;

  kcal: string;
  totalCalories: string;
  phoneLoginBtn: string;
  phoneModalTitle: string;
  phoneModalDesc: string;
  smsCodeLabel: string;
  verifyPhoneBtn: string;
  phoneLinkedToast: string;
  linkedPhoneLabel: string;
  recipientPhoneLabel: string;
  openWhatsAppChat: string;
  pasteHint: string;
  sendToMyself: string;
  photoPreviewTitle: string;
  copyPhotoBtn: string;
  photoCopiedSuccess: string;
  dragPhotoHint: string;
  whyNoAutoAttach: string;
  whyNoAutoAttachText: string;
  openOnPhoneTab: string;
  desktopTab: string;
  scanQrPhoneDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  kz: {
    brandTitle: 'FoodMaxxing',
    brandSubtitle: 'Maximum food. Minimum waiting',
    customerApp: 'Тапсырыс беру',
    kitchenKds: 'Асхана экраны (KDS)',
    resetDemo: 'Қалпына келтіру',
    advance5m: '+5 мин',

    soundOn: 'Дыбыс қосулы',
    soundOff: 'Дыбыс өшірулі',
    liveClock: 'Нақты уақыт',
    countdownPrefix: 'Тапсырыс берілуіне дейін:',
    countdownReady: 'Тапсырыс берілуге дайын!',
    countdownMins: 'мин',
    countdownSecs: 'сек',
    shareWhatsApp: 'WhatsApp арқылы бөлісу',
    shareWhatsAppText: 'FoodMaxxing тапсырысым: №{orderNum}, Берілу уақыты: {time}, Сөре: {bay}. Орны: Университет асханасы.',
    tagHalal: 'Халал',
    tagVeg: 'Вег',
    tagHit: 'Хит',
    filterAll: 'Барлығы',
    filterHalal: 'Халал',
    filterHit: 'Хит тағамдар',
    filterVeg: 'Вегетариандық',

    myOrders: 'Менің тапсырыстарым',
    activeOrders: 'Белсенді тапсырыстар',
    completedOrders: 'Тарих және берілгендер',
    noOrders: 'Әзірге тапсырыстарыңыз жоқ',
    noOrdersDesc: 'Мәзірден кезексіз алғашқы тапсырысыңызды беріңіз!',
    viewStatusPass: 'Мәртебе мен QR-өткізу',
    viewReceipt: 'Чек / Фото',
    receiptModalTitle: 'Электронды чек (Фото)',
    downloadPhoto: 'Сурет ретінде сақтау (PNG)',
    downloading: 'Сурет дайындалуда...',
    paidCard: 'Онлайн картамен төленді',
    transactionId: 'Транзакция коды',
    copyReceipt: 'Мәтінді көшіру',
    copied: 'Көшірілді!',
    staffAccess: 'Асхана қызметкері',
    enterPin: 'Қызметкердің PIN-кодын енгізіңіз',
    pinPlaceholder: '4 таңбалы PIN (мысалы: 2026)',
    unlockKitchen: 'Асүй KDS ашу',
    exitKitchen: 'Қонақ режиміне оралу',
    wrongPin: 'Қате PIN-код (2026 деп теріңіз)',
    clientProfile: 'Клиент аккаунты',
    sharePhotoWhatsApp: 'WhatsApp-қа фото жіберу',
    photoCopiedToast: 'Чектің фотосы жүктелді және буферге көшірілді! WhatsApp-қа қойыңыз (Ctrl+V).',
    kcal: 'ккал',
    totalCalories: 'Жалпы калория',
    phoneLoginBtn: 'Телефонмен кіру / Тіркелу',
    phoneModalTitle: 'Телефон нөмірін байланыстыру',
    phoneModalDesc: 'Тапсырыстар тарихын сақтау және басқа құрылғылардан кіру үшін',
    smsCodeLabel: 'SMS-код (демо: 2026)',
    verifyPhoneBtn: 'Растау және кіру',
    phoneLinkedToast: 'Нөмір сәтті байланыстырылды!',
    linkedPhoneLabel: 'Байланысқан телефон',
    recipientPhoneLabel: 'WhatsApp нөмірі (кімге жіберу керек)',
    openWhatsAppChat: 'WhatsApp чатын ашу және жіберу',
    pasteHint: 'Фото көшірілді! WhatsApp чатына қойыңыз (Ctrl+V) және жіберіңіз',
    sendToMyself: 'Өзіме',
    photoPreviewTitle: 'Чектің дайын фотосы',
    copyPhotoBtn: '1. Фотоны көшіру (буферге)',
    photoCopiedSuccess: 'Фото көшірілді! Енді чатта Ctrl + V басыңыз',
    dragPhotoHint: 'Бұл фотоны тышқанмен WhatsApp терезесіне сүйреп апаруға болады',
    whyNoAutoAttach: 'Неге WhatsApp фотоны өзі тіркемейді?',
    whyNoAutoAttachText: 'WhatsApp қауіпсіздік ережелері бойынша сайттарға файлдарды сілтеме арқылы автоматты түрде жүктеуге тыйым салады. Компьютерде сурет буфер арқылы (Ctrl + V) немесе сүйреу арқылы жіберіледі.',
    openOnPhoneTab: 'Телефоннан жіберу',
    desktopTab: 'Компьютерден (Web)',
    scanQrPhoneDesc: 'Камераны QR-кодқа бағыттаңыз: телефоннан фото бірден WhatsApp қосымшасына тіркеледі',

    heroBadge: 'Кезексіз түскі ас',
    heroTitle: 'Алдын ала тапсырыс бер. Кел де, алып кет.',
    heroDesc: 'Асханада 20 минут кезекте тұруды ұмытыңыз. Нақты уақытты таңдаңыз — асхана тағамды сіз келген сәтке дайындайды. Алып кету — 1.5 минутта.',
    badge3steps: '3 қадам',
    badge3stepsDesc: 'Тіркелусіз',
    badgeWait: '< 2 минут',
    badgeWaitDesc: 'Алып кету уақыты',
    badgeShelf: 'Берілу сөресі',
    badgeShelfDesc: 'Тікелей қолға',
    selectLocation: 'Орынды таңдаңыз',
    cafeteriaName: 'Университет бас асханасы',
    cafeteriaLoc: 'Бас кампус, C блогы · 1-қабат',
    activeNow: 'Қабылдануда',
    kitchenNormal: 'Асхана бос',
    prepTimeAvg: '~12 мин дайындалу',
    orderBtn: 'Тапсырыс',
    secondaryCafe: 'Бизнес-орталық кафесі',
    secondaryLoc: 'B мұнарасы, Холл',
    opensAt13: 'Ашылуы: 13:00',
    noSmsTitle: 'Құпиясөзсіз және SMS-кодсыз',
    noSmsDesc: 'Тапсырыс небәрі 3 әрекетте рәсімделеді. Сандық QR-өткізу осы құрылғыда сақталады.',

    categories: {
      all: 'Барлығы',
      burgers: 'Бургерлер мен ыстық тағамдар',
      snacks: 'Жеңіл тағамдар',
      pizza: 'Пицца',
      drinks: 'Сусындар'
    },
    backToVenues: 'Орындарға қайту',
    expressPickupActive: 'FoodMaxxing қосулы',
    step1Selected: '1-қадам: Тағам таңдалды',
    step2ChooseTime: '2-қадам: Уақытты таңдау',
    addToCart: 'Қосу',
    minAbbr: 'мин',
    priceKzt: '₸',

    step2Title: '2-қадам: Алып кету уақыты',
    backToMenu: 'Мәзірге оралу',
    orderSummary: 'Тапсырыс құрамы',
    total: 'Барлығы',
    selectSlotHeader: 'Берілу уақытын таңдаңыз (әр 5 мин)',
    prepEst: 'Дайындау',
    slotDesc: 'Уақыт аралықтары асхана қуатымен үйлестірілген. Аспаздар тағамды сіз келерден дәл бұрын бастап пісіреді.',
    slotIdeal: 'Бос',
    slotPeak: 'Қарбалас',
    slotFull: 'Толған',
    step3Title: '3-қадам: Алып кету үшін есім',
    nameInputLabel: 'Сіздің есіміңіз (пакетке жазылады)',
    nameInputPlaceholder: 'мысалы, Әлихан немесе Амина',
    phoneInputLabel: 'Телефон нөмірі (міндетті емес)',
    zeroFrictionNote: 'Құпиясөз және SMS-код талап етілмейді. Тапсырыс токені браузерде сақталады.',
    reservingSlot: 'Асханадан уақыт брондалуда...',
    confirmOrderBtn: 'Тапсырысты растау',

    orderNumberLabel: 'Тапсырыс нөмірі',
    customerLabel: 'Клиент',
    statusScheduled: 'Жоспарланған',
    statusCooking: 'Асханада дайындалуда',
    statusReady: 'Сөреде дайын',
    statusPickedUp: 'Табысталды',
    statusCancelled: 'Бас тартылды',
    stepScheduled: '1. Жоспарланды',
    stepCooking: '2. Станцияларда',
    stepReady: '3. Сөреде дайын',
    delayAlertTitle: 'Дайындалу уақыты түзетілді (+5 мин)',
    delayAlertDesc: 'Асханадағы жоғары жүктемеге байланысты алып кету уақыты жаңартылды:',
    shelfLocationLabel: 'Тапсырысты алу аймағы',
    shelfLocationDesc: 'FoodMaxxing сөресіне барып, QR-өткізуді көрсетіңіз.',
    openPasscardBtn: 'QR-өткізуді ашу',
    orderDetailsTitle: 'Тапсырыс құрамы',
    cancelScheduledBtn: 'Тапсырыстан бас тарту (пісіру басталғанға дейін)',
    cancelBlockedNote: 'Тағам пісіріле бастады. Бас тарту мүмкін емес.',
    confirmCancelPrompt: 'Тапсырыстан бас тартқыңыз келетініне сенімдісіз бе?',

    passcardTitle: 'FOODMAXXING ӨТКІЗУ',
    readyHeader: 'Тапсырыс беруге дайын',
    goDirectlyTo: 'Мына сөреге барыңыз',
    scanQrPrompt: 'QR-кодты көрсетіңіз немесе нөмірді айтыңыз:',
    passcardFooter: 'Бұл экранды қызметкерге көрсетіңіз. Алып кету уақыты: 30 секундқа дейін.',
    backToStatus: 'Күйге қайту',

    kdsTitle: 'FOODMAXXING АСХАНА ЭКРАНЫ (KDS)',
    kdsSubtitle: 'Тапсырыстарды станциялар мен сөрелер бойынша синхрондау',
    liveBadge: '● Линия қосулы',
    scannerBtn: 'Беру сканері',
    stationsBtn: 'Қуаттылық',
    workloadTitle: 'Құрал-жабдықтар жүктемесі (Бос / Сыйымдылық)',
    workloadSubtitle: 'Уақыт аралықтарының қолжетімділігін анықтайды',
    colScheduled: '1. Дайындалуға жоспарланған',
    colCooking: '2. Станцияларда дайындалуда',
    colReady: '3. Сөреде дайын',
    autoFires: 'Авто-старт',
    activeSlots: 'Слоттар бос емес',
    awaitingScan: 'Клиентті күтуде',
    emptyScheduled: 'Кезекте тапсырыстар жоқ.',
    emptyCooking: 'Құрал-жабдықтар бос.',
    emptyReady: 'Сөрелерде әзірге тапсырыс жоқ.',
    fireJitTime: 'Старт',
    targetPickupTime: 'Беру уақыты',
    delayedBy: 'Кешігу',
    startCookingBtn: 'Дайындауды бастау',
    markReadyBtn: 'Дайын → Сөреге қою',
    delay5mBtn: '+5 мин Кешігу туралы ескерту',
    completeHandoverBtn: 'Берілді деп белгілеу',
    telemetryTitle: 'Берілген тапсырыстар журналы (Күту уақыты)',
    measuredDwell: 'Сөре жанында күту уақыты:',

    scannerModalTitle: 'FoodMaxxing беру сканері',
    scannerModalSubtitle: 'Клиенттің QR-кодын сканерлеңіз немесе нөмірін жазыңыз',
    scanInputLabel: 'Тапсырыс нөмірі / QR',
    verifyBtn: 'Берілуді растау',
    stagedOnShelves: 'Сөредегі тапсырыстар',
    clickToSimulate: '1 рет басу арқылы симуляция',
    noReadyOrders: 'Қазір сөрелерде дайын тапсырыс жоқ.',
    settingsModalTitle: 'Асхана қуаттылығы параметрлері',
    settingsModalSubtitle: 'Әр станциядағы бір мезгілде дайындалатын слоттар саны',
    applySettingsBtn: 'Параметрлерді сақтау',

    simHeroBadge: 'Хакатон жюриіне эксперименттік дәлелдеме',
    simHeroTitle: '100 тапсырыс симуляциясы (Обед қарбаласы)',
    simHeroDesc: 'Күту уақытының 20 минуттан 2 минутқа дейін азаюын және өткізу қабілетінің ≥25% артуын дәлелдеу. Жиынтық кезек пен FoodMaxxing слотының салыстырмасы.',
    runSimBtn: '100 тапсырыс симуляциясын іске қосу',
    runningSimBtn: 'Симуляция жүруде (100 тапсырыс)...',
    metricThroughput: 'Өткізу қабілетінің өсімі',
    metricAvgWait: 'Орташа күту уақыты',
    metricPeakQueue: 'Залдағы ең үлкен кезек',
    metricAbandoned: 'Тамақсыз кеткендер',
    scenATitle: 'А Сценарийі',
    scenASubtitle: 'Кәдімгі асхана (Жиынтық кезек)',
    scenADesc1: 'Кассир 1 адамға 60-80 сек жұмсайды → сағат 12:30-да 30+ адам кезекте тұрады.',
    scenADesc2: 'Поварлар чектер бойынша ретсіз пісіріп, грильді бітеп тастайды.',
    scenADesc3: 'Студенттер шулы залда 18–22 минут күтеді; көбі тамақтан бас тартып кетеді.',
    scenBTitle: 'Б Сценарийі',
    scenBSubtitle: 'FoodMaxxing (Слоттар мен үйлестіру)',
    scenBDesc1: 'Касса кезегі жойылды: 100% сандық тапсырыс.',
    scenBDesc2: 'Жүктеме 5 минуттық аралықтарға біркелкі бөлінеді (Peak Shaving).',
    scenBDesc3: 'Тағам дәл келу сәтіне әзір болады → залда күту уақыты 1.5 минут.',
    qaTitle: 'Жюриге жауаптар: Неге бұл жүйе жұмыс істейді?',
    qa1Title: '1. Литтл заңы (L = λW)',
    qa1Text: 'Клиенттің залда болу уақытын (W) 18-ден 1.8 мин-қа дейін қысқарту арқылы залдағы адам санын (L) 10 есе азайтамыз.',
    qa2Title: '2. Касса кептелісін жою',
    qa2Text: '1 кассир сағатына 40 адамнан артық өткізе алмайды. Сандық алдын ала тапсырыс асханаға тұрақты үздіксіз жұмыс береді.',
    qa3Title: '3. Грильде бір мезгілде пісіру',
    qa3Text: '12:45 уақытына берілген тапсырыстарды көре отырып, аспаз грильде 4 котлетті бірге қуырады.'
  },
  ru: {
    brandTitle: 'FoodMaxxing',
    brandSubtitle: 'Maximum food. Minimum waiting',
    customerApp: 'Приложение клиента',
    kitchenKds: 'Экран кухни (KDS)',
    resetDemo: 'Сброс демо',
    advance5m: '+5 мин',

    soundOn: 'Звук включен',
    soundOff: 'Звук выключен',
    liveClock: 'Текущее время',
    countdownPrefix: 'До выдачи заказа:',
    countdownReady: 'Заказ готов к выдаче прямо сейчас!',
    countdownMins: 'мин',
    countdownSecs: 'сек',
    shareWhatsApp: 'Отправить чек в WhatsApp',
    shareWhatsAppText: 'Мой заказ в FoodMaxxing: #{orderNum}. Время выдачи: {time}. Полка: {bay}. Место: Главная столовая кампуса.',
    tagHalal: 'Халал',
    tagVeg: 'Вег',
    tagHit: 'Хит',
    filterAll: 'Все блюда',
    filterHalal: 'Халал',
    filterHit: 'Хит заказов',
    filterVeg: 'Вегетарианское',

    myOrders: 'Мои заказы',
    activeOrders: 'Активные заказы',
    completedOrders: 'История и выданные',
    noOrders: 'У вас пока нет заказов',
    noOrdersDesc: 'Оформите свой первый заказ из меню без очередей!',
    viewStatusPass: 'Статус и QR-пропуск',
    viewReceipt: 'Чек / Фото',
    receiptModalTitle: 'Электронный чек (Фото)',
    downloadPhoto: 'Скачать чек как фото (PNG)',
    downloading: 'Создание изображения...',
    paidCard: 'Оплачено картой онлайн',
    transactionId: 'Код транзакции',
    copyReceipt: 'Скопировать чек',
    copied: 'Чек скопирован!',
    staffAccess: 'Вход для персонала',
    enterPin: 'Введите PIN-код персонала общепита',
    pinPlaceholder: '4-значный PIN (например: 2026)',
    unlockKitchen: 'Открыть экран кухни KDS',
    exitKitchen: 'Выйти в режим гостя',
    wrongPin: 'Неверный PIN-код (попробуйте 2026)',
    clientProfile: 'Аккаунт клиента',
    sharePhotoWhatsApp: 'Отправить фото в WhatsApp',
    photoCopiedToast: 'Фото чека скачано и скопировано в буфер! Вставьте (Ctrl+V) в чат WhatsApp.',
    kcal: 'ккал',
    totalCalories: 'Всего калорий',
    phoneLoginBtn: 'Войти по номеру телефона',
    phoneModalTitle: 'Привязка номера телефона',
    phoneModalDesc: 'Чтобы сохранять историю заказов и открывать их с любого устройства',
    smsCodeLabel: 'Код из SMS (демо: 2026)',
    verifyPhoneBtn: 'Подтвердить и войти',
    phoneLinkedToast: 'Номер успешно привязан к аккаунту!',
    linkedPhoneLabel: 'Привязанный телефон',
    recipientPhoneLabel: 'Номер в WhatsApp (кому отправить)',
    openWhatsAppChat: 'Открыть чат WhatsApp и отправить',
    pasteHint: 'Фото скопировано! Вставьте его в чат WhatsApp (Ctrl+V) и нажмите Enter',
    sendToMyself: 'Себе',
    photoPreviewTitle: 'Готовое фото чека для отправки',
    copyPhotoBtn: '1. Скопировать фото в буфер',
    photoCopiedSuccess: 'Фото скопировано! Теперь в чате нажмите Ctrl + V',
    dragPhotoHint: 'Можно просто перетащить фото мышкой в чат WhatsApp',
    whyNoAutoAttach: 'Почему WhatsApp не прикрепляет фото автоматически?',
    whyNoAutoAttachText: 'WhatsApp (Meta) в целях безопасности запрещает сайтам принудительно внедрять файлы в чаты через интернет-ссылки. Поэтому на компьютере фото передается через буфер обмена (Ctrl + V) или перетаскиванием мышкой, а на телефоне — напрямую через приложение.',
    openOnPhoneTab: 'С телефона (QR-код)',
    desktopTab: 'С компьютера (Web)',
    scanQrPhoneDesc: 'Наведите камеру смартфона на QR-код: на телефоне фото прикрепится напрямую в приложение WhatsApp в 1 клик',

    heroBadge: 'Обед без очередей',
    heroTitle: 'Закажи заранее. Приходи. Забирай.',
    heroDesc: 'Забудьте о 20 минутах ожидания в столовой. Выберите точное время — кухня приготовит еду ровно к вашему приходу. Выдача за 1.5 минуты.',
    badge3steps: '3 шага',
    badge3stepsDesc: 'Без регистрации',
    badgeWait: '< 2 минут',
    badgeWaitDesc: 'Время выдачи',
    badgeShelf: 'Полка выдачи',
    badgeShelfDesc: 'Прямо в руки',
    selectLocation: 'Выберите заведение',
    cafeteriaName: 'Университетская столовая',
    cafeteriaLoc: 'Главный кампус, Блок C · 1 этаж',
    activeNow: 'Принимает заказы',
    kitchenNormal: 'Кухня свободна',
    prepTimeAvg: '~12 мин готовка',
    orderBtn: 'Заказать',
    secondaryCafe: 'Кафе Бизнес-Центра',
    secondaryLoc: 'Башня B, Холл',
    opensAt13: 'Открытие в 13:00',
    noSmsTitle: 'Никаких паролей и SMS-кодов',
    noSmsDesc: 'Заказ оформляется в 3 касания. Цифровой QR-пропуск сохранится на этом телефоне.',

    categories: {
      all: 'Все',
      burgers: 'Бургеры и горячее',
      snacks: 'Закуски и гарниры',
      pizza: 'Пицца',
      drinks: 'Напитки'
    },
    backToVenues: 'К заведениям',
    expressPickupActive: 'FoodMaxxing активен',
    step1Selected: 'Шаг 1: Еда выбрана',
    step2ChooseTime: 'Шаг 2: Выбрать время',
    addToCart: 'В корзину',
    minAbbr: 'мин',
    priceKzt: '₸',

    step2Title: 'Шаг 2 из 3: Время получения',
    backToMenu: 'Назад в меню',
    orderSummary: 'Состав заказа',
    total: 'Итого',
    selectSlotHeader: 'Выберите слот выдачи (каждые 5 мин)',
    prepEst: 'Готовка',
    slotDesc: 'Слоты синхронизированы с мощностью оборудования кухни. Повара начнут готовить ровно к вашему приходу.',
    slotIdeal: 'Свободно',
    slotPeak: 'Пик',
    slotFull: 'Занято',
    step3Title: 'Шаг 3: Имя для наклейки на пакет',
    nameInputLabel: 'Ваше имя (будет напечатано на чеке выдачи)',
    nameInputPlaceholder: 'например, Алихан или Амина',
    phoneInputLabel: 'Номер телефона (необязательно, для чека)',
    zeroFrictionNote: 'Никаких паролей и SMS-кодов. Токен заказа хранится в браузере.',
    reservingSlot: 'Бронирование слота на кухне...',
    confirmOrderBtn: 'Подтвердить заказ',

    orderNumberLabel: 'Номер заказа',
    customerLabel: 'Клиент',
    statusScheduled: 'Запланирован',
    statusCooking: 'Готовится на кухне',
    statusReady: 'Готов на полке',
    statusPickedUp: 'Выдан клиенту',
    statusCancelled: 'Отменен',
    stepScheduled: '1. Запланирован',
    stepCooking: '2. На станциях',
    stepReady: '3. На полке выдачи',
    delayAlertTitle: 'Корректировка времени готовки (+5 мин)',
    delayAlertDesc: 'Кухня справляется с наплывом заказов на гриле. Обновленное время получения:',
    shelfLocationLabel: 'Зона получения заказа',
    shelfLocationDesc: 'Подойдите к стойке FoodMaxxing и покажите QR-пропуск.',
    openPasscardBtn: 'Открыть QR-пропуск для выдачи',
    orderDetailsTitle: 'Позиции заказа',
    cancelScheduledBtn: 'Отменить заказ (доступно до начала приготовления)',
    cancelBlockedNote: 'Блюда уже готовятся на кухне. Отмена недоступна.',
    confirmCancelPrompt: 'Вы уверены, что хотите отменить заказ?',

    passcardTitle: 'FOODMAXXING ПРОПУСК',
    readyHeader: 'Заказ готов к выдаче',
    goDirectlyTo: 'Подойдите к зоне',
    scanQrPrompt: 'Сканируйте QR или назовите код:',
    passcardFooter: 'Покажите этот экран сотруднику или терминалу выдачи. Время получения: до 30 секунд.',
    backToStatus: 'К статусу заказа',

    kdsTitle: 'FOODMAXXING КУХОННЫЙ ЭКРАН (KDS)',
    kdsSubtitle: 'Синхронизация заказов по станциям и полкам выдачи',
    liveBadge: '● Линия онлайн',
    scannerBtn: 'Сканер выдачи',
    stationsBtn: 'Мощность станций',
    workloadTitle: 'Реальная загрузка оборудования кухни (Занято / Вместимость)',
    workloadSubtitle: 'Определяет доступность временных слотов',
    colScheduled: '1. Запланировано к готовке',
    colCooking: '2. Готовится на станциях',
    colReady: '3. Готово на полке выдачи',
    autoFires: 'Авто-старт',
    activeSlots: 'Слоты заняты',
    awaitingScan: 'Ждет клиента',
    emptyScheduled: 'Нет заказов в очереди на готовку.',
    emptyCooking: 'Оборудование кухни свободно.',
    emptyReady: 'На полках выдачи сейчас пусто.',
    fireJitTime: 'Старт',
    targetPickupTime: 'Выдача',
    delayedBy: 'Задержка',
    startCookingBtn: 'Начать приготовление',
    markReadyBtn: 'Готово → Поставить на полку',
    delay5mBtn: '+5 мин Сообщить о задержке',
    completeHandoverBtn: 'Подтвердить выдачу',
    telemetryTitle: 'Журнал выданных заказов (Измеренное время ожидания)',
    measuredDwell: 'Ожидание у стойки:',

    scannerModalTitle: 'Сканер зоны выдачи FoodMaxxing',
    scannerModalSubtitle: 'Отсканируйте QR клиента или введите номер заказа',
    scanInputLabel: 'Номер заказа / QR',
    verifyBtn: 'Подтвердить выдачу',
    stagedOnShelves: 'Заказы на полках',
    clickToSimulate: 'Клик для быстрой симуляции',
    noReadyOrders: 'Сейчас на полках нет ожидающих заказов.',
    settingsModalTitle: 'Мощность оборудования кухни',
    settingsModalSubtitle: 'Количество одновременных слотов приготовления',
    applySettingsBtn: 'Сохранить параметры',

    simHeroBadge: 'Экспериментальное доказательство для жюри хакатона',
    simHeroTitle: 'Симуляция 100 заказов в обеденный пик',
    simHeroDesc: 'Наглядное доказательство сокращения ожидания с 20 до 2 минут и роста пропускной способности кухни на ≥25%. Моделирует живую давку против распределения по слотам FoodMaxxing.',
    runSimBtn: 'Запустить симуляцию 100 заказов',
    runningSimBtn: 'Запуск симуляции (100 заказов)...',
    metricThroughput: 'Рост пропускной способности',
    metricAvgWait: 'Среднее время ожидания',
    metricPeakQueue: 'Пиковая очередь в зале',
    metricAbandoned: 'Ушедшие без еды клиенты',
    scenATitle: 'Сценарий А',
    scenASubtitle: 'Обычная столовая (Живая очередь)',
    scenADesc1: 'Касса обслуживает 1 человека за 60-80 сек → к 12:30 скапливается 30+ человек.',
    scenADesc2: 'Повара готовят хаотично по мере пробития чеков, перегружая гриль.',
    scenADesc3: 'Студенты стоят 18–22 минуты в шуме; часть уходит без еды.',
    scenBTitle: 'Сценарий Б',
    scenBSubtitle: 'FoodMaxxing (Слоты и синхронизация)',
    scenBDesc1: 'Устранение кассы: 100% цифровой предзаказ снимает барьер ручного приема оплаты.',
    scenBDesc2: 'Сглаживание пика (Peak Shaving): нагрузка равномерно распределена по 5-минутным слотам.',
    scenBDesc3: 'Выдача за 1.5 мин: еда готова ровно к приходу клиента.',
    qaTitle: 'Шпаргалка для жюри: Почему это работает с точки зрения теории очередей',
    qa1Title: '1. Закон Литтла (L = λW)',
    qa1Text: 'Сокращая время пребывания клиента у стойки (W) с 18 до 1.8 мин, мы в 10 раз снижаем скопление людей в зале (L). Никакой давки.',
    qa2Title: '2. Расшивка кассового горлышка',
    qa2Text: 'Один кассир физически не может обслужить больше 40 человек в час. Предзаказ дает кухне непрерывный сбалансированный поток.',
    qa3Title: '3. Пакетная жарка котлет',
    qa3Text: 'Зная предзаказы на 12:45, повар жарит 4 котлеты на гриле одновременно, а не по одной штуке каждые 2 минуты.'
  },
  en: {
    brandTitle: 'FoodMaxxing',
    brandSubtitle: 'Maximum food. Minimum waiting',
    customerApp: 'Customer App',
    kitchenKds: 'Kitchen KDS',
    resetDemo: 'Reset Demo',
    advance5m: '+5 min',

    soundOn: 'Sound On',
    soundOff: 'Sound Muted',
    liveClock: 'Current Time',
    countdownPrefix: 'Estimated Ready In:',
    countdownReady: 'Your order is ready for pickup right now!',
    countdownMins: 'min',
    countdownSecs: 'sec',
    shareWhatsApp: 'Share ticket via WhatsApp',
    shareWhatsAppText: 'My FoodMaxxing order: #{orderNum}. Pickup time: {time}. Staging Shelf: {bay}. Location: Central Campus Cafeteria.',
    tagHalal: 'Halal',
    tagVeg: 'Veg',
    tagHit: 'Hit',
    filterAll: 'All Items',
    filterHalal: 'Halal',
    filterHit: 'Popular Hits',
    filterVeg: 'Vegetarian',

    myOrders: 'My Orders',
    activeOrders: 'Active Orders',
    completedOrders: 'Order History & Picked Up',
    noOrders: 'No orders placed yet',
    noOrdersDesc: 'Order delicious food ahead with zero waiting line!',
    viewStatusPass: 'View Status & QR Pass',
    viewReceipt: 'Receipt / Photo',
    receiptModalTitle: 'Digital Receipt (Photo)',
    downloadPhoto: 'Save Receipt as Photo (PNG)',
    downloading: 'Rendering photo...',
    paidCard: 'Paid Online by Card',
    transactionId: 'Transaction ID',
    copyReceipt: 'Copy Receipt',
    copied: 'Copied to clipboard!',
    staffAccess: 'Staff Access',
    enterPin: 'Enter Kitchen Staff PIN',
    pinPlaceholder: '4-digit PIN (e.g. 2026)',
    unlockKitchen: 'Unlock Kitchen KDS',
    exitKitchen: 'Exit to Customer Mode',
    wrongPin: 'Incorrect PIN (try 2026)',
    clientProfile: 'Client Account',
    sharePhotoWhatsApp: 'Send Photo to WhatsApp',
    photoCopiedToast: 'Receipt photo downloaded & copied! Paste (Ctrl+V) into WhatsApp.',
    kcal: 'kcal',
    totalCalories: 'Total Calories',
    phoneLoginBtn: 'Log in with Phone Number',
    phoneModalTitle: 'Link Phone Number',
    phoneModalDesc: 'To save order history and access it from any device',
    smsCodeLabel: 'SMS Code (demo: 2026)',
    verifyPhoneBtn: 'Verify & Log in',
    phoneLinkedToast: 'Phone successfully linked to account!',
    linkedPhoneLabel: 'Linked phone',
    recipientPhoneLabel: 'WhatsApp number (recipient)',
    openWhatsAppChat: 'Open WhatsApp & Send',
    pasteHint: 'Photo copied! Paste into WhatsApp chat (Ctrl+V) and hit Enter',
    sendToMyself: 'To myself',
    photoPreviewTitle: 'Generated Receipt Photo',
    copyPhotoBtn: '1. Copy photo to clipboard',
    photoCopiedSuccess: 'Photo copied! Now press Ctrl + V in chat',
    dragPhotoHint: 'You can also drag & drop this image into WhatsApp',
    whyNoAutoAttach: 'Why does WhatsApp not attach photos automatically via link?',
    whyNoAutoAttachText: 'For security, WhatsApp restricts web links to plain text and forbids websites from injecting files into chats automatically. On desktop, paste the copied image using Ctrl + V or drag and drop it. On mobile, it shares directly.',
    openOnPhoneTab: 'From phone (QR)',
    desktopTab: 'From desktop (Web)',
    scanQrPhoneDesc: 'Scan this QR code with your phone camera to share the photo directly via the WhatsApp mobile app',

    heroBadge: 'Lunch Without Waiting',
    heroTitle: 'Order ahead. Arrive. Grab & Go.',
    heroDesc: 'Skip the 20-minute cafeteria line. Select an exact time — kitchen prepares just-in-time for your arrival. Pickup in 1.5 minutes.',
    badge3steps: '3 Steps',
    badge3stepsDesc: 'Zero Signup',
    badgeWait: '< 2 min',
    badgeWaitDesc: 'Pickup Dwell',
    badgeShelf: 'Shelf Bay',
    badgeShelfDesc: 'Direct Staging',
    selectLocation: 'Select Location',
    cafeteriaName: 'University Central Cafeteria',
    cafeteriaLoc: 'Main Campus, Block C · 1st Floor',
    activeNow: 'Active Now',
    kitchenNormal: 'Normal Kitchen Flow',
    prepTimeAvg: '~12 min prep',
    orderBtn: 'Order',
    secondaryCafe: 'Business Center Food Hall',
    secondaryLoc: 'Tower B, Ground Level',
    opensAt13: 'Opens 13:00',
    noSmsTitle: 'Zero Registration Friction',
    noSmsDesc: 'Order in 3 taps: pick food, pick time, enter name. Digital QR passcard is saved on this device.',

    categories: {
      all: 'All',
      burgers: 'Burgers & Mains',
      snacks: 'Sides & Snacks',
      pizza: 'Pizza',
      drinks: 'Drinks'
    },
    backToVenues: 'Locations',
    expressPickupActive: 'FoodMaxxing Active',
    step1Selected: 'Step 1: Food Selected',
    step2ChooseTime: 'Step 2: Choose Pickup Time',
    addToCart: 'Add',
    minAbbr: 'min',
    priceKzt: '₸',

    step2Title: 'Step 2 of 3: Pickup Time',
    backToMenu: 'Back to Menu',
    orderSummary: 'Order Summary',
    total: 'Total',
    selectSlotHeader: 'Select Pickup Slot (every 5 min)',
    prepEst: 'Prep',
    slotDesc: 'Slots are calibrated to kitchen station capacity. Food starts just-in-time so it is fresh right when you walk in.',
    slotIdeal: 'Ideal',
    slotPeak: 'Peak',
    slotFull: 'Full',
    step3Title: 'Step 3: Quick Pickup Identity',
    nameInputLabel: 'Display Name (for pickup slip & shelf tag)',
    nameInputPlaceholder: 'e.g. Alex or Sarah',
    phoneInputLabel: 'Phone Number (optional for SMS receipt)',
    zeroFrictionNote: 'Zero passwords, zero SMS code verification required.',
    reservingSlot: 'Reserving Kitchen Slot...',
    confirmOrderBtn: 'Confirm Order',

    orderNumberLabel: 'Order Token',
    customerLabel: 'Customer',
    statusScheduled: 'Scheduled',
    statusCooking: 'Cooking On Stations',
    statusReady: 'Ready on Shelf',
    statusPickedUp: 'Picked Up',
    statusCancelled: 'Cancelled',
    stepScheduled: '1. Scheduled',
    stepCooking: '2. Cooking',
    stepReady: '3. Ready on Shelf',
    delayAlertTitle: 'Schedule Adjustment (+5 min)',
    delayAlertDesc: 'Kitchen is managing heavy station rush. Your updated target pickup is:',
    shelfLocationLabel: 'Physical Pickup Location',
    shelfLocationDesc: 'Proceed directly to FoodMaxxing Shelf. Show QR passcard to collect.',
    openPasscardBtn: 'Open FoodMaxxing Passcard',
    orderDetailsTitle: 'Item Details',
    cancelScheduledBtn: 'Cancel Order (Before cooking starts)',
    cancelBlockedNote: 'Preparation has started on kitchen stations. Order cannot be cancelled.',
    confirmCancelPrompt: 'Are you sure you want to cancel this scheduled order?',

    passcardTitle: 'FOODMAXXING PASSCARD',
    readyHeader: 'Ready For FoodMaxxing Pickup',
    goDirectlyTo: 'Go Directly To',
    scanQrPrompt: 'Scan QR or enter PIN:',
    passcardFooter: 'Show this passcard to staff or shelf scanner to collect in under 30 seconds.',
    backToStatus: 'Back to Status',

    kdsTitle: 'FOODMAXXING KITCHEN KDS',
    kdsSubtitle: 'Synchronized JIT Food Preparation & Shelf Staging',
    liveBadge: '● Live Line Active',
    scannerBtn: 'Open Pickup Scanner',
    stationsBtn: 'Stations',
    workloadTitle: 'Real-Time Kitchen Station Workload (Occupied / Capacity)',
    workloadSubtitle: 'Determines dynamic pickup time slot availability',
    colScheduled: '1. Scheduled for JIT Fire',
    colCooking: '2. Cooking On Stations',
    colReady: '3. Ready on Shelf Rack',
    autoFires: 'Auto-Fires',
    activeSlots: 'Active Slots',
    awaitingScan: 'Awaiting Scan',
    emptyScheduled: 'No orders waiting for fire schedule.',
    emptyCooking: 'Stations currently idle.',
    emptyReady: 'No orders currently waiting on shelves.',
    fireJitTime: 'Fire JIT',
    targetPickupTime: 'Target Pickup',
    delayedBy: 'Delayed',
    startCookingBtn: 'Start Preparation Now',
    markReadyBtn: 'Mark Ready → Move to Shelf',
    delay5mBtn: '+5 min Kitchen Delay Alert',
    completeHandoverBtn: 'Complete Handover',
    telemetryTitle: 'Recently Handed Over Orders (Wait Time Telemetry)',
    measuredDwell: 'Counter dwell wait time:',

    scannerModalTitle: 'FoodMaxxing Pickup Scanner',
    scannerModalSubtitle: 'Scan customer QR or enter 4-digit order number',
    scanInputLabel: 'Order # / QR',
    verifyBtn: 'Verify Handover',
    stagedOnShelves: 'Currently Staged on Shelves',
    clickToSimulate: 'Click to simulate 1-tap scan',
    noReadyOrders: 'No orders currently waiting on shelves.',
    settingsModalTitle: 'Station Capacity Settings',
    settingsModalSubtitle: 'Adjust active parallel cook slots per station',
    applySettingsBtn: 'Apply Changes',

    simHeroBadge: 'Hackathon Empirical Proof Lab',
    simHeroTitle: '100-Customer Peak Lunch Rush Simulation',
    simHeroDesc: 'Direct mathematical proof of 20-to-2 min wait reduction and ≥25% throughput gain. Compares random walk-in peak against FoodMaxxing capacity-synchronized slots.',
    runSimBtn: 'Run 100-Customer Peak Simulation',
    runningSimBtn: 'Running Monte Carlo Batch (100 Orders)...',
    metricThroughput: 'Throughput Delta',
    metricAvgWait: 'Average Wait Time',
    metricPeakQueue: 'Peak Physical Queue',
    metricAbandoned: 'Abandoned Orders',
    scenATitle: 'Scenario A',
    scenASubtitle: 'Traditional Random Walk-In',
    scenADesc1: 'Single cashier takes 60-80s per customer → 30+ person queue forms by 12:30.',
    scenADesc2: 'Kitchen receives orders in chaotic bursts, choking grill flat-top.',
    scenADesc3: 'Students wait 18–22 minutes; many abandon out of frustration.',
    scenBTitle: 'Scenario B',
    scenBSubtitle: 'FoodMaxxing Synchronized',
    scenBDesc1: 'Cashier line eliminated: 100% digital ordering frees entry capacity.',
    scenBDesc2: 'Peak Shaving: demand is smoothed across 5-minute slots.',
    scenBDesc3: 'Just-in-Time preparation: food finishes 2 min before arrival → dwell is 1.5 min.',
    qaTitle: 'Judges Q&A: How to Defend This Without Fabricating Numbers',
    qa1Title: "1. Little's Law (L = λW)",
    qa1Text: 'By reducing customer waiting time (W) from 18 min to 1.8 min, crowd size (L) drops 10x, eliminating physical gridlock.',
    qa2Title: '2. Eliminating POS Chokepoints',
    qa2Text: 'A cashier can process at most 40 customers/hour. Pre-ordering allows kitchen to cook at maximum equipment capacity continuously.',
    qa3Title: '3. Station Batching Efficiency',
    qa3Text: 'Knowing orders for 12:45, the grill cook prepares 4 burger patties simultaneously rather than serially.'
  }
};
