/* =====================================================
   HAT CANDY — CUSTOMER STORE
   Part 0: Constants, State, I18N
   يُحمَّل أولاً — قبل parts 1, 2, 3
   ===================================================== */

(function () {
  'use strict';

  /* ============ ربط بالإعدادات المركزية ============ */
  if (!window.HAT_CONFIG) {
    console.error('[Part 0] config.js غير محمّل! تحقق من ترتيب السكربتات.');
    return;
  }

  const CFG = window.HAT_CONFIG;

  /* ============ Storage Keys ============ */
  window.LS_KEYS = CFG.storageKeys;

  /* ============ Security ============ */
  window.ADMIN_EMAIL     = CFG.security.adminEmail;
  window.ADMIN_PASSWORD  = CFG.security.adminPassword;
  window.OVERVIEW_SECRET = CFG.security.overviewSecret;
  window.EMPLOYEE_USER   = CFG.security.employeeUser;
  window.EMPLOYEE_PASS   = CFG.security.employeePass;

  /* Owner phone — considered highly sensitive, kept here as hardcoded fallback */
  window.OWNER_PHONE_DIGITS = ['0782342105', '962782342105', '782342105'];

  /* ============ Status Flow ============ */
  window.STATUS_FLOW = CFG.pos.statusFlow || [
    'processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'
  ];

  /* ============ Currency (دينار أردني) ============ */
  window.CURRENCY_SYMBOL    = CFG.site.currencySymbol;   // 'د.أ'
  window.CURRENCY_SYMBOL_EN = CFG.site.currencySymbolEn; // 'JOD'
  window.CURRENCY_CODE      = CFG.site.currency;         // 'JOD'

  /* ============ Language (عربي افتراضياً) ============ */
  window.lang = (function () {
    try {
      return localStorage.getItem(LS_KEYS.lang) || CFG.site.defaultLang || 'ar';
    } catch (e) {
      return CFG.site.defaultLang || 'ar';
    }
  })();

  /* ============ I18N Dictionary ============ */
  window.I18N = {
    /* ============ ENGLISH ============ */
    en: {
      'title.page': 'Hat Candy | Every Candy Begins with Magic',

      /* Nav */
      'nav.home': 'Home', 'nav.offers': 'Offers', 'nav.candies': 'Candies',
      'nav.chocolate': 'Chocolate', 'nav.about': 'About',
      'nav.gallery': 'Gallery', 'nav.contact': 'Contact',

      /* Hero */
      'hero.badge': 'Luxury Candy Brand',
      'hero.text': 'Every Candy Begins with Magic.',
      'hero.seeOffers': 'See Offers',
      'hero.buildMix': 'Build Your Mix',

      /* Offers */
      'offers.title': 'Limited-Time Offers',
      'offers.subtitle': 'Sweet deals!',
      'offers.empty': 'No active offers right now',
      'offers.save': 'Save',
      'offers.grab': 'Grab it',

      /* Banner */
      'banner.title': 'Mix It <span>Your Way</span> ✨',
      'banner.text': 'Choose your weight, pick your packaging.',
      'banner.cta': 'Start Building',

      /* Candies */
      'candies.title': 'Signature Collection',
      'candies.subtitle': 'Indulge in our curated selection',
      'candies.add': 'Add',
      'candies.added': 'Added',

      /* Categories */
      'cat.all': 'All', 'cat.candy': 'Candies', 'cat.chocolate': 'Chocolate',

      /* About */
      'about.title': 'Our Magical Story',
      'about.p1': 'Hat Candy is a luxury candy brand.',
      'about.p2': 'Every Candy Begins with Magic.',
      'about.f1': 'Premium Ingredients', 'about.f2': 'Elegant Presentation',
      'about.f3': 'Luxury Gift Boxes',   'about.f4': 'Made with Love',

      /* Gallery */
      'gallery.title': 'Magic in Every Detail',
      'gallery.subtitle': 'A glimpse into our world',

      /* Contact */
      'contact.title': 'Get in Touch',
      'contact.subtitle': 'Order your magical treats',
      'contact.infoTitle': 'Contact Information',
      'contact.infoText': "We'd love to hear from you!",
      'contact.addressLabel': 'Boutique Address',
      'contact.address': 'Amman, Jordan',
      'contact.phoneLabel': 'Phone',
      'contact.emailLabel': 'Email',
      'contact.hoursLabel': 'Hours',
      'contact.formName': 'Full Name', 'contact.formEmail': 'Email',
      'contact.formMessage': 'Message', 'contact.send': 'Send Message',
      'contact.sending': 'Sending...',

      /* Cart */
      'cart.title': 'My Cart', 'cart.item': 'item', 'cart.items': 'items',
      'cart.empty': 'Your cart is empty',
      'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout',
      'cart.customMix': 'Custom Mix',

      /* Delivery */
      'delivery.delivery': 'Delivery', 'delivery.pickup': 'Pickup',
      'delivery.pickupTitle': 'Pickup from Boutique',
      'delivery.pickupAddress': 'Amman — Magic Avenue',
      'delivery.pickupHours': 'Daily 8 AM – 5 PM',
      'delivery.zone': 'Delivery Zone',
      'delivery.selectZone': 'Select your area',
      'delivery.fee': 'Delivery Fee', 'delivery.feeLabel': 'Delivery Fee',
      'delivery.subtotal': 'Subtotal',
      'delivery.noZones': 'No delivery zones configured',

      /* Payment */
      'pay.title': 'Payment Method', 'pay.cash': 'Cash', 'pay.card': 'Card',
      'pay.cashTitle': 'Cash on Delivery',
      'pay.cashText': 'Pay in cash when your order arrives.',
      'pay.cardNumber': 'Card Number', 'pay.cardName': 'Name on Card',
      'pay.cardExpiry': 'Expiry', 'pay.cardCvv': 'CVV',
      'pay.cardSecure': 'Your payment is secure',
      'pay.invalidCard': 'Invalid card number',
      'pay.invalidName': 'Invalid cardholder name',
      'pay.invalidExpiry': 'Invalid expiry date',
      'pay.invalidCvv': 'Invalid CVV',

      /* Login */
      'login.welcome': 'Welcome Back',
      'login.subtitle': 'Sign in to your Hat Candy account',
      'login.almost': 'Almost there!',
      'login.almostSub': 'Sign in to complete your order',
      'login.callout': 'We need a few details to <strong>complete your checkout</strong> and deliver your magical treats.',
      'login.google': 'Continue with Google',
      'login.divider': 'Or continue with email',
      'login.email': 'Email Address <span class="req">*</span>',
      'login.password': 'Password <span class="req">*</span>',
      'login.phone': 'Phone Number <span class="req">*</span>',
      'login.remember': 'Remember me', 'login.forgot': 'Forgot password?',
      'login.signin': 'Sign In', 'login.signingIn': 'Signing in…',
      'login.noAccount': 'Not a member?', 'login.createAccount': 'Create an account',
      'login.change': 'Change', 'login.continue': 'Continue',
      'login.successTitle': "You're Signed In!",
      'login.successSub': 'Ready to complete your order ✨',
      'login.successWelcome': 'Welcome, {name}! ✨',

      /* Sign */
      'sign.open': 'OPEN', 'sign.closed': 'CLOSED',
      'sign.openNote': 'Order online 24/7 ✨',
      'sign.closedNote': 'Order online 24/7 ✨',

      /* Footer */
      'footer.copy': '© 2025 Hat Candy. Every Candy Begins with Magic.',

      /* Weight modal */
      'weight.choose': 'Choose your weight', 'weight.unit': 'g',
      'weight.quantity': 'Quantity', 'weight.addToCart': 'Add to Cart',
      'weight.tierNote250': 'Auto-price for 250g tier: {price}',
      'weight.tierNote500': 'Auto-price for 500g tier: {price}',
      'weight.tierNote1000': 'Auto-price for 1kg tier: {price}',

      /* Mix builder */
      'mix.title': 'Build Your Own Mix',
      'mix.subtitle': 'Every Candy Begins with Magic',
      'mix.step1': 'Packaging', 'mix.step2': 'Weight',
      'mix.step3': 'Candy Types', 'mix.step4': 'Add-ons', 'mix.step5': 'Payment',
      'mix.packTitle': 'Choose Packaging',
      'mix.packSub': 'How would you like your candy mix packaged?',
      'mix.weightTitle': 'Choose Your Weight',
      'mix.weightSub': 'From 100 g up to 1 kg — pick the perfect size.',
      'mix.typesTitle': 'Choose Your Candy Types',
      'mix.typesSub': 'How many different candy types?',
      'mix.typesLabel': 'Types',
      'mix.pickTypes': 'Now pick your candy types',
      'mix.addonsTitle': 'Choose Your Add-ons',
      'mix.addonsSub': 'Optional extras to make your mix extra magical ✨',
      'mix.payTitle': 'Review & Pay',
      'mix.paySub': 'One last look before we complete your order.',
      'mix.back': 'Back', 'mix.next': 'Next',
      'mix.completeOrder': 'Complete Order',
      'mix.yourMix': 'Your Magical Mix',
      'mix.readyToAdd': 'Ready to add to your cart',
      'mix.packaging': 'Packaging', 'mix.weight': 'Weight',
      'mix.candyTypes': 'Candy Types', 'mix.addons': 'Add-ons',
      'mix.candySelection': 'Candy Selection',
      'mix.addonsSelection': 'Add-ons Selection',
      'mix.candy': 'Candy', 'mix.total': 'Total',
      'mix.type': 'Type', 'mix.tapToChoose': 'Tap to choose',
      'mix.gramsLabel': '{w} grams', 'mix.halfKilo': 'Half Kilo',
      'mix.fullKilo': 'Full Kilo', 'mix.kilogram': 'Kilogram',
      'mix.min': 'Min', 'mix.unitG': 'g', 'mix.free': 'Free',
      'mix.noAddons': 'No add-ons available',
      'mix.customMix': 'Custom Mix',

      /* Toasts */
      'toast.added': '{name} added to cart',
      'toast.removed': 'Item removed',
      'toast.fillFields': 'Please fill in all fields',
      'toast.validEmail': 'Please enter a valid email',
      'toast.validPhone': 'Please enter a valid Jordanian phone',
      'toast.enterPhone': 'Please enter your phone number',
      'toast.cartEmpty': 'Your cart is empty',
      'toast.welcome': 'Welcome, {name}!',
      'toast.signedInCheckout': 'Signed in — let’s finish your order!',
      'toast.signedOut': 'Signed out',
      'toast.adminWelcome': 'Welcome, Admin!',
      'toast.ownerWelcome': 'Developer access granted ✨',
      'toast.resetSent': 'Reset link sent (demo)',
      'toast.thanks': 'Thanks, {name}!',
      'toast.reordered': 'Items added back to cart',
      'toast.orderPlaced': 'Order placed! Total {total}',
      'toast.allSlots': 'All slots filled — remove one first',
      'toast.needOneAddress': 'You need at least one address',
      'toast.addressAdded': 'Address added',
      'toast.addressUpdated': 'Address updated',
      'toast.addressDeleted': 'Address removed',
      'toast.addressDefaultSet': 'Default address updated',
      'toast.hoursSaved': 'Store hours saved',
      'toast.contentSaved': 'Content saved',
      'toast.productSaved': 'Product saved',
      'toast.productDeleted': 'Product deleted',
      'toast.offerSaved': 'Offer saved',
      'toast.offerDeleted': 'Offer deleted',
      'toast.galleryAdded': 'Gallery image added',
      'toast.galleryRemoved': 'Gallery image removed',
      'toast.addonSaved': 'Add-on saved',
      'toast.addonDeleted': 'Add-on deleted',
      'toast.dataExported': 'Backup exported',
      'toast.dataImported': 'Backup imported',
      'toast.dataInvalid': 'Invalid backup file',
      'toast.employeeAdded': 'Employee added',
      'toast.employeeUpdated': 'Employee updated',
      'toast.employeeDeleted': 'Employee deleted',
      'toast.employeeFields': 'Name, username and password are required',
      'toast.employeeExists': 'Username already exists',
      'toast.confirmDelete': 'Tap again to confirm delete',
      'toast.synced': 'Data synced from cloud',
      'toast.syncFailed': 'Cloud sync failed — working offline',

      /* Account */
      'account.back': 'Back to Store', 'account.signout': 'Sign Out',
      'account.memberSince': 'Member since 2025',
      'account.tabOrders': 'Orders', 'account.tabTracking': 'Tracking',
      'account.tabAddresses': 'Addresses',
      'account.noOrders': 'No orders yet',
      'account.noOrdersSub': 'Your magical treats will appear here.',
      'account.shopNow': 'Shop Now',
      'account.noTracking': 'No active tracking',
      'account.noTrackingSub': 'Track your shipments once they ship.',
      'account.orderId': 'Order', 'account.orderTotal': 'Total',
      'account.trackOrder': 'Track', 'account.reorder': 'Reorder',
      'account.status_processing': 'Processing',
      'account.status_packing': 'Packing',
      'account.status_shipped': 'Shipped',
      'account.status_out_for_delivery': 'Out for Delivery',
      'account.status_delivered': 'Delivered',
      'account.status_cancelled': 'Cancelled',
      'account.stepPlaced': 'Placed', 'account.stepProcessing': 'Processing',
      'account.stepPacking': 'Packing', 'account.stepShipped': 'Shipped',
      'account.stepOut': 'Out', 'account.stepDelivered': 'Delivered',
      'account.trackingFor': 'Tracking for', 'account.eta': 'ETA',
      'account.deliveringTo': 'Delivering to',
      'account.statTotal': 'Total Orders', 'account.statActive': 'Active',
      'account.statDelivered': 'Delivered', 'account.statSpent': 'Total Spent',
      'account.savedAddresses': 'addresses', 'account.default': 'Default',
      'account.edit': 'Edit', 'account.delete': 'Delete',
      'account.setDefault': 'Set Default', 'account.addNew': 'Add New Address',
      'account.addAddressTitle': 'Add New Address',
      'account.editAddressTitle': 'Edit Address',
      'account.addAddressSub': 'Where should we deliver your magical treats?',
      'account.fieldLabel': 'Label', 'account.fieldName': 'Full Name',
      'account.fieldPhone': 'Phone', 'account.fieldCity': 'City',
      'account.fieldArea': 'Area',
      'account.fieldLine': 'Street, Building, Floor, Apt',
      'account.labelHome': 'Home', 'account.labelWork': 'Work',
      'account.labelOther': 'Other',
      'account.cancel': 'Cancel', 'account.save': 'Save Address',
      'account.cartNotice': 'You have {n} item(s) waiting in your cart.',
      'account.goToCart': 'Go to Cart',

      /* Admin */
      'admin.back': 'Back to Store', 'admin.badge': 'Admin',
      'admin.heroName': 'Store Administration',
      'admin.heroSub': 'Full control over orders, customers & revenue',
      'admin.tabOverview': 'Overview', 'admin.tabOrders': 'Orders',
      'admin.tabCustomers': 'Customers', 'admin.tabProducts': 'Products',
      'admin.tabMessages': 'Messages',
      'admin.kpiRevenue': 'Revenue', 'admin.kpiOrders': 'Orders',
      'admin.kpiCustomers': 'Customers', 'admin.kpiAov': 'Avg Order Value',
      'admin.kpiPending': 'Pending', 'admin.kpiDelivered': 'Delivered',
      'admin.kpiPosOrders': 'POS Orders', 'admin.kpiPosRevenue': 'POS Revenue',
      'admin.kpiTotalEmployees': 'Total Employees',
      'admin.kpiActiveNow': 'Active Now',
      'admin.kpiTotalSales': 'Total Sales',
      'admin.kpiTotalRevenue': 'Total Revenue',
      'admin.revenueChart': 'Revenue Trend',
      'admin.topProducts': 'Top Selling Products',
      'admin.recentOrders': 'Recent Orders', 'admin.viewAll': 'View all',
      'admin.noData': 'No data',
      'admin.thOrder': 'Order', 'admin.thCustomer': 'Customer',
      'admin.thItems': 'Items', 'admin.thTotal': 'Total',
      'admin.thStatus': 'Status', 'admin.thActions': 'Actions',
      'admin.thPhone': 'Phone', 'admin.thCity': 'City',
      'admin.thOrders': 'Orders', 'admin.thSpent': 'Total Spent',
      'admin.thTier': 'Tier', 'admin.thJoined': 'Joined',
      'admin.thProduct': 'Product', 'admin.thPrice': 'Price',
      'admin.thSold': 'Sold', 'admin.thRevenue': 'Revenue',
      'admin.thStock': 'Stock',
      'admin.all': 'All', 'admin.advance': 'Advance',
      'admin.payCod': 'Cash on Delivery', 'admin.payCard': 'Card',
      'admin.noEmployees': 'No employees yet',
      'admin.addEmployee': 'Add Employee', 'admin.editEmployee': 'Edit Employee',
      'admin.deleteEmployeeConfirm': 'Delete this employee?',
      'admin.online': 'Online', 'admin.offline': 'Offline', 'admin.now': 'now',
      'admin.noMessages': 'No messages',
      'admin.noMessagesSub': 'Customer messages will appear here.',
      'admin.markRead': 'Mark read', 'admin.markUnread': 'Mark unread',
      'admin.export': 'Export CSV', 'admin.exported': 'Orders exported',
      'admin.searchCustomers': 'Search customers…',
      'admin.statusUpdated': 'Order {id} → {status}',
      'admin.tierVip': 'VIP', 'admin.tierActive': 'Active', 'admin.tierNew': 'New',
      'admin.stockIn': 'In Stock', 'admin.stockLow': 'Low',
      'admin.stockOut': 'Out', 'admin.units': 'units',
      'admin.msgDeleted': 'Message deleted',
      'admin.attendanceLog': 'Attendance Log'
    },

    /* ============ ARABIC ============ */
    ar: {
      'title.page': 'هات كاندي | كل قطعة حلوى تبدأ بالسحر',

      /* Nav */
      'nav.home': 'الرئيسية', 'nav.offers': 'العروض',
      'nav.candies': 'الحلويات', 'nav.chocolate': 'الشوكولاتة',
      'nav.about': 'من نحن', 'nav.gallery': 'المعرض', 'nav.contact': 'اتصل بنا',

      /* Hero */
      'hero.badge': 'علامة حلوى فاخرة',
      'hero.text': 'كل قطعة حلوى تبدأ بالسحر.',
      'hero.seeOffers': 'شاهد العروض',
      'hero.buildMix': 'اصنع خلطتك',

      /* Offers */
      'offers.title': 'عروض لفترة محدودة',
      'offers.subtitle': 'عروض حلوة!',
      'offers.empty': 'لا توجد عروض نشطة حالياً',
      'offers.save': 'وفّر',
      'offers.grab': 'احصل عليه',

      /* Banner */
      'banner.title': 'اخلطها <span>على طريقتك</span> ✨',
      'banner.text': 'اختر وزنك، واختر تغليفك.',
      'banner.cta': 'ابدأ الآن',

      /* Candies */
      'candies.title': 'مجموعتنا المميزة',
      'candies.subtitle': 'اكتشف تشكيلتنا المنتقاة',
      'candies.add': 'أضف',
      'candies.added': 'تمت الإضافة',

      /* Categories */
      'cat.all': 'الكل', 'cat.candy': 'حلويات', 'cat.chocolate': 'شوكولاتة',

      /* About */
      'about.title': 'قصتنا السحرية',
      'about.p1': 'هات كاندي علامة حلوى فاخرة.',
      'about.p2': 'كل قطعة حلوى تبدأ بالسحر.',
      'about.f1': 'مكونات فاخرة', 'about.f2': 'تقديم أنيق',
      'about.f3': 'علب هدايا فاخرة', 'about.f4': 'صنعت بحب',

      /* Gallery */
      'gallery.title': 'السحر في كل تفصيلة',
      'gallery.subtitle': 'لمحة من عالمنا',

      /* Contact */
      'contact.title': 'تواصل معنا',
      'contact.subtitle': 'اطلب حلواك السحرية',
      'contact.infoTitle': 'معلومات الاتصال',
      'contact.infoText': 'يسعدنا سماع صوتك!',
      'contact.addressLabel': 'عنوان المتجر',
      'contact.address': 'عمّان، الأردن',
      'contact.phoneLabel': 'الهاتف',
      'contact.emailLabel': 'البريد الإلكتروني',
      'contact.hoursLabel': 'أوقات العمل',
      'contact.formName': 'الاسم الكامل',
      'contact.formEmail': 'البريد الإلكتروني',
      'contact.formMessage': 'رسالتك',
      'contact.send': 'إرسال الرسالة',
      'contact.sending': 'جارٍ الإرسال...',

      /* Cart */
      'cart.title': 'سلّتي',
      'cart.item': 'منتج', 'cart.items': 'منتجات',
      'cart.empty': 'سلّتك فارغة',
      'cart.total': 'الإجمالي',
      'cart.checkout': 'إتمام الشراء',
      'cart.customMix': 'خلطة خاصة',

      /* Delivery */
      'delivery.delivery': 'توصيل', 'delivery.pickup': 'استلام',
      'delivery.pickupTitle': 'استلام من المتجر',
      'delivery.pickupAddress': 'عمّان — شارع السحر',
      'delivery.pickupHours': 'يومياً ٨ صباحاً – ٥ مساءً',
      'delivery.zone': 'منطقة التوصيل',
      'delivery.selectZone': 'اختر منطقتك',
      'delivery.fee': 'رسوم التوصيل',
      'delivery.feeLabel': 'رسوم التوصيل',
      'delivery.subtotal': 'المجموع الفرعي',
      'delivery.noZones': 'لا توجد مناطق توصيل مهيأة',

      /* Payment */
      'pay.title': 'طريقة الدفع',
      'pay.cash': 'نقداً', 'pay.card': 'بطاقة',
      'pay.cashTitle': 'الدفع نقداً عند التسليم',
      'pay.cashText': 'ادفع نقداً عند وصول طلبك.',
      'pay.cardNumber': 'رقم البطاقة',
      'pay.cardName': 'الاسم على البطاقة',
      'pay.cardExpiry': 'تاريخ الانتهاء',
      'pay.cardCvv': 'الرمز السري',
      'pay.cardSecure': 'دفعتك آمنة',
      'pay.invalidCard': 'رقم بطاقة غير صالح',
      'pay.invalidName': 'اسم حامل البطاقة غير صالح',
      'pay.invalidExpiry': 'تاريخ انتهاء غير صالح',
      'pay.invalidCvv': 'رمز CVV غير صالح',

      /* Login */
      'login.welcome': 'أهلاً بعودتك',
      'login.subtitle': 'سجّل الدخول إلى حسابك في هات كاندي',
      'login.almost': 'خطوة أخيرة!',
      'login.almostSub': 'سجّل الدخول لإكمال طلبك',
      'login.callout': 'نحتاج بعض التفاصيل <strong>لإكمال طلبك</strong> وتوصيل حلواك السحرية.',
      'login.google': 'المتابعة عبر جوجل',
      'login.divider': 'أو تابع بالبريد الإلكتروني',
      'login.email': 'البريد الإلكتروني <span class="req">*</span>',
      'login.password': 'كلمة المرور <span class="req">*</span>',
      'login.phone': 'رقم الهاتف <span class="req">*</span>',
      'login.remember': 'تذكرني',
      'login.forgot': 'نسيت كلمة المرور؟',
      'login.signin': 'تسجيل الدخول',
      'login.signingIn': 'جارٍ تسجيل الدخول…',
      'login.noAccount': 'لست عضواً؟',
      'login.createAccount': 'أنشئ حساباً',
      'login.change': 'تغيير',
      'login.continue': 'متابعة',
      'login.successTitle': 'تم تسجيل دخولك!',
      'login.successSub': 'جاهز لإكمال طلبك ✨',
      'login.successWelcome': 'أهلاً، {name}! ✨',

      /* Sign */
      'sign.open': 'مفتوح', 'sign.closed': 'مغلق',
      'sign.openNote': 'اطلب أونلاين 24/7 ✨',
      'sign.closedNote': 'اطلب أونلاين 24/7 ✨',

      /* Footer */
      'footer.copy': '© 2025 هات كاندي. كل قطعة حلوى تبدأ بالسحر.',

      /* Weight modal */
      'weight.choose': 'اختر الوزن',
      'weight.unit': 'غ',
      'weight.quantity': 'الكمية',
      'weight.addToCart': 'أضف إلى السلة',
      'weight.tierNote250': 'السعر التلقائي لفئة 250غ: {price}',
      'weight.tierNote500': 'السعر التلقائي لفئة 500غ: {price}',
      'weight.tierNote1000': 'السعر التلقائي لفئة 1كغ: {price}',

      /* Mix builder */
      'mix.title': 'اصنع خلطتك الخاصة',
      'mix.subtitle': 'كل قطعة حلوى تبدأ بالسحر',
      'mix.step1': 'التغليف', 'mix.step2': 'الوزن',
      'mix.step3': 'أنواع الحلوى', 'mix.step4': 'الإضافات', 'mix.step5': 'الدفع',
      'mix.packTitle': 'اختر التغليف',
      'mix.packSub': 'كيف تفضّل تغليف خلطة الحلوى؟',
      'mix.weightTitle': 'اختر وزنك',
      'mix.weightSub': 'من ١٠٠ غ حتى ١ كغ — اختر الحجم المناسب.',
      'mix.typesTitle': 'اختر أنواع الحلوى',
      'mix.typesSub': 'كم نوعاً مختلفاً؟',
      'mix.typesLabel': 'أنواع',
      'mix.pickTypes': 'الآن اختر أنواع الحلوى',
      'mix.addonsTitle': 'اختر الإضافات',
      'mix.addonsSub': 'إضافات اختيارية تجعل خلطتك أكثر سحراً ✨',
      'mix.payTitle': 'راجع وادفع',
      'mix.paySub': 'نظرة أخيرة قبل إتمام طلبك.',
      'mix.back': 'السابق', 'mix.next': 'التالي',
      'mix.completeOrder': 'إتمام الطلب',
      'mix.yourMix': 'خلطتك السحرية',
      'mix.readyToAdd': 'جاهزة للإضافة إلى سلّتك',
      'mix.packaging': 'التغليف', 'mix.weight': 'الوزن',
      'mix.candyTypes': 'أنواع الحلوى', 'mix.addons': 'الإضافات',
      'mix.candySelection': 'اختيار الحلوى',
      'mix.addonsSelection': 'اختيار الإضافات',
      'mix.candy': 'الحلوى', 'mix.total': 'الإجمالي',
      'mix.type': 'النوع', 'mix.tapToChoose': 'اضغط للاختيار',
      'mix.gramsLabel': '{w} غرام', 'mix.halfKilo': 'نصف كيلو',
      'mix.fullKilo': 'كيلو كامل', 'mix.kilogram': 'كيلوغرام',
      'mix.min': 'الحد الأدنى', 'mix.unitG': 'غ', 'mix.free': 'مجاناً',
      'mix.noAddons': 'لا توجد إضافات متاحة',
      'mix.customMix': 'خلطة خاصة',

      /* Toasts */
      'toast.added': 'تمت إضافة {name} إلى السلة',
      'toast.removed': 'تمت إزالة المنتج',
      'toast.fillFields': 'يرجى تعبئة جميع الحقول',
      'toast.validEmail': 'يرجى إدخال بريد إلكتروني صالح',
      'toast.validPhone': 'يرجى إدخال رقم هاتف أردني صالح',
      'toast.enterPhone': 'يرجى إدخال رقم هاتفك',
      'toast.cartEmpty': 'سلّتك فارغة',
      'toast.welcome': 'أهلاً، {name}!',
      'toast.signedInCheckout': 'تم تسجيل الدخول — لنكمل طلبك!',
      'toast.signedOut': 'تم تسجيل الخروج',
      'toast.adminWelcome': 'أهلاً بك، أيها المشرف!',
      'toast.ownerWelcome': 'تم منح صلاحيات المطوّر ✨',
      'toast.resetSent': 'تم إرسال رابط الاستعادة (تجريبي)',
      'toast.thanks': 'شكراً، {name}!',
      'toast.reordered': 'تمت إعادة المنتجات إلى السلة',
      'toast.orderPlaced': 'تم الطلب! الإجمالي {total}',
      'toast.allSlots': 'كل الخانات ممتلئة — احذف واحدة أولاً',
      'toast.needOneAddress': 'تحتاج عنواناً واحداً على الأقل',
      'toast.addressAdded': 'تمت إضافة العنوان',
      'toast.addressUpdated': 'تم تحديث العنوان',
      'toast.addressDeleted': 'تم حذف العنوان',
      'toast.addressDefaultSet': 'تم تعيين العنوان الافتراضي',
      'toast.hoursSaved': 'تم حفظ ساعات العمل',
      'toast.contentSaved': 'تم حفظ المحتوى',
      'toast.productSaved': 'تم حفظ المنتج',
      'toast.productDeleted': 'تم حذف المنتج',
      'toast.offerSaved': 'تم حفظ العرض',
      'toast.offerDeleted': 'تم حذف العرض',
      'toast.galleryAdded': 'تمت إضافة الصورة',
      'toast.galleryRemoved': 'تم حذف الصورة',
      'toast.addonSaved': 'تم حفظ الإضافة',
      'toast.addonDeleted': 'تم حذف الإضافة',
      'toast.dataExported': 'تم تصدير النسخة الاحتياطية',
      'toast.dataImported': 'تم استيراد النسخة الاحتياطية',
      'toast.dataInvalid': 'ملف نسخة احتياطية غير صالح',
      'toast.employeeAdded': 'تمت إضافة الموظف',
      'toast.employeeUpdated': 'تم تحديث الموظف',
      'toast.employeeDeleted': 'تم حذف الموظف',
      'toast.employeeFields': 'الاسم واسم المستخدم وكلمة المرور مطلوبة',
      'toast.employeeExists': 'اسم المستخدم موجود مسبقاً',
      'toast.confirmDelete': 'اضغط مرة أخرى لتأكيد الحذف',
      'toast.synced': 'تمت المزامنة من السحابة',
      'toast.syncFailed': 'فشلت المزامنة — العمل دون اتصال',

      /* Account */
      'account.back': 'رجوع للمتجر', 'account.signout': 'خروج',
      'account.memberSince': 'عضو منذ 2025',
      'account.tabOrders': 'طلباتي', 'account.tabTracking': 'التتبع',
      'account.tabAddresses': 'عناويني',
      'account.noOrders': 'لا توجد طلبات بعد',
      'account.noOrdersSub': 'ستظهر حلوياتك السحرية هنا.',
      'account.shopNow': 'تسوّق الآن',
      'account.noTracking': 'لا يوجد تتبع نشط',
      'account.noTrackingSub': 'تتبع شحناتك بعد إرسالها.',
      'account.orderId': 'طلب رقم',
      'account.orderTotal': 'الإجمالي',
      'account.trackOrder': 'تتبع',
      'account.reorder': 'إعادة الطلب',
      'account.status_processing': 'قيد المعالجة',
      'account.status_packing': 'قيد التجهيز',
      'account.status_shipped': 'تم الإرسال',
      'account.status_out_for_delivery': 'قيد التوصيل',
      'account.status_delivered': 'تم التسليم',
      'account.status_cancelled': 'ملغى',
      'account.stepPlaced': 'تم الطلب',
      'account.stepProcessing': 'قيد المعالجة',
      'account.stepPacking': 'قيد التجهيز',
      'account.stepShipped': 'تم الإرسال',
      'account.stepOut': 'خارج للتوصيل',
      'account.stepDelivered': 'تم التسليم',
      'account.trackingFor': 'تتبع الطلب',
      'account.eta': 'الوصول المتوقع',
      'account.deliveringTo': 'التوصيل إلى',
      'account.statTotal': 'إجمالي الطلبات',
      'account.statActive': 'نشطة',
      'account.statDelivered': 'مسلّمة',
      'account.statSpent': 'إجمالي المشتريات',
      'account.savedAddresses': 'عناوين',
      'account.default': 'افتراضي',
      'account.edit': 'تعديل', 'account.delete': 'حذف',
      'account.setDefault': 'تعيين افتراضي',
      'account.addNew': 'إضافة عنوان جديد',
      'account.addAddressTitle': 'إضافة عنوان جديد',
      'account.editAddressTitle': 'تعديل العنوان',
      'account.addAddressSub': 'إلى أين نوصل حلواك السحرية؟',
      'account.fieldLabel': 'التسمية',
      'account.fieldName': 'الاسم الكامل',
      'account.fieldPhone': 'الهاتف',
      'account.fieldCity': 'المدينة',
      'account.fieldArea': 'المنطقة',
      'account.fieldLine': 'الشارع، المبنى، الطابق، الشقة',
      'account.labelHome': 'المنزل', 'account.labelWork': 'العمل',
      'account.labelOther': 'أخرى',
      'account.cancel': 'إلغاء', 'account.save': 'حفظ العنوان',
      'account.cartNotice': 'لديك {n} منتج في سلّتك.',
      'account.goToCart': 'اذهب للسلة',

      /* Admin */
      'admin.back': 'رجوع للمتجر', 'admin.badge': 'مشرف',
      'admin.heroName': 'إدارة المتجر',
      'admin.heroSub': 'تحكم كامل بالطلبات والعملاء والإيرادات',
      'admin.tabOverview': 'نظرة عامة', 'admin.tabOrders': 'الطلبات',
      'admin.tabCustomers': 'العملاء', 'admin.tabProducts': 'المنتجات',
      'admin.tabMessages': 'الرسائل',
      'admin.kpiRevenue': 'الإيرادات', 'admin.kpiOrders': 'الطلبات',
      'admin.kpiCustomers': 'العملاء', 'admin.kpiAov': 'متوسط قيمة الطلب',
      'admin.kpiPending': 'قيد الانتظار', 'admin.kpiDelivered': 'مسلّمة',
      'admin.kpiPosOrders': 'طلبات الكاشير', 'admin.kpiPosRevenue': 'إيرادات الكاشير',
      'admin.kpiTotalEmployees': 'إجمالي الموظفين',
      'admin.kpiActiveNow': 'نشط الآن',
      'admin.kpiTotalSales': 'إجمالي المبيعات',
      'admin.kpiTotalRevenue': 'إجمالي الإيرادات',
      'admin.revenueChart': 'اتجاه الإيرادات',
      'admin.topProducts': 'الأكثر مبيعاً',
      'admin.recentOrders': 'أحدث الطلبات', 'admin.viewAll': 'عرض الكل',
      'admin.noData': 'لا توجد بيانات',
      'admin.thOrder': 'الطلب', 'admin.thCustomer': 'العميل',
      'admin.thItems': 'المنتجات', 'admin.thTotal': 'الإجمالي',
      'admin.thStatus': 'الحالة', 'admin.thActions': 'إجراءات',
      'admin.thPhone': 'الهاتف', 'admin.thCity': 'المدينة',
      'admin.thOrders': 'الطلبات', 'admin.thSpent': 'إجمالي الشراء',
      'admin.thTier': 'الفئة', 'admin.thJoined': 'تاريخ الانضمام',
      'admin.thProduct': 'المنتج', 'admin.thPrice': 'السعر',
      'admin.thSold': 'المبيعات', 'admin.thRevenue': 'الإيرادات',
      'admin.thStock': 'المخزون',
      'admin.all': 'الكل', 'admin.advance': 'تقدم',
      'admin.payCod': 'الدفع عند التسليم', 'admin.payCard': 'بطاقة',
      'admin.noEmployees': 'لا يوجد موظفون بعد',
      'admin.addEmployee': 'إضافة موظف',
      'admin.editEmployee': 'تعديل موظف',
      'admin.deleteEmployeeConfirm': 'حذف هذا الموظف؟',
      'admin.online': 'متصل', 'admin.offline': 'غير متصل', 'admin.now': 'الآن',
      'admin.noMessages': 'لا رسائل',
      'admin.noMessagesSub': 'ستظهر رسائل العملاء هنا.',
      'admin.markRead': 'تعليم كمقروءة',
      'admin.markUnread': 'تعليم كغير مقروءة',
      'admin.export': 'تصدير CSV',
      'admin.exported': 'تم تصدير الطلبات',
      'admin.searchCustomers': 'ابحث في العملاء…',
      'admin.statusUpdated': 'الطلب {id} → {status}',
      'admin.tierVip': 'VIP', 'admin.tierActive': 'نشط', 'admin.tierNew': 'جديد',
      'admin.stockIn': 'متوفر', 'admin.stockLow': 'منخفض',
      'admin.stockOut': 'نفد', 'admin.units': 'وحدة',
      'admin.msgDeleted': 'تم حذف الرسالة',
      'admin.attendanceLog': 'سجل الدوام'
    }
  };

  /* ============ MUTABLE STATE ============ */
  /* Store data */
  window.products         = [];
  window.offers           = [];
  window.customers        = [];
  window.orderHistory     = [];
  window.galleryImages    = [];
  window.contentOverrides = {};
  window.mixWeights       = [100, 250, 500, 1000];
  window.mixPackaging     = [];
  window.candyTypes       = [];
  window.addons           = [];
  window.deliveryZones    = [];
  window.storeHours       = { open: 8, close: 17 };

  /* ============ Site Appearance Config ============ */
  window.siteConfig = {
    logoText:         'Hat Candy',
    heroBg:           '',              // رابط صورة خلفية الهيرو
    aboutImg:         '',              // رابط صورة قسم About
    ogImage:          '',              // رابط صورة المشاركة الاجتماعية
    metaTitle:        '',              // عنوان الصفحة (SEO)
    metaDescription:  '',              // وصف الصفحة (SEO)
    footerText:       ''               // نص الفوتر
  };

  window.contactMessages  = [];
  window.savedAddresses   = [];
  window.savedCards       = [];
  window.googleAccounts   = [];
  window.pendingGoogleAccount = null;

  /* Cart */
  window.cart         = [];
  window.cartDelivery = { method: 'delivery', zoneId: null };
  window.cartPayment  = {
    method: 'cash',
    card: { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null }
  };

  /* Mix builder */
  window.mixState = {
    step: 1,
    packaging: null,
    weight: null,
    typesCount: 1,
    selectedTypes: [],
    selectedAddons: []
  };

  /* Weight modal */
  window.weightModalState = { product: null, weight: 250, qty: 1 };

  /* User */
  window.currentUser = null;
  window.isAdmin     = false;
  window.isOwner     = false;

  /* UI state */
  window.candyFilter          = 'all';
  window.accountTab           = 'orders';
  window.adminTab             = 'overview';
  window.ownerTab             = 'dashboard';
  window.adminOrderFilter     = 'all';
  window.adminCustomerSearch  = '';
  window.overviewUnlocked     = false;
  window.reportRange          = 'weekly';
  window.checkoutIntent       = false;
  window.previousSignState    = null;
  window.pendingDeleteId      = null;
  window.pendingAddonDeleteId = null;

  /* ============ HELPERS ============ */
  window.$  = function (id)  { return document.getElementById(id); };
  window.$$ = function (sel) { return document.querySelectorAll(sel); };

  /* ============ LOAD PERSISTED DATA (from localStorage) ============ */
  /* Load siteConfig */
  try {
    const raw = localStorage.getItem(LS_KEYS.siteConfig);
    if (raw) Object.assign(window.siteConfig, JSON.parse(raw));
  } catch (e) { /* silent */ }

  /* Load saved addresses */
  try {
    const raw = localStorage.getItem(LS_KEYS.savedAddresses);
    if (raw) window.savedAddresses = JSON.parse(raw);
    if (!Array.isArray(window.savedAddresses)) window.savedAddresses = [];
  } catch (e) { window.savedAddresses = []; }

  /* Load saved cards (filtered per-user after login) */
  try {
    const raw = localStorage.getItem(LS_KEYS.cards);
    if (raw) window.savedCards = JSON.parse(raw);
    if (!Array.isArray(window.savedCards)) window.savedCards = [];
  } catch (e) { window.savedCards = []; }

  /* ============ SAVE HELPERS (used by parts 1-3) ============ */
  window.saveAddresses = function () {
    try {
      localStorage.setItem(LS_KEYS.savedAddresses, JSON.stringify(window.savedAddresses));
    } catch (e) { /* silent */ }
  };

  window.saveCards = function () {
    try {
      localStorage.setItem(LS_KEYS.cards, JSON.stringify(window.savedCards));
    } catch (e) { /* silent */ }
  };

  console.log('%c🍬 Part 0 loaded — constants, state, i18n', 'color:#e2015d;font-weight:bold;');

})();