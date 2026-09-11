/* =====================================================
   HAT CANDY — MAIN APPLICATION SCRIPT
   Organized into logical modules for maintainability.
   ===================================================== */

/* =====================================================
   1. i18n DICTIONARY
   ===================================================== */
const I18N = {
  en: {
    'title.page': 'Hat Candy | Every Candy Begins with Magic',
    'nav.home': 'Home', 'nav.offers': 'Offers', 'nav.candies': 'Candies', 'nav.about': 'About', 'nav.gallery': 'Gallery', 'nav.contact': 'Contact',
    'hero.badge': 'Luxury Candy Brand', 'hero.text': 'Every Candy Begins with Magic. Combining premium quality, elegant presentation, and playful creativity to transform every sweet treat into a memorable experience.',
    'hero.seeOffers': 'See Offers', 'hero.buildMix': 'Build Your Mix',
    'offers.title': 'Limited-Time Offers', 'offers.subtitle': "Sweet deals that won't last forever — grab them before they're gone!", 'offers.empty': 'No active offers right now.<br>Check back soon for more magic ✨', 'offers.grab': 'Grab this Offer', 'offers.save': 'Save',
    'banner.title': 'Mix It <span>Your Way</span> ✨', 'banner.text': 'Choose your weight, pick your packaging, and combine your favorite candies into one magical custom mix.', 'banner.cta': 'Start Building',
    'candies.title': 'Signature Collection', 'candies.subtitle': 'Indulge in our curated selection — add your favorites to the cart', 'candies.add': 'Add', 'candies.added': 'Added',
    'about.title': 'Our Magical Story', 'about.p1': 'Hat Candy is a luxury candy brand created to transform every sweet treat into a memorable experience.', 'about.p2': 'Inspired by our slogan, "Every Candy Begins with Magic," we believe that every piece of candy starts with imagination, care, and a little magic.', 'about.f1': 'Premium Ingredients', 'about.f2': 'Elegant Presentation', 'about.f3': 'Luxury Gift Boxes', 'about.f4': 'Made with Love',
    'gallery.title': 'Magic in Every Detail', 'gallery.subtitle': 'A glimpse into our world of premium sweets and elegant packaging',
    'contact.title': 'Get in Touch', 'contact.subtitle': 'Order your magical treats — online orders are accepted 24/7', 'contact.infoTitle': 'Contact Information', 'contact.infoText': "We'd love to hear from you! Place your order online any time, or visit our boutique during opening hours.",
    'contact.addressLabel': 'Boutique Address', 'contact.address': 'Amman, Jordan — Magic Avenue', 'contact.phoneLabel': 'Phone', 'contact.emailLabel': 'Email', 'contact.hoursLabel': 'Boutique Hours', 'contact.hours': 'Mon–Sat: 8am – 5pm | Online: 24/7',
    'contact.formName': 'Full Name', 'contact.formEmail': 'Email Address', 'contact.formMessage': 'Your Order / Message', 'contact.send': 'Send Message', 'contact.sending': 'Sending...',
    'footer.copy': '© 2025 Hat Candy. All rights reserved. Every Candy Begins with Magic.',
    'cart.title': 'My Cart', 'cart.item': 'item', 'cart.items': 'items', 'cart.empty': 'Your cart is empty.<br>Add some magic ✨', 'cart.total': 'Total', 'cart.checkout': 'Proceed to Checkout', 'cart.customMix': 'Custom Mix ✨',
    'login.welcome': 'Welcome Back', 'login.subtitle': 'Sign in to your Hat Candy account', 'login.almost': 'Almost There!', 'login.almostSub': 'Sign in to complete your order',
    'login.callout': 'We need a few details to <strong>complete your checkout</strong> and deliver your magical treats.',
    'login.successTitle': "You're Signed In!", 'login.successSub': 'Ready to complete your order ✨', 'login.successWelcome': 'Welcome back, {name}! ✨',
    'login.google': 'Continue with Google', 'login.divider': 'Or continue with email',
    'login.email': 'Email Address <span class="req">*</span>', 'login.password': 'Password <span class="req">*</span>', 'login.phone': 'Phone Number <span class="req">*</span>',
    'login.remember': 'Remember me', 'login.forgot': 'Forgot password?', 'login.signin': 'Sign In', 'login.signingIn': 'Signing in...', 'login.noAccount': 'Not a member?', 'login.createAccount': 'Create an account', 'login.change': 'Change', 'login.continue': 'Continue',
    'mix.title': 'Build Your Own Mix', 'mix.subtitle': 'Every Candy Begins with Magic', 'mix.step1': 'Weight', 'mix.step2': 'Packaging', 'mix.step3': 'Candy Types', 'mix.step4': 'Review',
    'mix.weightTitle': 'Choose Your Weight', 'mix.weightSub': 'From 100 g up to 1 kg — pick the perfect size for your magic mix.', 'mix.packTitle': 'Choose Packaging', 'mix.packSub': 'How would you like your candy mix packaged?',
    'mix.typesTitle': 'Choose Your Candy Types', 'mix.typesSub': 'How many different candy types would you like to mix?', 'mix.typesLabel': 'Types', 'mix.pickTypes': 'Now pick your candy types',
    'mix.reviewTitle': 'Review Your Custom Mix', 'mix.reviewSub': 'One last look before we add it to your cart.', 'mix.yourMix': 'Your Custom Mix', 'mix.readyToAdd': 'Ready to add to your cart',
    'mix.weight': 'Weight', 'mix.packaging': 'Packaging', 'mix.candyTypes': 'Candy Types', 'mix.candySelection': 'Candy Selection', 'mix.candy': 'Candy', 'mix.total': 'Total',
    'mix.back': 'Back', 'mix.next': 'Next', 'mix.addToCart': 'Add to Cart', 'mix.tapToChoose': 'Tap below to choose', 'mix.type': 'Type',
    'mix.halfKilo': 'Half Kilo', 'mix.fullKilo': 'Full Kilo', 'mix.min': 'Min', 'mix.kilogram': '1 Kilogram', 'mix.gramsLabel': '{w} grams', 'mix.unitG': 'g', 'mix.free': 'Free', 'mix.customMix': 'Custom Mix ✨',
    'sign.open': 'OPEN', 'sign.closed': 'CLOSED', 'sign.openNote': 'Open now – order online ✨', 'sign.closedNote': 'Closed – order online 24/7 ✨',
    'toast.added': '{name} added to cart', 'toast.removed': 'Item removed', 'toast.cartEmpty': 'Your cart is empty', 'toast.welcome': 'Welcome, {name}!', 'toast.signedInCheckout': "You're signed in! Proceed to checkout ✨",
    'toast.orderPlaced': 'Order placed! Total: {total}', 'toast.fillFields': 'Please fill all required fields', 'toast.validEmail': 'Please enter a valid email address', 'toast.validPhone': 'Please enter a valid Jordanian number (7X XXX XXXX)',
    'toast.enterPhone': 'Please enter your phone number', 'toast.resetSent': 'Password reset link sent to your email', 'toast.thanks': 'Thank you, {name}! Message received.', 'toast.allSlots': 'All slots are filled. Deselect one to swap.',
    'toast.signedOut': 'You have been signed out', 'toast.addressAdded': 'Address added successfully', 'toast.addressUpdated': 'Address updated', 'toast.addressDeleted': 'Address deleted', 'toast.addressDefaultSet': 'Default address updated', 'toast.needOneAddress': 'You need at least one saved address', 'toast.reordered': 'Items added back to your cart',
    'toast.ownerWelcome': 'Welcome back, Developer ✨', 'toast.adminWelcome': 'Welcome back, Admin ✨', 'toast.productSaved': 'Product saved successfully', 'toast.productDeleted': 'Product deleted', 'toast.offerSaved': 'Offer saved successfully', 'toast.offerDeleted': 'Offer deleted',
    'toast.galleryAdded': 'Gallery image added', 'toast.galleryRemoved': 'Gallery image removed', 'toast.contentSaved': 'Site content updated', 'toast.dataExported': 'Data exported', 'toast.dataImported': 'Data imported successfully', 'toast.dataInvalid': 'Invalid file format', 'toast.confirmDelete': 'Click again to confirm delete', 'toast.hoursSaved': 'Store hours updated',
    'account.back': 'Back to Store', 'account.signout': 'Sign Out', 'account.memberSince': 'Member since 2025', 'account.savedAddresses': 'saved addresses',
    'account.tabOrders': 'Orders', 'account.tabTracking': 'Tracking', 'account.tabAddresses': 'Addresses',
    'account.statTotal': 'Total Orders', 'account.statActive': 'Active', 'account.statDelivered': 'Delivered', 'account.statSpent': 'Total Spent',
    'account.orderId': 'Order', 'account.orderTotal': 'Order Total', 'account.trackOrder': 'Track', 'account.reorder': 'Reorder', 'account.noOrders': 'No orders yet', 'account.noOrdersSub': 'Your sweet journey starts with your first order ✨', 'account.shopNow': 'Shop Now',
    'account.noTracking': 'No active shipments', 'account.noTrackingSub': 'When you place an order, you can track it here.', 'account.trackingFor': 'Tracking for',
    'account.stepPlaced': 'Placed', 'account.stepProcessing': 'Processing', 'account.stepPacking': 'Packing', 'account.stepShipped': 'Shipped', 'account.stepOut': 'Out for Delivery', 'account.stepDelivered': 'Delivered',
    'account.eta': 'Estimated delivery', 'account.deliveringTo': 'Delivering to', 'account.default': 'Default', 'account.edit': 'Edit', 'account.delete': 'Delete', 'account.setDefault': 'Set as Default', 'account.addNew': 'Add New Address',
    'account.addAddressTitle': 'Add New Address', 'account.addAddressSub': 'Where should we deliver your magical treats?', 'account.editAddressTitle': 'Edit Address',
    'account.fieldLabel': 'Label', 'account.fieldName': 'Full Name', 'account.fieldPhone': 'Phone Number', 'account.fieldCity': 'City', 'account.fieldArea': 'Area / Neighborhood', 'account.fieldLine': 'Street, Building, Floor, Apt',
    'account.labelHome': 'Home', 'account.labelWork': 'Work', 'account.labelOther': 'Other', 'account.cancel': 'Cancel', 'account.save': 'Save Address', 'account.cartNotice': 'You have {n} item(s) waiting in your cart.', 'account.goToCart': 'Go to Cart',
    'account.status_processing': 'Processing', 'account.status_packing': 'Packing', 'account.status_shipped': 'Shipped', 'account.status_out_for_delivery': 'Out for Delivery', 'account.status_delivered': 'Delivered', 'account.status_cancelled': 'Cancelled',
    'delivery.delivery': 'Delivery', 'delivery.pickup': 'Pickup', 'delivery.zone': 'Delivery Area', 'delivery.selectZone': 'Select your area…', 'delivery.fee': 'Delivery Fee', 'delivery.pickupTitle': 'Pickup from Boutique', 'delivery.pickupAddress': 'Amman, Jordan — Magic Avenue', 'delivery.pickupHours': 'Mon–Sat: 8am – 5pm', 'delivery.noZones': 'No delivery areas configured yet', 'delivery.subtotal': 'Subtotal', 'delivery.feeLabel': 'Delivery Fee',
    'pay.title': 'Payment Method', 'pay.cash': 'Cash', 'pay.card': 'Card', 'pay.cashTitle': 'Cash on Delivery', 'pay.cashText': 'Pay in cash when your order arrives. Please have the exact amount ready.',
    'pay.cardNumber': 'Card Number', 'pay.cardName': 'Cardholder Name', 'pay.cardExpiry': 'Expiry (MM/YY)', 'pay.cardCvv': 'CVV', 'pay.cardSecure': 'Your payment is encrypted and secure',
    'pay.invalidCard': 'Please enter a valid card number', 'pay.invalidName': 'Please enter the cardholder name', 'pay.invalidExpiry': 'Please enter a valid expiry date (MM/YY)', 'pay.invalidCvv': 'Please enter a valid CVV (3–4 digits)',
    'admin.back': 'Back to Store', 'admin.badge': 'Admin', 'admin.heroName': 'Store Administration', 'admin.heroSub': 'Full control over orders, customers & revenue',
    'admin.tabOverview': 'Overview', 'admin.tabOrders': 'Orders', 'admin.tabCustomers': 'Customers', 'admin.tabProducts': 'Products', 'admin.tabMessages': 'Messages',
    'admin.kpiRevenue': 'Total Revenue', 'admin.kpiOrders': 'Total Orders', 'admin.kpiCustomers': 'Customers', 'admin.kpiAov': 'Avg. Order Value', 'admin.kpiPending': 'Pending Orders', 'admin.kpiDelivered': 'Delivered Revenue',
    'admin.revenueChart': 'Revenue Trend', 'admin.last7': 'Last 7 days', 'admin.topProducts': 'Top Selling Products', 'admin.recentOrders': 'Recent Orders', 'admin.viewAll': 'View all', 'admin.noData': 'No data yet',
    'admin.thOrder': 'Order', 'admin.thCustomer': 'Customer', 'admin.thItems': 'Items', 'admin.thTotal': 'Total', 'admin.thStatus': 'Status', 'admin.thActions': 'Actions', 'admin.thProduct': 'Product', 'admin.thPrice': 'Price', 'admin.thStock': 'Stock', 'admin.thSold': 'Sold', 'admin.thRevenue': 'Revenue',
    'admin.thPhone': 'Phone', 'admin.thCity': 'City', 'admin.thOrders': 'Orders', 'admin.thSpent': 'Total Spent', 'admin.thTier': 'Tier', 'admin.thJoined': 'Joined',
    'admin.all': 'All', 'admin.export': 'Export CSV', 'admin.exported': 'Orders exported successfully', 'admin.advance': 'Advance', 'admin.searchCustomers': 'Search customers…', 'admin.payCard': 'Card', 'admin.payCod': 'Cash on delivery',
    'admin.stockIn': 'In stock', 'admin.stockLow': 'Low stock', 'admin.stockOut': 'Out of stock', 'admin.tierVip': 'VIP', 'admin.tierActive': 'Active', 'admin.tierNew': 'New',
    'admin.noMessages': 'No messages yet', 'admin.noMessagesSub': 'Messages sent from the contact form will appear here.', 'admin.markRead': 'Mark as read', 'admin.markUnread': 'Mark as unread', 'admin.deleteMsg': 'Delete', 'admin.statusUpdated': 'Order {id} updated to {status}', 'admin.msgDeleted': 'Message deleted', 'admin.units': 'units'
  },
  ar: {
    'title.page': 'هات كاندي | كل قطعة حلوى تبدأ بالسحر',
    'nav.home': 'الرئيسية', 'nav.offers': 'العروض', 'nav.candies': 'الحلويات', 'nav.about': 'من نحن', 'nav.gallery': 'المعرض', 'nav.contact': 'تواصل معنا',
    'hero.badge': 'علامة حلويات فاخرة', 'hero.text': 'كل قطعة حلوى تبدأ بالسحر. نجمع بين الجودة الفاخرة والتقديم الأنيق والإبداع المرح لتحويل كل قطعة حلوى إلى تجربة لا تُنسى.',
    'hero.seeOffers': 'شاهد العروض', 'hero.buildMix': 'اصنع خلطتك',
    'offers.title': 'عروض لفترة محدودة', 'offers.subtitle': 'عروض حلوة لن تدوم للأبد — احصل عليها قبل أن تنتهي!', 'offers.empty': 'لا توجد عروض فعّالة حالياً.<br>عُد قريباً لمزيد من السحر ✨', 'offers.grab': 'احصل على العرض', 'offers.save': 'وفّر',
    'banner.title': 'امزجها <span>على طريقتك</span> ✨', 'banner.text': 'اختر الوزن، واختر التغليف، وامزج حلوياتك المفضلة في خلطة سحرية خاصة بك.', 'banner.cta': 'ابدأ الآن',
    'candies.title': 'التشكيلة المميزة', 'candies.subtitle': 'استمتع بتشكيلتنا المنتقاة — أضف مفضلاتك إلى السلة', 'candies.add': 'أضف', 'candies.added': 'تمت الإضافة',
    'about.title': 'قصتنا السحرية', 'about.p1': 'هات كاندي هي علامة حلويات فاخرة أُنشئت لتحويل كل قطعة حلوى إلى تجربة لا تُنسى.', 'about.p2': 'مستوحاة من شعارنا «كل قطعة حلوى تبدأ بالسحر»، نؤمن أن كل قطعة حلوى تبدأ من الخيال والعناية وقليل من السحر.', 'about.f1': 'مكونات فاخرة', 'about.f2': 'تقديم أنيق', 'about.f3': 'علب هدايا فاخرة', 'about.f4': 'مصنوعة بحب',
    'gallery.title': 'السحر في كل تفصيلة', 'gallery.subtitle': 'لمحة عن عالمنا من الحلويات الفاخرة والتغليف الأنيق',
    'contact.title': 'تواصل معنا', 'contact.subtitle': 'اطلب حلوياتك السحرية — الطلبات الإلكترونية متاحة ٢٤/٧', 'contact.infoTitle': 'معلومات التواصل', 'contact.infoText': 'يسعدنا سماعك! اطلب عبر الإنترنت في أي وقت، أو زُر متجرنا خلال ساعات العمل.',
    'contact.addressLabel': 'عنوان المتجر', 'contact.address': 'عمّان، الأردن — شارع السحر', 'contact.phoneLabel': 'الهاتف', 'contact.emailLabel': 'البريد الإلكتروني', 'contact.hoursLabel': 'ساعات العمل', 'contact.hours': 'الاثنين–السبت: ٨ص – ٥م | الإنترنت: ٢٤/٧',
    'contact.formName': 'الاسم الكامل', 'contact.formEmail': 'البريد الإلكتروني', 'contact.formMessage': 'طلبك / رسالتك', 'contact.send': 'إرسال الرسالة', 'contact.sending': 'جارٍ الإرسال...',
    'footer.copy': '© 2025 هات كاندي. جميع الحقوق محفوظة. كل قطعة حلوى تبدأ بالسحر.',
    'cart.title': 'سلتي', 'cart.item': 'عنصر', 'cart.items': 'عناصر', 'cart.empty': 'سلتك فارغة.<br>أضف بعض السحر ✨', 'cart.total': 'الإجمالي', 'cart.checkout': 'إتمام الشراء', 'cart.customMix': 'خلطة خاصة ✨',
    'login.welcome': 'مرحباً بعودتك', 'login.subtitle': 'سجّل الدخول إلى حسابك في هات كاندي', 'login.almost': 'اقتربت من النهاية!', 'login.almostSub': 'سجّل الدخول لإتمام طلبك',
    'login.callout': 'نحتاج بعض التفاصيل <strong>لإتمام طلبك</strong> وتوصيل حلوياتك السحرية.',
    'login.successTitle': 'تم تسجيل دخولك!', 'login.successSub': 'جاهز لإتمام طلبك ✨', 'login.successWelcome': 'مرحباً بعودتك، {name}! ✨',
    'login.google': 'المتابعة عبر جوجل', 'login.divider': 'أو تابع بالبريد الإلكتروني',
    'login.email': 'البريد الإلكتروني <span class="req">*</span>', 'login.password': 'كلمة المرور <span class="req">*</span>', 'login.phone': 'رقم الهاتف <span class="req">*</span>',
    'login.remember': 'تذكرني', 'login.forgot': 'نسيت كلمة المرور؟', 'login.signin': 'تسجيل الدخول', 'login.signingIn': 'جارٍ تسجيل الدخول...', 'login.noAccount': 'لست عضواً؟', 'login.createAccount': 'أنشئ حساباً', 'login.change': 'تغيير', 'login.continue': 'متابعة',
    'mix.title': 'اصنع خلطتك الخاصة', 'mix.subtitle': 'كل قطعة حلوى تبدأ بالسحر', 'mix.step1': 'الوزن', 'mix.step2': 'التغليف', 'mix.step3': 'أنواع الحلوى', 'mix.step4': 'المراجعة',
    'mix.weightTitle': 'اختر الوزن', 'mix.weightSub': 'من ١٠٠ غرام حتى ١ كيلو — اختر الحجم المثالي لخلطتك السحرية.', 'mix.packTitle': 'اختر التغليف', 'mix.packSub': 'كيف تريد تغليف خلطة الحلوى؟',
    'mix.typesTitle': 'اختر أنواع الحلوى', 'mix.typesSub': 'كم عدد أنواع الحلوى التي تريد مزجها؟', 'mix.typesLabel': 'أنواع', 'mix.pickTypes': 'اختر الآن أنواع الحلوى',
    'mix.reviewTitle': 'راجع خلطتك الخاصة', 'mix.reviewSub': 'نظرة أخيرة قبل إضافتها إلى سلتك.', 'mix.yourMix': 'خلطتك الخاصة', 'mix.readyToAdd': 'جاهزة للإضافة إلى سلتك',
    'mix.weight': 'الوزن', 'mix.packaging': 'التغليف', 'mix.candyTypes': 'أنواع الحلوى', 'mix.candySelection': 'اختيار الحلوى', 'mix.candy': 'الحلوى', 'mix.total': 'الإجمالي',
    'mix.back': 'السابق', 'mix.next': 'التالي', 'mix.addToCart': 'أضف إلى السلة', 'mix.tapToChoose': 'اضغط بالأسفل للاختيار', 'mix.type': 'النوع',
    'mix.halfKilo': 'نصف كيلو', 'mix.fullKilo': 'كيلو كامل', 'mix.min': 'الحد الأدنى', 'mix.kilogram': '١ كيلوغرام', 'mix.gramsLabel': '{w} غرام', 'mix.unitG': 'غ', 'mix.free': 'مجاني', 'mix.customMix': 'خلطة خاصة ✨',
    'sign.open': 'مفتوح', 'sign.closed': 'مغلق', 'sign.openNote': 'مفتوح الآن – اطلب عبر الإنترنت ✨', 'sign.closedNote': 'مغلق – اطلب عبر الإنترنت ٢٤/٧ ✨',
    'toast.added': 'تمت إضافة {name} إلى السلة', 'toast.removed': 'تم حذف العنصر', 'toast.cartEmpty': 'سلتك فارغة', 'toast.welcome': 'أهلاً بك، {name}!', 'toast.signedInCheckout': 'تم تسجيل دخولك! أكمل عملية الشراء ✨',
    'toast.orderPlaced': 'تم تقديم الطلب! الإجمالي: {total}', 'toast.fillFields': 'يرجى تعبئة جميع الحقول المطلوبة', 'toast.validEmail': 'يرجى إدخال بريد إلكتروني صالح', 'toast.validPhone': 'يرجى إدخال رقم أردني صالح (7X XXX XXXX)',
    'toast.enterPhone': 'يرجى إدخال رقم هاتفك', 'toast.resetSent': 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك', 'toast.thanks': 'شكراً لك، {name}! تم استلام رسالتك.', 'toast.allSlots': 'كل الخانات ممتلئة. ألغِ اختيار واحدة للتبديل.',
    'toast.signedOut': 'تم تسجيل خروجك', 'toast.addressAdded': 'تمت إضافة العنوان بنجاح', 'toast.addressUpdated': 'تم تحديث العنوان', 'toast.addressDeleted': 'تم حذف العنوان', 'toast.addressDefaultSet': 'تم تحديث العنوان الافتراضي', 'toast.needOneAddress': 'تحتاج إلى عنوان محفوظ واحد على الأقل', 'toast.reordered': 'تمت إعادة العناصر إلى سلتك',
    'toast.ownerWelcome': 'مرحباً بعودتك أيها المطوّر ✨', 'toast.adminWelcome': 'مرحباً بعودتك أيها المشرف ✨', 'toast.productSaved': 'تم حفظ المنتج بنجاح', 'toast.productDeleted': 'تم حذف المنتج', 'toast.offerSaved': 'تم حفظ العرض بنجاح', 'toast.offerDeleted': 'تم حذف العرض',
    'toast.galleryAdded': 'تمت إضافة صورة للمعرض', 'toast.galleryRemoved': 'تم حذف الصورة', 'toast.contentSaved': 'تم تحديث محتوى الموقع', 'toast.dataExported': 'تم تصدير البيانات', 'toast.dataImported': 'تم استيراد البيانات بنجاح', 'toast.dataInvalid': 'صيغة الملف غير صحيحة', 'toast.confirmDelete': 'اضغط مرة أخرى للتأكيد', 'toast.hoursSaved': 'تم تحديث ساعات العمل',
    'account.back': 'العودة للمتجر', 'account.signout': 'تسجيل الخروج', 'account.memberSince': 'عضو منذ 2025', 'account.savedAddresses': 'عناوين محفوظة',
    'account.tabOrders': 'طلباتي', 'account.tabTracking': 'تتبع الشحنة', 'account.tabAddresses': 'العناوين',
    'account.statTotal': 'إجمالي الطلبات', 'account.statActive': 'نشطة', 'account.statDelivered': 'تم التوصيل', 'account.statSpent': 'إجمالي الإنفاق',
    'account.orderId': 'طلب', 'account.orderTotal': 'إجمالي الطلب', 'account.trackOrder': 'تتبع', 'account.reorder': 'إعادة الطلب', 'account.noOrders': 'لا توجد طلبات بعد', 'account.noOrdersSub': 'رحلتك الحلوة تبدأ من طلبك الأول ✨', 'account.shopNow': 'تسوّق الآن',
    'account.noTracking': 'لا توجد شحنات نشطة', 'account.noTrackingSub': 'عند تقديم طلب، يمكنك تتبعه هنا.', 'account.trackingFor': 'تتبع الطلب',
    'account.stepPlaced': 'تم الطلب', 'account.stepProcessing': 'قيد التجهيز', 'account.stepPacking': 'قيد التغليف', 'account.stepShipped': 'تم الشحن', 'account.stepOut': 'خرج للتوصيل', 'account.stepDelivered': 'تم التوصيل',
    'account.eta': 'التوصيل المتوقع', 'account.deliveringTo': 'التوصيل إلى', 'account.default': 'افتراضي', 'account.edit': 'تعديل', 'account.delete': 'حذف', 'account.setDefault': 'تعيين افتراضي', 'account.addNew': 'إضافة عنوان جديد',
    'account.addAddressTitle': 'إضافة عنوان جديد', 'account.addAddressSub': 'أين نوصل حلوياتك السحرية؟', 'account.editAddressTitle': 'تعديل العنوان',
    'account.fieldLabel': 'التسمية', 'account.fieldName': 'الاسم الكامل', 'account.fieldPhone': 'رقم الهاتف', 'account.fieldCity': 'المدينة', 'account.fieldArea': 'المنطقة / الحي', 'account.fieldLine': 'الشارع، المبنى، الطابق، الشقة',
    'account.labelHome': 'المنزل', 'account.labelWork': 'العمل', 'account.labelOther': 'أخرى', 'account.cancel': 'إلغاء', 'account.save': 'حفظ العنوان', 'account.cartNotice': 'لديك {n} عنصر في سلتك بانتظار إتمام الشراء.', 'account.goToCart': 'الذهاب للسلة',
    'account.status_processing': 'قيد التجهيز', 'account.status_packing': 'قيد التغليف', 'account.status_shipped': 'تم الشحن', 'account.status_out_for_delivery': 'خرج للتوصيل', 'account.status_delivered': 'تم التوصيل', 'account.status_cancelled': 'ملغي',
    'delivery.delivery': 'توصيل', 'delivery.pickup': 'استلام من المحل', 'delivery.zone': 'منطقة التوصيل', 'delivery.selectZone': 'اختر منطقتك…', 'delivery.fee': 'رسوم التوصيل', 'delivery.pickupTitle': 'الاستلام من المتجر', 'delivery.pickupAddress': 'عمّان، الأردن — شارع السحر', 'delivery.pickupHours': 'الاثنين–السبت: ٨ص – ٥م', 'delivery.noZones': 'لا توجد مناطق توصيل مُعدّة', 'delivery.subtotal': 'المجموع الفرعي', 'delivery.feeLabel': 'رسوم التوصيل',
    'pay.title': 'طريقة الدفع', 'pay.cash': 'كاش', 'pay.card': 'بطاقة', 'pay.cashTitle': 'الدفع عند الاستلام', 'pay.cashText': 'ادفع نقدًا عند وصول طلبك. يُفضّل تجهيز المبلغ بالضبط.',
    'pay.cardNumber': 'رقم البطاقة', 'pay.cardName': 'اسم حامل البطاقة', 'pay.cardExpiry': 'تاريخ الانتهاء (MM/YY)', 'pay.cardCvv': 'CVV', 'pay.cardSecure': 'دفعك مشفّر وآمن',
    'pay.invalidCard': 'يرجى إدخال رقم بطاقة صالح', 'pay.invalidName': 'يرجى إدخال اسم حامل البطاقة', 'pay.invalidExpiry': 'يرجى إدخال تاريخ انتهاء صالح (MM/YY)', 'pay.invalidCvv': 'يرجى إدخال CVV صالح (٣–٤ أرقام)',
    'admin.back': 'العودة للمتجر', 'admin.badge': 'مشرف', 'admin.heroName': 'إدارة المتجر', 'admin.heroSub': 'تحكم كامل بالطلبات والعملاء والإيرادات',
    'admin.tabOverview': 'نظرة عامة', 'admin.tabOrders': 'الطلبات', 'admin.tabCustomers': 'العملاء', 'admin.tabProducts': 'المنتجات', 'admin.tabMessages': 'الرسائل',
    'admin.kpiRevenue': 'إجمالي الإيرادات', 'admin.kpiOrders': 'إجمالي الطلبات', 'admin.kpiCustomers': 'العملاء', 'admin.kpiAov': 'متوسط قيمة الطلب', 'admin.kpiPending': 'طلبات قيد التنفيذ', 'admin.kpiDelivered': 'إيرادات مكتملة',
    'admin.revenueChart': 'منحنى الإيرادات', 'admin.last7': 'آخر ٧ أيام', 'admin.topProducts': 'الأكثر مبيعاً', 'admin.recentOrders': 'أحدث الطلبات', 'admin.viewAll': 'عرض الكل', 'admin.noData': 'لا توجد بيانات بعد',
    'admin.thOrder': 'الطلب', 'admin.thCustomer': 'العميل', 'admin.thItems': 'العناصر', 'admin.thTotal': 'الإجمالي', 'admin.thStatus': 'الحالة', 'admin.thActions': 'إجراءات', 'admin.thProduct': 'المنتج', 'admin.thPrice': 'السعر', 'admin.thStock': 'المخزون', 'admin.thSold': 'المبيعات', 'admin.thRevenue': 'الإيراد',
    'admin.thPhone': 'الهاتف', 'admin.thCity': 'المدينة', 'admin.thOrders': 'الطلبات', 'admin.thSpent': 'إجمالي الإنفاق', 'admin.thTier': 'التصنيف', 'admin.thJoined': 'تاريخ الانضمام',
    'admin.all': 'الكل', 'admin.export': 'تصدير CSV', 'admin.exported': 'تم تصدير الطلبات بنجاح', 'admin.advance': 'المرحلة التالية', 'admin.searchCustomers': 'ابحث عن عميل…', 'admin.payCard': 'بطاقة', 'admin.payCod': 'الدفع عند الاستلام',
    'admin.stockIn': 'متوفر', 'admin.stockLow': 'مخزون منخفض', 'admin.stockOut': 'غير متوفر', 'admin.tierVip': 'كبار العملاء', 'admin.tierActive': 'نشط', 'admin.tierNew': 'جديد',
    'admin.noMessages': 'لا توجد رسائل بعد', 'admin.noMessagesSub': 'ستظهر هنا الرسائل المرسلة من نموذج التواصل.', 'admin.markRead': 'تعليم كمقروءة', 'admin.markUnread': 'تعليم كغير مقروءة', 'admin.deleteMsg': 'حذف', 'admin.statusUpdated': 'تم تحديث الطلب {id} إلى {status}', 'admin.msgDeleted': 'تم حذف الرسالة', 'admin.units': 'وحدة'
  }
};

/* =====================================================
   2. DEFAULT DATA
   ===================================================== */
const DEFAULT_PRODUCTS = [
  { id: 'gummies', name: 'Gourmet Gummies', name_ar: 'حلوى الجيلي الفاخرة', desc: 'Soft, fruity, and bursting with natural flavors.', desc_ar: 'ناعمة، فاكهية، ومليئة بالنكهات الطبيعية.', price: 8.99, oldPrice: 12.99, badge: 'Bestseller', badge_ar: 'الأكثر مبيعاً', stock: 140, img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600' },
  { id: 'truffles', name: 'Velvet Truffles', name_ar: 'ترافل مخملي', desc: 'Rich, creamy chocolate ganache coated in premium Belgian cocoa.', desc_ar: 'غاناش شوكولاتة غني وكريمي مغطى بمسحوق الكاكاو البلجيكي.', price: 14.99, oldPrice: 19.99, badge: 'Premium', badge_ar: 'فاخر', stock: 62, img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600' },
  { id: 'lollipops', name: 'Honey Swirl Pops', name_ar: 'مصاصات العسل', desc: 'Colorful artisan lollipops crafted with real honey.', desc_ar: 'مصاصات ملونة حرفية مصنوعة من العسل الطبيعي.', price: 6.99, oldPrice: 9.99, badge: 'New', badge_ar: 'جديد', stock: 18, img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600' },
  { id: 'cloud', name: 'Cloud Candy', name_ar: 'حلوى السحاب', desc: 'Fluffy, melt-in-your-mouth cotton candy.', desc_ar: 'غزل البنات الهش الذائب في الفم.', price: 7.99, oldPrice: 10.99, badge: 'New', badge_ar: 'جديد', stock: 95, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600' },
  { id: 'sours', name: 'Zesty Sours', name_ar: 'حلوى حامضة', desc: 'Tangy and sweet gummy worms with a sour sugar coating.', desc_ar: 'ديدان جيلي حامضة وحلوة مع طبقة من السكر الحامض.', price: 8.49, oldPrice: 11.99, badge: 'Bestseller', badge_ar: 'الأكثر مبيعاً', stock: 8, img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600' },
  { id: 'caramel', name: 'Golden Caramel Corn', name_ar: 'فشار الكراميل الذهبي', desc: 'Crunchy popcorn coated in buttery caramel glaze.', desc_ar: 'فشار مقرمش مغطى بطبقة الكراميل بالزبدة.', price: 9.99, oldPrice: 13.99, badge: 'Premium', badge_ar: 'فاخر', stock: 34, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600' }
];

const DEFAULT_OFFERS = [
  { id: 'offer-love-box', name: 'Love Box Special', name_ar: 'علبة الحب الخاصة', desc: 'A romantic assortment of our finest gummies, truffles & swirl pops.', desc_ar: 'تشكيلة رومانسية من أفخر الجيلي والترافل ومصاصات العسل.', category: 'Valentine Special', category_ar: 'عرض الفالنتاين', discount: '35% OFF', discount_ar: 'خصم ٣٥٪', price: 24.99, oldPrice: 38.99, ends: 'Ends in 3 days', ends_ar: 'ينتهي خلال ٣ أيام', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600', isActive: true },
  { id: 'offer-family-pack', name: 'Family Magic Pack', name_ar: 'علبة العائلة السحرية', desc: '6 gourmet candy bags — perfect for sharing the magic.', desc_ar: '٦ أكياس حلوى فاخرة — مثالية لمشاركة السحر.', category: 'Bundle Deal', category_ar: 'عرض مجمّع', discount: '40% OFF', discount_ar: 'خصم ٤٠٪', price: 44.99, oldPrice: 74.99, ends: 'Ends in 5 days', ends_ar: 'ينتهي خلال ٥ أيام', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', isActive: true },
  { id: 'offer-truffle-trio', name: 'Truffle Lover Trio', name_ar: 'ثلاثية عشّاق الترافل', desc: 'Three premium truffle flavors: Dark, Milk & White.', desc_ar: 'ثلاث نكهات ترافل فاخرة: الداكنة، الحليب، والبيضاء.', category: 'Premium Deal', category_ar: 'عرض فاخر', discount: '25% OFF', discount_ar: 'خصم ٢٥٪', price: 32.99, oldPrice: 43.99, ends: 'Ends in 2 days', ends_ar: 'ينتهي خلال يومين', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', isActive: true }
];

const DEFAULT_GALLERY = [
  { id: 'g1', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', alt: 'Candy 1' },
  { id: 'g2', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', alt: 'Candy 2' },
  { id: 'g3', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600', alt: 'Candy 3' },
  { id: 'g4', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600', alt: 'Candy 4' },
  { id: 'g5', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', alt: 'Candy 5' },
  { id: 'g6', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', alt: 'Candy 6' }
];

const DEFAULT_MIX_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const DEFAULT_MIX_PACKAGING = [
  { id: 'bag', name: 'Bag', name_ar: 'كيس', desc: 'Signature kraft bag', desc_ar: 'كيس كرافت المميز', icon: 'bx-shopping-bag', img: '', extra: 0 },
  { id: 'round', name: 'Round', name_ar: 'علبة دائرية', desc: 'Circular bucket style', desc_ar: 'علبة دائرية أنيقة', icon: 'bx-cylinder', img: '', extra: 2.50 },
  { id: 'rect', name: 'Rectangular', name_ar: 'علبة مستطيلة', desc: 'Sleek rectangular box', desc_ar: 'علبة مستطيلة أنيقة', icon: 'bx-rectangle', img: '', extra: 3.00 }
];

const DEFAULT_CANDY_TYPES = [
  { id: 'gummy-bears', name: 'Gummy Bears', name_ar: 'دببة الجيلي', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', color: '#e2015d', price_per_kg: 12.00, sale_price_per_kg: 0 },
  { id: 'sour-worms', name: 'Sour Worms', name_ar: 'ديدان حامضة', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#22c55e', price_per_kg: 11.00, sale_price_per_kg: 8.50 },
  { id: 'chocolate', name: 'Chocolate Truffles', name_ar: 'ترافل الشوكولاتة', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', color: '#7b3f00', price_per_kg: 18.00, sale_price_per_kg: 0 },
  { id: 'lollipops', name: 'Swirl Lollipops', name_ar: 'مصاصات ملتوية', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=300', color: '#fd5183', price_per_kg: 9.00, sale_price_per_kg: 0 },
  { id: 'cotton-candy', name: 'Cloud Candy', name_ar: 'حلوى السحاب', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#fdba74', price_per_kg: 10.00, sale_price_per_kg: 0 },
  { id: 'jelly-beans', name: 'Jelly Beans', name_ar: 'حبوب الجيلي', img: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300', color: '#facc43', price_per_kg: 13.00, sale_price_per_kg: 10.00 },
  { id: 'marshmallows', name: 'Marshmallows', name_ar: 'مارشميلو', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', color: '#fef3c7', price_per_kg: 8.00, sale_price_per_kg: 0 },
  { id: 'caramel', name: 'Caramel Bites', name_ar: 'قطع الكراميل', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#d97706', price_per_kg: 15.00, sale_price_per_kg: 0 }
];

const DEFAULT_DELIVERY_ZONES = [
  { id: 'z1', name: 'Amman', name_ar: 'عمان', price: 2.00, active: true },
  { id: 'z2', name: 'Zarqa', name_ar: 'الزرقاء', price: 3.00, active: true },
  { id: 'z3', name: 'Irbid', name_ar: 'إربد', price: 3.50, active: true },
  { id: 'z4', name: 'Aqaba', name_ar: 'العقبة', price: 5.00, active: true },
  { id: 'z5', name: 'Salt', name_ar: 'السلط', price: 2.50, active: true }
];

/* =====================================================
   3. APPLICATION STATE
   ===================================================== */
let products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
let offers = JSON.parse(JSON.stringify(DEFAULT_OFFERS));
let galleryImages = JSON.parse(JSON.stringify(DEFAULT_GALLERY));
let mixWeights = [...DEFAULT_MIX_WEIGHTS];
let mixPackaging = JSON.parse(JSON.stringify(DEFAULT_MIX_PACKAGING));
let candyTypes = JSON.parse(JSON.stringify(DEFAULT_CANDY_TYPES));
let deliveryZones = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_ZONES));
let contentOverrides = {};
let storeHours = { open: 8, close: 17 };

let cart = [];
let currentUser = null;
let checkoutIntent = false;
let cartDelivery = { method: 'delivery', zoneId: null };
let cartPayment = { method: 'cash', card: { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null } };

const mixState = { step: 1, weight: null, packaging: null, typesCount: 1, selectedTypes: [] };

let customers = [
  { id: 'c-1001', name: 'Ahmad Al-Rashid', email: 'ahmad.rashid@gmail.com', phone: '+962 7 9876 5432', city: 'Amman', joined: '2025-03-12', tier: 'vip' },
  { id: 'c-1002', name: 'Lina Haddad', email: 'lina.haddad@gmail.com', phone: '+962 7 9112 3344', city: 'Amman', joined: '2025-05-04', tier: 'active' },
  { id: 'c-1003', name: 'Omar Nasser', email: 'omar.nasser@outlook.com', phone: '+962 7 8899 1122', city: 'Zarqa', joined: '2025-06-21', tier: 'active' },
  { id: 'c-1004', name: 'Sara Khalil', email: 'sara.khalil@gmail.com', phone: '+962 7 7777 8899', city: 'Irbid', joined: '2025-08-09', tier: 'new' },
  { id: 'c-1005', name: 'Yousef Mansour', email: 'yousef.m@gmail.com', phone: '+962 7 9555 6677', city: 'Aqaba', joined: '2025-09-15', tier: 'active' },
  { id: 'c-1006', name: 'Rana Odeh', email: 'rana.odeh@gmail.com', phone: '+962 7 9333 4455', city: 'Amman', joined: '2025-10-02', tier: 'vip' },
  { id: 'c-1007', name: 'Khaled Sami', email: 'khaled.sami@gmail.com', phone: '+962 7 9666 7788', city: 'Salt', joined: '2025-11-11', tier: 'new' }
];

let orderHistory = [
  { id: 'HC-2025-1042', customerId: 'c-1001', date: '2025-12-01', status: 'delivered', payment: 'card', itemsList: [{ name: 'Velvet Truffles', name_ar: 'ترافل مخملي', qty: 1, price: 14.99 }, { name: 'Gourmet Gummies', name_ar: 'حلوى الجيلي الفاخرة', qty: 2, price: 8.99 }], total: 32.97, address: 'Amman, Abdoun', tracking: 'JD-EXP-882134', placedAt: '2025-12-01', packedAt: '2025-12-01', shippedAt: '2025-12-02', outAt: '2025-12-03', deliveredAt: '2025-12-04', eta: '2025-12-04' },
  { id: 'HC-2025-1051', customerId: 'c-1002', date: '2025-12-02', status: 'delivered', payment: 'cod', itemsList: [{ name: 'Love Box Special', name_ar: 'علبة الحب الخاصة', qty: 1, price: 24.99 }], total: 24.99, address: 'Amman, Sweifieh', tracking: 'JD-EXP-883401', placedAt: '2025-12-02', packedAt: '2025-12-02', shippedAt: '2025-12-03', outAt: '2025-12-04', deliveredAt: '2025-12-05', eta: '2025-12-05' },
  { id: 'HC-2025-1063', customerId: 'c-1003', date: '2025-12-03', status: 'out_for_delivery', payment: 'card', itemsList: [{ name: 'Family Magic Pack', name_ar: 'علبة العائلة السحرية', qty: 1, price: 44.99 }], total: 44.99, address: 'Zarqa', tracking: 'JD-EXP-885220', placedAt: '2025-12-03', packedAt: '2025-12-03', shippedAt: '2025-12-04', outAt: '2025-12-05', deliveredAt: null, eta: '2025-12-06' },
  { id: 'HC-2025-1074', customerId: 'c-1004', date: '2025-12-04', status: 'shipped', payment: 'card', itemsList: [{ name: 'Cloud Candy', name_ar: 'حلوى السحاب', qty: 1, price: 7.99 }, { name: 'Zesty Sours', name_ar: 'حلوى حامضة', qty: 1, price: 8.49 }], total: 16.48, address: 'Irbid', tracking: 'JD-EXP-887902', placedAt: '2025-12-04', packedAt: '2025-12-04', shippedAt: '2025-12-05', outAt: null, deliveredAt: null, eta: '2025-12-07' },
  { id: 'HC-2025-1087', customerId: 'c-1001', date: '2025-12-05', status: 'packing', payment: 'card', itemsList: [{ name: 'Custom Mix', name_ar: 'خلطة خاصة', qty: 1, price: 14.00, isMix: true }], total: 14.00, address: 'Amman, Abdoun', tracking: null, placedAt: '2025-12-05', packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null },
  { id: 'HC-2025-1092', customerId: 'c-1005', date: '2025-12-06', status: 'processing', payment: 'cod', itemsList: [{ name: 'Love Box Special', name_ar: 'علبة الحب الخاصة', qty: 1, price: 24.99 }, { name: 'Honey Swirl Pops', name_ar: 'مصاصات العسل', qty: 1, price: 6.99 }], total: 31.98, address: 'Aqaba', tracking: null, placedAt: '2025-12-06', packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null },
  { id: 'HC-2025-1103', customerId: 'c-1006', date: '2025-12-07', status: 'processing', payment: 'card', itemsList: [{ name: 'Truffle Lover Trio', name_ar: 'ثلاثية عشّاق الترافل', qty: 1, price: 32.99 }, { name: 'Golden Caramel Corn', name_ar: 'فشار الكراميل الذهبي', qty: 2, price: 9.99 }], total: 52.97, address: 'Amman, Dabouq', tracking: null, placedAt: '2025-12-07', packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null },
  { id: 'HC-2025-1110', customerId: 'c-1002', date: '2025-12-08', status: 'cancelled', payment: 'card', itemsList: [{ name: 'Honey Swirl Pops', name_ar: 'مصاصات العسل', qty: 1, price: 6.99 }], total: 6.99, address: 'Amman, Sweifieh', tracking: null, placedAt: '2025-12-08', packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null },
  { id: 'HC-2025-1118', customerId: 'c-1007', date: '2025-12-09', status: 'delivered', payment: 'cod', itemsList: [{ name: 'Gourmet Gummies', name_ar: 'حلوى الجيلي الفاخرة', qty: 1, price: 8.99 }, { name: 'Velvet Truffles', name_ar: 'ترافل مخملي', qty: 1, price: 14.99 }], total: 23.98, address: 'Salt', tracking: 'JD-EXP-889330', placedAt: '2025-12-09', packedAt: '2025-12-09', shippedAt: '2025-12-10', outAt: '2025-12-11', deliveredAt: '2025-12-12', eta: '2025-12-12' }
];

let savedAddresses = [
  { id: 'addr-1', label: 'home', name: 'Ahmad Al-Rashid', phone: '+962 7 9876 5432', city: 'Amman', area: 'Abdoun', line: 'Magic Avenue, Building 5, Floor 2, Apt 201', isDefault: true },
  { id: 'addr-2', label: 'work', name: 'Ahmad Al-Rashid', phone: '+962 7 9876 5432', city: 'Amman', area: 'Sweifieh', line: 'Rainbow Street, Office 12, 3rd Floor', isDefault: false }
];

let contactMessages = [
  { id: 'msg-1', name: 'Noor Ali', email: 'noor.ali@example.com', date: '2025-12-08', read: false, message: 'مرحبا، بدي أطلب علبة هدايا كبيرة للمناسبة.' },
  { id: 'msg-2', name: 'Mohammad Zaid', email: 'm.zaid@example.com', date: '2025-12-07', read: true, message: 'Do you offer corporate gift boxes with custom branding?' },
  { id: 'msg-3', name: 'Dana Sami', email: 'dana.sami@example.com', date: '2025-12-05', read: false, message: 'أحببت خلطة الترافل! هل متوفرة بنكهة الفستق؟' }
];

/* =====================================================
   4. CONFIGURATION CONSTANTS
   ===================================================== */
const ADMIN_EMAIL = '123321';
const ADMIN_PASSWORD = '123321';
const OWNER_PHONE_DIGITS = ['0782342105', '962782342105', '782342105'];
const STATUS_FLOW = ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

const LS_KEYS = {
  products: 'hatcandy-products',
  offers: 'hatcandy-offers',
  gallery: 'hatcandy-gallery',
  content: 'hatcandy-content',
  contact: 'hatcandy-contact',
  mixWeights: 'hatcandy-mix-weights',
  mixPackaging: 'hatcandy-mix-packaging',
  candyTypes: 'hatcandy-candy-types',
  deliveryZones: 'hatcandy-delivery-zones',
  storeHours: 'hatcandy-store-hours',
  googleAccounts: 'hatcandy-google-accounts',
  cards: 'hatcandy-cards'
};

/* =====================================================
   5. APPLICATION RUNTIME STATE
   ===================================================== */
let lang = 'en';
try { lang = localStorage.getItem('hatcandy-lang') || 'en'; } catch (e) { lang = 'en'; }
if (lang !== 'ar') lang = 'en';

let isAdmin = false;
let isOwner = false;
let adminTab = 'overview';
let ownerTab = 'dashboard';
let accountTab = 'orders';
let adminOrderFilter = 'all';
let adminCustomerSearch = '';
let pendingDeleteId = null;
let previousSignState = null;

/* =====================================================
   6. GOOGLE AUTH MODULE
   ===================================================== */
let googleAccounts = [];
let pendingGoogleAccount = null;

function loadGoogleAccounts() {
  try {
    const raw = localStorage.getItem(LS_KEYS.googleAccounts);
    googleAccounts = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(googleAccounts)) googleAccounts = [];
  } catch (err) {
    console.warn('[GoogleAuth] Failed to load:', err);
    googleAccounts = [];
  }
}

function persistGoogleAccounts() {
  try {
    localStorage.setItem(LS_KEYS.googleAccounts, JSON.stringify(googleAccounts));
  } catch (err) {
    console.warn('[GoogleAuth] Failed to persist:', err);
  }
}

function rememberGoogleAccount(account) {
  if (!account || !account.email) return;
  if (!googleAccounts.some(a => a.email === account.email)) {
    googleAccounts.push({ name: account.name || 'User', email: account.email });
    persistGoogleAccounts();
  }
}

function openGoogleChooser() {
  pendingGoogleAccount = null;
  renderGoogleChooser();
  $('gChooser').classList.add('show');
}

function closeGoogleChooser() {
  $('gChooser').classList.remove('show');
}

function renderGoogleChooser() {
  const list = $('gChooserList');
  if (!list) return;

  if (!googleAccounts.length) {
    list.innerHTML = `<div style="padding:24px;text-align:center;font-size:.85rem;color:#5f6368;">No saved accounts on this device.</div>`;
    return;
  }

  list.innerHTML = googleAccounts.map((acc, i) => `
    <div class="gchooser-item" data-google-account="${i}" role="option" tabindex="0">
      <div class="gchooser-avatar">${esc((acc.name || 'G').charAt(0))}</div>
      <div class="gchooser-info">
        <strong>${esc(acc.name)}</strong>
        <span>${esc(acc.email)}</span>
      </div>
      <button class="gchooser-del" data-google-remove="${i}" aria-label="Remove account">
        <i class='bx bx-x'></i>
      </button>
    </div>
  `).join('');
}

function handleGoogleAccountSelected(index) {
  const acc = googleAccounts[index];
  if (!acc) return;
  closeGoogleChooser();

  const linked = customers.find(c =>
    c.email && c.email.toLowerCase() === acc.email.toLowerCase() && c.phone
  );

  if (linked) {
    onSignInSuccess({ name: acc.name, email: acc.email, phone: linked.phone });
  } else {
    pendingGoogleAccount = acc;
    openGooglePhoneStep(acc);
  }
}

function openGooglePhoneStep(acc) {
  $('googleName').textContent = acc.name;
  $('googleEmail').textContent = acc.email;
  $('googleAvatar').textContent = (acc.name || 'G').charAt(0).toUpperCase();

  $('googleBtn').style.display = 'none';
  $('loginDivider').style.display = 'none';
  $('loginForm').style.display = 'none';
  $('googlePreview').classList.add('show');
  $('googlePhoneReveal').classList.add('show');

  $('googlePhone').value = '';
  setTimeout(() => $('googlePhone').focus(), 220);
}

function resetGoogleSignInUI() {
  $('googlePreview').classList.remove('show');
  $('googlePhoneReveal').classList.remove('show');
  $('googleBtn').style.display = 'flex';
  $('loginDivider').style.display = 'flex';
  $('loginForm').style.display = 'flex';
  $('googlePhone').value = '';
  pendingGoogleAccount = null;
}

/* =====================================================
   7. USER CARDS MODULE
   ===================================================== */
let savedCards = [];

function loadUserCards() {
  if (!currentUser) { savedCards = []; return; }
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEYS.cards) || '[]');
    savedCards = Array.isArray(all) ? all.filter(c => c.customerId === currentUser.id) : [];
  } catch (err) {
    console.warn('[Cards] Failed to load:', err);
    savedCards = [];
  }
}

function persistUserCards() {
  if (!currentUser) return;
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEYS.cards) || '[]');
    const others = Array.isArray(all) ? all.filter(c => c.customerId !== currentUser.id) : [];
    localStorage.setItem(LS_KEYS.cards, JSON.stringify([...others, ...savedCards]));
  } catch (err) {
    console.warn('[Cards] Failed to persist:', err);
  }
}

function saveCardForCurrentUser(card) {
  if (!currentUser || !card) return;
  const duplicate = savedCards.some(c => c.last4 === card.last4 && c.brand === card.brand);
  if (duplicate) return;

  savedCards.push({
    id: 'card-' + Date.now(),
    customerId: currentUser.id,
    brand: card.brand || 'Card',
    last4: card.last4,
    name: card.name,
    expiry: card.expiry
  });
  persistUserCards();
}

function removeSavedCard(cardId) {
  savedCards = savedCards.filter(c => c.id !== cardId);
  persistUserCards();
}

/* =====================================================
   8. USER-SCOPED ORDERS HELPERS
   ===================================================== */
function getUserOrders() {
  if (!currentUser) return [];
  return orderHistory.filter(o => o.customerId === currentUser.id);
}

function getUserStats() {
  const all = getUserOrders();
  const nonCancelled = all.filter(o => o.status !== 'cancelled');
  return {
    total: all.length,
    active: all.filter(o => ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)).length,
    delivered: all.filter(o => o.status === 'delivered').length,
    spent: nonCancelled.reduce((sum, o) => sum + o.total, 0)
  };
}

/* =====================================================
   9. HELPERS
   ===================================================== */
const $ = id => document.getElementById(id);

function t(key, vars) {
  const dict = I18N[lang] || I18N.en;
  let s = dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}

function L(obj, field) {
  return (lang === 'ar' && obj[field + '_ar']) ? obj[field + '_ar'] : obj[field];
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

function formatDate(d) {
  if (!d) return '—';
  const x = new Date(d);
  return x.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusIcon(s) {
  return {
    processing: 'bx bx-time-five',
    packing: 'bx bx-archive',
    shipped: 'bx bx-package',
    out_for_delivery: 'bx bx-cycling',
    delivered: 'bx bx-check-circle',
    cancelled: 'bx bx-x-circle'
  }[s] || 'bx bx-package';
}

function custById(id) {
  return customers.find(c => c.id === id) || { name: 'Guest', email: '—', phone: '—', city: '—' };
}

function customerStats(id) {
  const l = orderHistory.filter(o => o.customerId === id && o.status !== 'cancelled');
  return { orders: l.length, spent: l.reduce((s, o) => s + o.total, 0) };
}

function registerCustomer(u) {
  let c = customers.find(x => x.email && u.email && x.email.toLowerCase() === u.email.toLowerCase());
  if (!c) {
    c = {
      id: 'c-' + Date.now(),
      name: u.name || 'Guest',
      email: u.email || '',
      phone: u.phone || '',
      city: 'Amman',
      joined: new Date().toISOString().split('T')[0],
      tier: 'new'
    };
    customers.push(c);
  } else if (u.phone) {
    c.phone = u.phone;
  }
  return c;
}

function validateJordanPhone(p) {
  const c = p.replace(/\D/g, '');
  return (c.length === 9 && c.startsWith('7')) ||
         (c.length === 10 && c.startsWith('07')) ||
         (c.length === 12 && c.startsWith('9627'));
}

function isOwnerPhone(p) {
  return OWNER_PHONE_DIGITS.includes((p || '').replace(/\D/g, ''));
}

/* =====================================================
   10. PERSISTENCE
   ===================================================== */
function saveAll() {
  try {
    localStorage.setItem(LS_KEYS.products, JSON.stringify(products));
    localStorage.setItem(LS_KEYS.offers, JSON.stringify(offers));
    localStorage.setItem(LS_KEYS.gallery, JSON.stringify(galleryImages));
    localStorage.setItem(LS_KEYS.content, JSON.stringify(contentOverrides));
    localStorage.setItem(LS_KEYS.mixWeights, JSON.stringify(mixWeights));
    localStorage.setItem(LS_KEYS.mixPackaging, JSON.stringify(mixPackaging));
    localStorage.setItem(LS_KEYS.candyTypes, JSON.stringify(candyTypes));
    localStorage.setItem(LS_KEYS.deliveryZones, JSON.stringify(deliveryZones));
    localStorage.setItem(LS_KEYS.storeHours, JSON.stringify(storeHours));

    const ph = document.querySelector('[data-contact-phone]');
    const em = document.querySelector('[data-contact-email]');
    localStorage.setItem(LS_KEYS.contact, JSON.stringify({
      phone: ph ? ph.textContent : '',
      email: em ? em.textContent : ''
    }));
  } catch (e) { /* silent */ }
}

function loadAll() {
  try {
    const p = localStorage.getItem(LS_KEYS.products); if (p) products = JSON.parse(p);
    const o = localStorage.getItem(LS_KEYS.offers); if (o) offers = JSON.parse(o);
    const g = localStorage.getItem(LS_KEYS.gallery); if (g) galleryImages = JSON.parse(g);
    const mw = localStorage.getItem(LS_KEYS.mixWeights); if (mw) mixWeights = JSON.parse(mw);
    const mp = localStorage.getItem(LS_KEYS.mixPackaging); if (mp) mixPackaging = JSON.parse(mp);
    const ct = localStorage.getItem(LS_KEYS.candyTypes); if (ct) candyTypes = JSON.parse(ct);
    const dz = localStorage.getItem(LS_KEYS.deliveryZones); if (dz) deliveryZones = JSON.parse(dz);
    const sh = localStorage.getItem(LS_KEYS.storeHours); if (sh) storeHours = JSON.parse(sh);

    const c = localStorage.getItem(LS_KEYS.content);
    if (c) {
      contentOverrides = JSON.parse(c);
      Object.keys(contentOverrides).forEach(k => {
        const v = contentOverrides[k];
        if (I18N.en[k] !== undefined && v.en !== undefined) I18N.en[k] = v.en;
        if (I18N.ar[k] !== undefined && v.ar !== undefined) I18N.ar[k] = v.ar;
      });
    }

    const ct2 = localStorage.getItem(LS_KEYS.contact);
    if (ct2) {
      const obj = JSON.parse(ct2);
      const ph = document.querySelector('[data-contact-phone]');
      const em = document.querySelector('[data-contact-email]');
      if (obj.phone && ph) ph.textContent = obj.phone;
      if (obj.email && em) em.textContent = obj.email;
    }
  } catch (e) { /* silent */ }
}

/* =====================================================
   11. TOAST & PANELS
   ===================================================== */
function showToast(msg, icon = 'bx-check-circle') {
  const toast = $('toast');
  toast.querySelector('i').className = 'bx ' + icon;
  $('toastMessage').textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
}

let _savedScrollY = 0;

function lockBodyScroll() {
  _savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.classList.add('no-scroll');
}

function unlockBodyScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, _savedScrollY);
}

function openPanel(panel) {
  panel.classList.add('show');
  $('overlay').classList.add('show');
  lockBodyScroll();
  $('floatingSign').classList.add('hide');
}

function closeAllPanels() {
  $('cartPanel').classList.remove('show');
  $('loginPanel').classList.remove('show');
  $('overlay').classList.remove('show');
  unlockBodyScroll();
  $('floatingSign').classList.remove('hide');
}

/* =====================================================
   12. MIX PRICING
   ===================================================== */
function effectiveKgPrice(c) {
  const sale = Number(c.sale_price_per_kg) || 0;
  const base = Number(c.price_per_kg) || 0;
  return sale > 0 ? sale : base;
}

function calcMixPrice() {
  if (!mixState.weight || !mixState.packaging || !mixState.selectedTypes.length) return 0;
  const sel = mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)).filter(Boolean);
  if (!sel.length) return 0;
  const avg = sel.reduce((s, tp) => s + effectiveKgPrice(tp), 0) / sel.length;
  return (avg * (mixState.weight / 1000)) + (Number(mixState.packaging.extra) || 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    if (item.isMix) return sum + item.price * item.qty;
    const p = products.find(x => x.id === item.id) || offers.find(x => x.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

function getDeliveryFee() {
  if (cartDelivery.method === 'pickup') return 0;
  const z = deliveryZones.find(z => z.id === cartDelivery.zoneId);
  return z ? Number(z.price) : 0;
}

/* =====================================================
   13. RENDERERS — PUBLIC SITE
   ===================================================== */
function renderOffers() {
  const active = offers.filter(o => o.isActive);
  const el = $('offersGrid');
  if (!active.length) {
    el.innerHTML = `<div class="offers-empty"><i class='bx bx-time-five'></i><p>${t('offers.empty')}</p></div>`;
    return;
  }
  el.innerHTML = active.map(o => `
    <article class="offer-card reveal">
      <div class="offer-img-wrap">
        <span class="offer-sparkle"><i class='bx bxs-star'></i></span>
        <div class="offer-discount-ribbon"><i class='bx bxs-flame'></i> ${esc(L(o, 'discount') || '')}</div>
        <div class="offer-timer"><i class='bx bx-time-five'></i> ${esc(L(o, 'ends') || '')}</div>
        <img src="${esc(o.img)}" alt="${esc(L(o, 'name'))}">
      </div>
      <div class="offer-body">
        <span class="offer-category">${esc(L(o, 'category') || '')}</span>
        <h3 class="offer-title">${esc(L(o, 'name'))}</h3>
        <p class="offer-desc">${esc(L(o, 'desc') || '')}</p>
        <div class="offer-price-row">
          <span class="offer-new-price">$${Number(o.price).toFixed(2)}</span>
          <span class="offer-old-price">$${Number(o.oldPrice || o.price).toFixed(2)}</span>
          <span class="offer-save-badge">${t('offers.save')} $${Math.max(0, (Number(o.oldPrice || o.price) - Number(o.price))).toFixed(2)}</span>
        </div>
        <button class="offer-cta add-to-cart-btn" data-id="${esc(o.id)}"><i class='bx bx-cart-add'></i> ${t('offers.grab')}</button>
      </div>
    </article>`).join('');
}

function renderCandies() {
  $('candyGrid').innerHTML = products.map(p => `
    <div class="candy-card reveal">
      <div class="candy-card-img">
        <span class="candy-badge">${esc(L(p, 'badge') || '')}</span>
        <img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}">
      </div>
      <div class="candy-card-body">
        <h3>${esc(L(p, 'name'))}</h3>
        <p>${esc(L(p, 'desc') || '')}</p>
        <div class="candy-price-row">
          <span class="price">$${Number(p.price).toFixed(2)}${p.oldPrice ? `<s>$${Number(p.oldPrice).toFixed(2)}</s>` : ''}</span>
          <button class="add-to-cart-btn" data-id="${esc(p.id)}"><i class='bx bx-cart-add'></i> ${t('candies.add')}</button>
        </div>
      </div>
    </div>`).join('');
}

function renderGallery() {
  $('galleryGrid').innerHTML = galleryImages.map(g =>
    `<div class="gallery-item reveal"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"></div>`
  ).join('');
}

function renderMixWeights() {
  const el = $('mixWeightGrid');
  el.classList.toggle('compact', mixWeights.length > 8);
  el.innerHTML = mixWeights.map(w => {
    const sel = mixState.weight === w;
    let tag = '';
    if (w === 500) tag = `<span class="mix-weight-tag">${t('mix.halfKilo')}</span>`;
    else if (w === 1000) tag = `<span class="mix-weight-tag">${t('mix.fullKilo')}</span>`;
    else if (w === 100) tag = `<span class="mix-weight-tag">${t('mix.min')}</span>`;
    const label = w === 1000 ? t('mix.kilogram') : t('mix.gramsLabel', { w });
    return `<div class="mix-weight-pill ${sel ? 'selected' : ''}" data-weight="${w}">${tag}<div class="mix-weight-amount">${w}<small style="font-size:0.55em;">${t('mix.unitG')}</small></div><div class="mix-weight-label">${label}</div></div>`;
  }).join('');
}

function renderMixPackaging() {
  $('mixPackGrid').innerHTML = mixPackaging.map(p => {
    const sel = mixState.packaging && mixState.packaging.id === p.id;
    const price = Number(p.extra) === 0 ? t('mix.free') : `+$${Number(p.extra).toFixed(2)}`;
    const visual = p.img
      ? `<img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}">`
      : `<i class='bx ${p.icon || 'bx-box'}'></i>`;
    return `<div class="mix-pack-card ${sel ? 'selected' : ''}" data-pack="${esc(p.id)}"><div class="mix-pack-icon">${visual}</div><div class="mix-pack-name">${esc(L(p, 'name'))}</div><div class="mix-pack-desc">${esc(L(p, 'desc') || '')}</div><div class="mix-pack-price ${Number(p.extra) === 0 ? 'free' : ''}">${price}</div></div>`;
  }).join('');
}

function renderMixSlots() {
  const slots = [];
  for (let i = 0; i < mixState.typesCount; i++) {
    const id = mixState.selectedTypes[i];
    const tp = id ? candyTypes.find(c => c.id === id) : null;
    slots.push(`<div class="mix-slot"><div class="mix-slot-num">${i + 1}</div><div class="mix-slot-info"><div class="mix-slot-label">${t('mix.type')} ${i + 1}</div><div class="mix-slot-value ${tp ? '' : 'empty'}">${tp ? `<span class="mix-type-color" style="background:${tp.color};"></span>${esc(L(tp, 'name'))}` : t('mix.tapToChoose')}</div></div></div>`);
  }
  $('mixSlots').innerHTML = slots.join('');
}

function renderMixTypesGrid() {
  const sel = new Set(mixState.selectedTypes);
  $('mixTypesGrid').innerHTML = candyTypes.map(c => {
    const isSel = sel.has(c.id);
    const sale = Number(c.sale_price_per_kg) || 0;
    const base = Number(c.price_per_kg) || 0;
    const hasSale = sale > 0 && sale < base;
    const priceHtml = hasSale
      ? `<span class="mix-type-price discounted">$${base.toFixed(2)}</span><span class="mix-type-sale">$${sale.toFixed(2)}/kg</span>`
      : `<span class="mix-type-price">$${base.toFixed(2)}/kg</span>`;
    return `<div class="mix-type-card ${isSel ? 'selected' : ''}" data-type="${c.id}"><img class="mix-type-img" src="${esc(c.img)}" alt="${esc(L(c, 'name'))}"><div class="mix-type-info"><div class="mix-type-name"><span class="mix-type-color" style="background:${c.color};"></span>${esc(L(c, 'name'))}</div><div class="mix-type-price-wrap">${priceHtml}</div></div></div>`;
  }).join('');
}

function renderMixReview() {
  const p = mixState.packaging;
  const total = calcMixPrice();
  const sel = mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)).filter(Boolean);
  const avg = sel.length ? sel.reduce((s, tp) => s + effectiveKgPrice(tp), 0) / sel.length : 0;
  const candyCost = avg * (mixState.weight / 1000);
  const packExtra = p ? Number(p.extra) || 0 : 0;

  $('mixReview').innerHTML = `
    <div class="mix-review-hero"><i class='bx bxs-magic-wand'></i><h3>${t('mix.yourMix')}</h3><p>${t('mix.readyToAdd')}</p></div>
    <div class="mix-review-grid">
      <div class="mix-review-card"><div class="label">${t('mix.weight')}</div><div class="value">${mixState.weight} ${t('mix.unitG')}</div></div>
      <div class="mix-review-card"><div class="label">${t('mix.packaging')}</div><div class="value" style="font-size:1.15rem;">${p ? esc(L(p, 'name')) : '—'}</div></div>
      <div class="mix-review-card"><div class="label">${t('mix.candyTypes')}</div><div class="value">${mixState.selectedTypes.length}</div></div>
    </div>
    <div class="mix-review-types">
      <div class="label">${t('mix.candySelection')}</div>
      <div class="mix-review-types-list">
        ${sel.map(c => {
          const sale = Number(c.sale_price_per_kg) || 0;
          const base = Number(c.price_per_kg) || 0;
          const priceTxt = (sale > 0 && sale < base) ? `$${sale.toFixed(2)}/kg` : `$${base.toFixed(2)}/kg`;
          return `<span class="mix-review-type-chip"><span class="dot" style="background:${c.color};"></span>${esc(L(c, 'name'))} · ${priceTxt}</span>`;
        }).join('')}
      </div>
    </div>
    <div class="mix-review-total">
      <div>
        <div class="mix-review-total-label">${t('mix.candy')} (${mixState.weight}${t('mix.unitG')})</div>
        <div class="mix-review-sub">$${candyCost.toFixed(2)} <span style="font-size:0.72rem;opacity:.7;">($${avg.toFixed(2)}/kg)</span></div>
        ${packExtra > 0 ? `<div class="mix-review-total-label" style="margin-top:8px;">${esc(L(p, 'name'))}</div><div class="mix-review-sub">+ $${packExtra.toFixed(2)}</div>` : ''}
      </div>
      <div class="mix-review-total-right"><div class="mix-review-total-label">${t('mix.total')}</div><div class="mix-review-total-value">$${total.toFixed(2)}</div></div>
    </div>`;
}

function updateMixStep() {
  document.querySelectorAll('.mix-progress-step').forEach(s => {
    const step = parseInt(s.dataset.step);
    s.classList.toggle('active', step === mixState.step);
    s.classList.toggle('done', step < mixState.step);
  });
  document.querySelectorAll('.mix-progress-line').forEach((line, i) =>
    line.classList.toggle('done', i + 1 < mixState.step)
  );
  document.querySelectorAll('.mix-pane').forEach(p =>
    p.classList.toggle('active', parseInt(p.dataset.pane) === mixState.step)
  );

  $('mixBackBtn').disabled = mixState.step === 1;
  const nextIcon = lang === 'ar' ? 'bx-left-arrow-alt' : 'bx-right-arrow-alt';
  const nextBtn = $('mixNextBtn');

  if (mixState.step === 4) {
    nextBtn.innerHTML = `<i class='bx bx-cart-add'></i> <span>${t('mix.addToCart')}</span>`;
    nextBtn.classList.add('grab');
  } else {
    nextBtn.innerHTML = `<span>${t('mix.next')}</span> <i class='bx ${nextIcon}'></i>`;
    nextBtn.classList.remove('grab');
  }

  if (mixState.step === 1) nextBtn.disabled = !mixState.weight;
  else if (mixState.step === 2) nextBtn.disabled = !mixState.packaging;
  else if (mixState.step === 3) nextBtn.disabled = mixState.selectedTypes.filter(Boolean).length < mixState.typesCount;
  else nextBtn.disabled = false;
}

function goToMixStep(step) {
  mixState.step = step;
  if (step === 3) {
    renderMixSlots();
    renderMixTypesGrid();
    $('mixCountNumber').textContent = mixState.typesCount;
    $('mixCountMinus').disabled = mixState.typesCount <= 1;
    $('mixCountPlus').disabled = mixState.typesCount >= 6;
  }
  if (step === 4) renderMixReview();
  updateMixStep();
  document.querySelector('.mix-body').scrollTop = 0;
}

function openMixModal() {
  mixState.step = 1;
  mixState.weight = null;
  mixState.packaging = null;
  mixState.typesCount = 1;
  mixState.selectedTypes = [];
  renderMixWeights();
  renderMixPackaging();
  renderMixSlots();
  renderMixTypesGrid();
  renderMixReview();
  updateMixStep();
  $('mixModal').classList.add('show');
  lockBodyScroll();
  $('floatingSign').classList.add('hide');
}

function closeMixModal() {
  $('mixModal').classList.remove('show');
  if (!$('cartPanel').classList.contains('show') &&
      !$('loginPanel').classList.contains('show') &&
      !$('accountPage').classList.contains('show') &&
      !$('adminPage').classList.contains('show') &&
      !$('ownerPage').classList.contains('show')) {
    unlockBodyScroll();
    $('floatingSign').classList.remove('hide');
  }
}

/* =====================================================
   14. PAYMENT UTILITIES
   ===================================================== */
function detectCardBrand(num) {
  const n = (num || '').replace(/\s/g, '');
  if (/^4/.test(n)) return { brand: 'Visa', icon: 'bxl-visa' };
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { brand: 'Mastercard', icon: 'bxl-mastercard' };
  if (/^3[47]/.test(n)) return { brand: 'Amex', icon: 'bxl-paypal' };
  return { brand: '', icon: 'bx-credit-card-front' };
}

function formatCardNumber(v) {
  const n = (v || '').replace(/\D/g, '').slice(0, 16);
  return n.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v) {
  let n = (v || '').replace(/\D/g, '').slice(0, 4);
  if (n.length >= 3) n = n.slice(0, 2) + '/' + n.slice(2);
  return n;
}

function validateExpiry(v) {
  const m = v.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mo = parseInt(m[1]);
  const yr = parseInt(m[2]);
  if (mo < 1 || mo > 12) return false;
  const now = new Date();
  const curYr = now.getFullYear() % 100;
  const curMo = now.getMonth() + 1;
  return yr > curYr || (yr === curYr && mo >= curMo);
}

function validateCardNumber(num) {
  const n = (num || '').replace(/\s/g, '');
  if (n.length < 13 || n.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function renderPaymentSection() {
  const body = $('paymentBody');
  if (!body) return;

  document.querySelectorAll('.payment-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.payment === cartPayment.method)
  );

  if (cartPayment.method === 'cash') {
    body.innerHTML = `<div class="payment-cash-note"><i class='bx bx-money'></i><div><strong>${t('pay.cashTitle')}</strong><span>${t('pay.cashText')}</span></div></div>`;
    return;
  }

  const c = cartPayment.card;
  const brand = detectCardBrand(c.number);
  const usingSavedCard = !!(c.savedId && savedCards.some(sc => sc.id === c.savedId));

  const savedHtml = savedCards.length ? `
    <div class="saved-cards">
      <div class="saved-cards-title"><i class='bx bx-credit-card'></i> ${lang === 'ar' ? 'بطاقاتك المحفوظة' : 'Your saved cards'}</div>
      ${savedCards.map(sc => {
        const icon = sc.brand === 'Visa' ? 'bxl-visa'
          : sc.brand === 'Mastercard' ? 'bxl-mastercard'
          : 'bx-credit-card-front';
        return `
          <div class="saved-card ${c.savedId === sc.id ? 'selected' : ''}" data-saved-card="${sc.id}" role="button" tabindex="0">
            <i class='bx ${icon}'></i>
            <div class="saved-card-info">
              <strong>•••• ${sc.last4}</strong>
              <span>${esc(sc.name)} · ${esc(sc.expiry)}</span>
            </div>
            <button class="saved-card-del" data-del-card="${sc.id}" aria-label="Delete card"><i class='bx bx-trash'></i></button>
          </div>`;
      }).join('')}
      <button type="button" class="saved-card-new" id="newCardBtn">
        <i class='bx bx-plus'></i> ${lang === 'ar' ? 'استخدام بطاقة جديدة' : 'Use a new card'}
      </button>
    </div>` : '';

  body.innerHTML = `
    ${savedHtml}
    <div class="card-form" id="cardFormEl" style="${usingSavedCard ? 'display:none;' : ''}">
      ${brand.brand ? `<span class="card-brand-hint"><i class='bx ${brand.icon}'></i> ${brand.brand}</span>` : ''}
      <div class="card-field">
        <label>${t('pay.cardNumber')}</label>
        <input type="text" inputmode="numeric" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" autocomplete="cc-number" value="${esc(c.number)}">
        <i class='bx ${brand.icon} card-icon'></i>
      </div>
      <div class="card-field">
        <label>${t('pay.cardName')}</label>
        <input type="text" id="cardName" placeholder="AHMAD AL-RASHID" maxlength="40" autocomplete="cc-name" value="${esc(c.name)}" style="text-transform:uppercase;padding-right:14px;">
      </div>
      <div class="card-field-row">
        <div class="card-field"><label>${t('pay.cardExpiry')}</label><input type="text" inputmode="numeric" id="cardExpiry" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp" value="${esc(c.expiry)}" style="padding-right:14px;"></div>
        <div class="card-field"><label>${t('pay.cardCvv')}</label><input type="text" inputmode="numeric" id="cardCvv" placeholder="123" maxlength="4" autocomplete="cc-csc" value="${esc(c.cvv)}" style="padding-right:14px;"></div>
      </div>
      <label class="save-card-row">
        <input type="checkbox" id="saveCardChk" ${c.save ? 'checked' : ''}>
        <span>${lang === 'ar' ? 'حفظ البطاقة لهذا الحساب' : 'Save this card to my account'}</span>
      </label>
      <div class="card-secure"><i class='bx bx-lock-alt'></i> ${t('pay.cardSecure')}</div>
    </div>`;

  wireCardFormEvents(body);
}

function wireCardFormEvents(body) {
  body.querySelectorAll('[data-saved-card]').forEach(el => {
    const activate = (e) => {
      if (e.target.closest('[data-del-card]')) return;
      const id = el.dataset.savedCard;
      const sc = savedCards.find(x => x.id === id);
      if (!sc) return;
      cartPayment.card = {
        number: '•••• ' + sc.last4,
        name: sc.name,
        expiry: sc.expiry,
        cvv: '',
        savedId: sc.id,
        save: false
      };
      renderPaymentSection();
    };
    el.addEventListener('click', activate);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(e); }
    });
  });

  body.querySelectorAll('[data-del-card]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.delCard;
      removeSavedCard(id);
      if (cartPayment.card.savedId === id) {
        cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
      }
      renderPaymentSection();
      showToast(lang === 'ar' ? 'تم حذف البطاقة' : 'Card removed', 'bx-trash');
    });
  });

  const newBtn = body.querySelector('#newCardBtn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
      renderPaymentSection();
    });
  }

  const numEl = $('cardNumber');
  const nameEl = $('cardName');
  const expEl = $('cardExpiry');
  const cvvEl = $('cardCvv');
  const saveChk = $('saveCardChk');

  if (!numEl) return;

  if (saveChk) {
    saveChk.addEventListener('change', () => { cartPayment.card.save = saveChk.checked; });
  }

  numEl.addEventListener('input', (e) => {
    e.target.value = formatCardNumber(e.target.value);
    cartPayment.card.number = e.target.value;

    const b = detectCardBrand(e.target.value);
    const iconEl = e.target.parentElement.querySelector('.card-icon');
    if (iconEl) iconEl.className = `bx ${b.icon} card-icon`;

    const parent = e.target.parentElement.parentElement;
    const oldHint = parent.querySelector('.card-brand-hint');
    if (oldHint) oldHint.remove();
    if (b.brand) {
      const hint = document.createElement('span');
      hint.className = 'card-brand-hint';
      hint.innerHTML = `<i class='bx ${b.icon}'></i> ${b.brand}`;
      parent.insertBefore(hint, e.target.parentElement);
    }

    e.target.classList.toggle('invalid', e.target.value && !validateCardNumber(e.target.value));
  });

  nameEl.addEventListener('input', (e) => { cartPayment.card.name = e.target.value; });

  expEl.addEventListener('input', (e) => {
    e.target.value = formatExpiry(e.target.value);
    cartPayment.card.expiry = e.target.value;
    e.target.classList.toggle('invalid', e.target.value.length === 5 && !validateExpiry(e.target.value));
  });

  cvvEl.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    cartPayment.card.cvv = e.target.value;
  });
}

/* =====================================================
   15. CART RENDERERS
   ===================================================== */
function renderDeliverySection() {
  const body = $('deliveryBody');
  document.querySelectorAll('.delivery-toggle-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.deliveryMethod === cartDelivery.method)
  );

  if (cartDelivery.method === 'pickup') {
    body.innerHTML = `<div class="delivery-pickup-info"><i class='bx bx-store'></i><div><strong>${t('delivery.pickupTitle')}</strong><span>${t('delivery.pickupAddress')}<br>${t('delivery.pickupHours')}</span></div></div>`;
    return;
  }

  const active = deliveryZones.filter(z => z.active);
  if (!active.length) {
    body.innerHTML = `<div class="delivery-empty">${t('delivery.noZones')}</div>`;
    return;
  }

  body.innerHTML = `<label>${t('delivery.zone')}</label><select class="delivery-select" id="deliveryZoneSelect"><option value="">${t('delivery.selectZone')}</option>${active.map(z => `<option value="${z.id}" ${cartDelivery.zoneId === z.id ? 'selected' : ''}>${esc(L(z, 'name'))} — $${Number(z.price).toFixed(2)}</option>`).join('')}</select>${cartDelivery.zoneId ? (function () { const z = deliveryZones.find(x => x.id === cartDelivery.zoneId); return z ? `<div class="delivery-fee-row"><span>${t('delivery.fee')}</span><span class="fee-value">$${Number(z.price).toFixed(2)}</span></div>` : ''; })() : ''}`;

  const sel = $('deliveryZoneSelect');
  if (sel) {
    sel.addEventListener('change', (e) => {
      cartDelivery.zoneId = e.target.value || null;
      renderCart();
    });
  }
}

function renderCart() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  $('cartBadge').textContent = totalQty;
  $('cartBadge').classList.toggle('show', totalQty > 0);
  $('cartItemCount').textContent = totalQty === 1 ? `1 ${t('cart.item')}` : `${totalQty} ${t('cart.items')}`;

  const paySec = $('paymentSection');

  if (cart.length === 0) {
    $('cartItems').innerHTML = `<div class="cart-empty"><i class='bx bx-shopping-bag'></i><p>${t('cart.empty')}</p></div>`;
    $('cartTotal').textContent = '$0.00';
    $('deliverySection').style.display = 'none';
    if (paySec) paySec.style.display = 'none';
    const footer = document.querySelector('.cart-footer');
    const extra = footer.querySelector('.cart-extra-rows');
    if (extra) extra.innerHTML = '';
    return;
  }

  $('deliverySection').style.display = 'block';
  if (paySec) paySec.style.display = 'block';

  $('cartItems').innerHTML = cart.map(item => {
    if (item.isMix) {
      const typesList = item.types.map(x => L(x, 'name')).join(' • ');
      return `<div class="cart-item" data-id="${item.id}"><div class="cart-item-img"><img src="${item.img}" alt="${t('mix.customMix')}"></div><div class="cart-item-info"><h4>${t('cart.customMix')}</h4><div class="item-meta">${item.weight}${t('mix.unitG')} • ${esc(L(item.packaging, 'name'))}<br>${esc(typesList)}</div><span class="item-price">$${(item.price * item.qty).toFixed(2)}</span><div class="cart-item-controls"><button class="qty-btn" data-action="dec" data-id="${item.id}">−</button><span class="qty-value">${item.qty}</span><button class="qty-btn" data-action="inc" data-id="${item.id}">+</button></div></div><button class="item-remove" data-action="remove" data-id="${item.id}"><i class='bx bx-trash'></i></button></div>`;
    }

    const p = products.find(x => x.id === item.id) || offers.find(x => x.id === item.id);
    if (!p) return '';
    return `<div class="cart-item" data-id="${p.id}"><div class="cart-item-img"><img src="${p.img}" alt="${esc(L(p, 'name'))}"></div><div class="cart-item-info"><h4>${esc(L(p, 'name'))}</h4><span class="item-price">$${(p.price * item.qty).toFixed(2)}</span><div class="cart-item-controls"><button class="qty-btn" data-action="dec" data-id="${p.id}">−</button><span class="qty-value">${item.qty}</span><button class="qty-btn" data-action="inc" data-id="${p.id}">+</button></div></div><button class="item-remove" data-action="remove" data-id="${p.id}"><i class='bx bx-trash'></i></button></div>`;
  }).join('');

  renderDeliverySection();
  renderPaymentSection();

  const subtotal = getCartSubtotal();
  const fee = getDeliveryFee();
  const total = subtotal + fee;

  const footer = document.querySelector('.cart-footer');
  let extra = footer.querySelector('.cart-extra-rows');
  if (!extra) {
    extra = document.createElement('div');
    extra.className = 'cart-extra-rows';
    footer.insertBefore(extra, footer.firstChild);
  }
  extra.innerHTML = `
    <div class="cart-subtotal-row"><span>${t('delivery.subtotal')}</span><span class="sub-value">$${subtotal.toFixed(2)}</span></div>
    <div class="cart-delivery-row"><span>${t('delivery.feeLabel')} ${cartDelivery.method === 'pickup' ? `(${t('delivery.pickup')})` : ''}</span><span class="sub-value">$${fee.toFixed(2)}</span></div>`;
  $('cartTotal').textContent = '$' + total.toFixed(2);
}

function addToCart(id) {
  const e = cart.find(i => i.id === id);
  if (e) e.qty += 1;
  else cart.push({ id, qty: 1 });
  renderCart();
  const p = products.find(x => x.id === id) || offers.find(x => x.id === id);
  if (p) showToast(t('toast.added', { name: L(p, 'name') }), 'bx-cart-add');
}

function increaseQty(id) {
  const i = cart.find(c => c.id === id);
  if (i) { i.qty++; renderCart(); }
}

function decreaseQty(id) {
  const i = cart.find(c => c.id === id);
  if (!i) return;
  if (i.qty > 1) i.qty -= 1;
  else cart = cart.filter(c => c.id !== id);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  showToast(t('toast.removed'), 'bx-trash');
}

/* =====================================================
   16. MOBILE ACCOUNT UI
   ===================================================== */
function updateMobileAccountUI() {
  const btn = $('mobileAccountBtn');
  const nameEl = $('mobileAccountName');
  const av = $('mobileUserAvatar');
  if (!btn) return;

  if (currentUser) {
    btn.classList.add('signed-in');
    nameEl.textContent = currentUser.name || currentUser.email || 'My Account';
    const initial = (currentUser.name || currentUser.email || 'H').charAt(0).toUpperCase();
    av.innerHTML = isOwner
      ? "<i class='bx bx-code-alt'></i>"
      : (isAdmin ? "<i class='bx bx-shield-quarter'></i>" : initial);
  } else {
    btn.classList.remove('signed-in');
    nameEl.textContent = lang === 'ar' ? 'تسجيل الدخول / حسابي' : 'Sign In / My Account';
    av.innerHTML = "<i class='bx bx-user'></i>";
  }
}

/* =====================================================
   17. LOGIN FLOW
   ===================================================== */
function resetLoginPanel(mode = 'default') {
  $('loginFormWrapper').style.display = 'block';
  $('loginSuccess').classList.remove('show');
  $('loginForm').reset();
  resetGoogleSignInUI();

  if (mode === 'checkout') {
    checkoutIntent = true;
    $('loginTitle').textContent = t('login.almost');
    $('loginSubtitle').textContent = t('login.almostSub');
    $('loginCallout').style.display = 'flex';
  } else {
    checkoutIntent = false;
    $('loginTitle').textContent = t('login.welcome');
    $('loginSubtitle').textContent = t('login.subtitle');
    $('loginCallout').style.display = 'none';
  }
}

function onSignInSuccess(user) {
  isAdmin = false;
  isOwner = false;
  const c = registerCustomer(user);
  currentUser = { ...user, id: c.id, role: 'customer' };
  loadUserCards();

  $('loginFormWrapper').style.display = 'none';
  $('loginSuccess').classList.add('show');
  $('successMessage').textContent = checkoutIntent
    ? t('login.successSub')
    : t('login.successWelcome', { name: user.name || 'Sweet Friend' });
  $('loginBtn').classList.add('signed-in');
  $('userInitial').textContent = (user.name || user.email || 'H').charAt(0).toUpperCase();
  updateMobileAccountUI();

  setTimeout(() => {
    $('cartPanel').classList.remove('show');
    $('loginPanel').classList.remove('show');
    $('overlay').classList.remove('show');
    unlockBodyScroll();
    openAccountPage();
    if (checkoutIntent) {
      showToast(t('toast.signedInCheckout'), 'bx-party');
      checkoutIntent = false;
    } else {
      showToast(t('toast.welcome', { name: user.name || user.email }), 'bx-user-check');
    }
  }, 1400);
}

function signOutUser() {
  isAdmin = false;
  isOwner = false;
  currentUser = null;
  savedCards = [];
  $('loginBtn').classList.remove('signed-in');
  $('userInitial').textContent = 'H';
  updateMobileAccountUI();
  closeAccountPage();
  closeAdminPage();
  closeOwnerPage();
  showToast(t('toast.signedOut'), 'bx-log-out');
}

/* =====================================================
   18. ACCOUNT PAGE
   ===================================================== */
function openAccountPage() {
  if (!currentUser) return;
  $('accountAvatar').textContent = (currentUser.name || 'H').charAt(0).toUpperCase();
  $('accountName').textContent = currentUser.name || 'Hat Candy User';
  $('accountEmail').textContent = currentUser.email || '';
  $('accountPage').classList.add('show');
  lockBodyScroll();
  $('floatingSign').classList.add('hide');
  renderAccountPage();
  switchAccountTab(accountTab);
}

function closeAccountPage() {
  $('accountPage').classList.remove('show');
  if (!$('cartPanel').classList.contains('show') &&
      !$('loginPanel').classList.contains('show') &&
      !$('mixModal').classList.contains('show') &&
      !$('adminPage').classList.contains('show') &&
      !$('ownerPage').classList.contains('show')) {
    unlockBodyScroll();
    $('floatingSign').classList.remove('hide');
  }
}

function switchAccountTab(tab) {
  accountTab = tab;
  document.querySelectorAll('#accountPage .account-tab').forEach(x =>
    x.classList.toggle('active', x.dataset.tab === tab)
  );
  document.querySelectorAll('#accountPage .account-pane').forEach(p =>
    p.classList.toggle('active', p.dataset.pane === tab)
  );
}

function renderAccountPage() {
  const orders = getUserOrders();
  const active = orders.filter(o => ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)).length;

  $('ordersCount').textContent = orders.length;
  $('trackingCount').textContent = active;
  $('accountAddressCount').textContent = savedAddresses.length + ' ' + t('account.savedAddresses');

  renderAccountNotice();
  renderAccountStats();
  renderOrders();
  renderTracking();
  renderAddresses();
}

function renderAccountNotice() {
  const el = $('accountNotice');
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  if (qty > 0) {
    el.innerHTML = `<div class="account-notice"><i class='bx bxs-cart'></i><div class="account-notice-text">${t('account.cartNotice', { n: qty })}</div><button id="accountGoCart">${t('account.goToCart')}</button></div>`;
    $('accountGoCart').addEventListener('click', () => {
      closeAccountPage();
      setTimeout(() => openPanel($('cartPanel')), 300);
    });
  } else {
    el.innerHTML = '';
  }
}

function renderAccountStats() {
  const s = getUserStats();
  $('accountStats').innerHTML = `
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-receipt'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.total}</div><div class="account-stat-label">${t('account.statTotal')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-package'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.active}</div><div class="account-stat-label">${t('account.statActive')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-check-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.delivered}</div><div class="account-stat-label">${t('account.statDelivered')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-dollar-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">$${s.spent.toFixed(2)}</div><div class="account-stat-label">${t('account.statSpent')}</div></div></div>`;
}

function renderOrders() {
  const list = $('ordersList');
  const myOrders = getUserOrders();

  if (!myOrders.length) {
    list.innerHTML = `<div class="account-empty"><i class='bx bx-receipt'></i><h3>${t('account.noOrders')}</h3><p>${t('account.noOrdersSub')}</p><a href="#candies" class="btn btn-primary" id="emptyShopBtn">${t('account.shopNow')}</a></div>`;
    $('emptyShopBtn').addEventListener('click', closeAccountPage);
    return;
  }

  list.innerHTML = myOrders.map(o => `
    <div class="order-card">
      <div class="order-head">
        <div><div class="order-id">${t('account.orderId')} ${o.id}</div><div class="order-date">${formatDate(o.date)}</div></div>
        <span class="order-status status-${o.status}"><i class='${statusIcon(o.status)}'></i> ${t('account.status_' + o.status)}</span>
      </div>
      <div class="order-items">${o.itemsList.map(it => `<div class="order-item"><div><span class="order-item-name">${lang === 'ar' && it.name_ar ? it.name_ar : it.name}</span><span class="order-item-qty">× ${it.qty}</span></div><span class="order-item-price">$${(it.price * it.qty).toFixed(2)}</span></div>`).join('')}</div>
      <div class="order-foot">
        <div><div class="order-total-label">${t('account.orderTotal')}</div><div class="order-total-value">$${o.total.toFixed(2)}</div></div>
        <div class="order-actions">
          ${o.tracking ? `<button class="order-action-btn ghost" data-track="${o.id}"><i class='bx bx-package'></i> ${t('account.trackOrder')}</button>` : ''}
          <button class="order-action-btn primary" data-reorder="${o.id}"><i class='bx bx-refresh'></i> ${t('account.reorder')}</button>
        </div>
      </div>
    </div>`).join('');
}

function renderTracking() {
  const list = $('trackingList');
  const tracked = getUserOrders().filter(o => ['packing', 'shipped', 'out_for_delivery', 'delivered'].includes(o.status));

  if (!tracked.length) {
    list.innerHTML = `<div class="account-empty"><i class='bx bx-package'></i><h3>${t('account.noTracking')}</h3><p>${t('account.noTrackingSub')}</p></div>`;
    return;
  }

  const idx = { processing: 1, packing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };

  list.innerHTML = tracked.map(o => {
    const cur = idx[o.status] || 1;
    const steps = [
      { icon: 'bx bx-check', label: t('account.stepPlaced'), time: o.placedAt },
      { icon: 'bx bx-cog', label: t('account.stepProcessing'), time: o.placedAt },
      { icon: 'bx bx-archive', label: t('account.stepPacking'), time: o.packedAt },
      { icon: 'bx bx-package', label: t('account.stepShipped'), time: o.shippedAt },
      { icon: 'bx bx-cycling', label: t('account.stepOut'), time: o.outAt },
      { icon: 'bx bx-home-smile', label: t('account.stepDelivered'), time: o.deliveredAt }
    ];
    const qty = o.itemsList.reduce((s, i) => s + i.qty, 0);
    return `<div class="tracking-card"><div class="tracking-head"><div class="tracking-head-info"><h3>${t('account.trackingFor')} ${o.id}</h3><p>${formatDate(o.date)} • ${qty} ${qty === 1 ? t('cart.item') : t('cart.items')}</p></div><div class="tracking-num"><i class='bx bx-package'></i> ${o.tracking || '—'}</div></div><div class="tracking-timeline">${steps.map((s, i) => `<div class="tracking-step ${i <= cur ? 'done' : ''} ${i === cur && o.status !== 'delivered' ? 'current' : ''}"><div class="tracking-step-dot"><i class='${s.icon}'></i></div><div class="tracking-step-text"><div class="tracking-step-label">${s.label}</div><div class="tracking-step-time">${s.time ? formatDate(s.time) : ''}</div></div></div>`).join('')}</div><div class="tracking-foot"><div class="tracking-eta"><i class='bx bx-time-five'></i> ${t('account.eta')}: ${o.eta ? formatDate(o.eta) : '—'}</div><div>${t('account.deliveringTo')}: ${o.address}</div></div></div>`;
  }).join('');
}

function renderAddresses() {
  const grid = $('addressesGrid');
  const icons = { home: 'bx-home', work: 'bx-briefcase', other: 'bx-map-pin' };
  const labels = { home: t('account.labelHome'), work: t('account.labelWork'), other: t('account.labelOther') };

  grid.innerHTML = savedAddresses.map(a => `
    <div class="address-card ${a.isDefault ? 'is-default' : ''}">
      ${a.isDefault ? `<span class="address-default-badge">${t('account.default')}</span>` : ''}
      <span class="address-label ${a.label}"><i class='bx ${icons[a.label]}'></i> ${labels[a.label]}</span>
      <div class="address-name">${esc(a.name)}</div>
      <div class="address-line"><i class='bx bx-phone'></i> <span>${esc(a.phone)}</span></div>
      <div class="address-line"><i class='bx bx-map'></i> <span>${esc(a.city)}, ${esc(a.area)} — ${esc(a.line)}</span></div>
      <div class="address-actions">
        <button class="address-btn edit" data-edit-address="${a.id}"><i class='bx bx-edit'></i> ${t('account.edit')}</button>
        ${!a.isDefault ? `<button class="address-btn setdefault" data-default-address="${a.id}"><i class='bx bx-check-circle'></i> ${t('account.setDefault')}</button>` : ''}
        <button class="address-btn delete" data-delete-address="${a.id}"><i class='bx bx-trash'></i> ${t('account.delete')}</button>
      </div>
    </div>`).join('') +
    `<div class="address-add-card" id="addAddressBtn"><div class="address-add-icon"><i class='bx bx-plus'></i></div><span>${t('account.addNew')}</span></div>`;

  $('addAddressBtn').addEventListener('click', () => showAddressForm());
}

function showAddressForm(id) {
  const form = $('addressForm');
  const el = $('addressFormEl');
  el.reset();
  $('addressId').value = '';

  if (id) {
    const a = savedAddresses.find(x => x.id === id);
    if (a) {
      $('addressFormTitle').textContent = t('account.editAddressTitle');
      $('addressId').value = a.id;
      $('addressLabelInput').value = a.label;
      $('addressNameInput').value = a.name;
      $('addressPhoneInput').value = a.phone;
      $('addressCityInput').value = a.city;
      $('addressAreaInput').value = a.area;
      $('addressLineInput').value = a.line;
    }
  } else {
    $('addressFormTitle').textContent = t('account.addAddressTitle');
  }

  form.classList.add('show');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAddressForm() {
  $('addressForm').classList.remove('show');
  $('addressFormEl').reset();
}

/* =====================================================
   19. ADMIN PANEL
   ===================================================== */
function signInAsAdmin() {
  isAdmin = true;
  isOwner = false;
  currentUser = { id: 'admin', name: 'Store Admin', email: ADMIN_EMAIL, role: 'admin' };
  $('loginFormWrapper').style.display = 'none';
  $('loginSuccess').classList.add('show');
  $('successMessage').textContent = t('login.successSub');
  $('loginBtn').classList.add('signed-in');
  $('userInitial').textContent = 'A';
  updateMobileAccountUI();
  setTimeout(() => {
    closeAllPanels();
    openAdminPage();
    showToast(t('toast.adminWelcome'), 'bx-shield-quarter');
  }, 900);
}

function openAdminPage() {
  if (!isAdmin) return;
  $('adminToday').textContent = formatDate(new Date().toISOString().split('T')[0]);
  $('adminClock').textContent = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  $('adminPage').classList.add('show');
  lockBodyScroll();
  $('floatingSign').classList.add('hide');
  renderAdmin();
  switchAdminTab(adminTab);
}

function closeAdminPage() {
  $('adminPage').classList.remove('show');
  if (!$('cartPanel').classList.contains('show') &&
      !$('loginPanel').classList.contains('show') &&
      !$('mixModal').classList.contains('show') &&
      !$('accountPage').classList.contains('show') &&
      !$('ownerPage').classList.contains('show')) {
    unlockBodyScroll();
    $('floatingSign').classList.remove('hide');
  }
}

function switchAdminTab(tab) {
  adminTab = tab;
  document.querySelectorAll('#adminPage .account-tab').forEach(x =>
    x.classList.toggle('active', x.dataset.atab === tab)
  );
  document.querySelectorAll('#adminPage .account-pane').forEach(p =>
    p.classList.toggle('active', p.dataset.apane === tab)
  );
}

function renderAdmin() {
  $('adminOrdersCount').textContent = orderHistory.length;
  $('adminCustomersCount').textContent = customers.length;
  $('adminMessagesCount').textContent = contactMessages.filter(m => !m.read).length;
  renderAdminKpis();
  renderAdminChart();
  renderAdminTopProducts();
  renderAdminRecentOrders();
  renderAdminOrders();
  renderAdminCustomers();
  renderAdminProducts();
  renderAdminMessages();
}

function renderAdminKpis() {
  const act = orderHistory.filter(o => o.status !== 'cancelled');
  const rev = act.reduce((s, o) => s + o.total, 0);
  const delRev = orderHistory.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const pend = orderHistory.filter(o => ['processing', 'packing'].includes(o.status)).length;
  const aov = act.length ? rev / act.length : 0;

  const cards = [
    { icon: 'bx-dollar-circle', value: '$' + rev.toFixed(2), label: t('admin.kpiRevenue') },
    { icon: 'bx-receipt', value: orderHistory.length, label: t('admin.kpiOrders') },
    { icon: 'bx-group', value: customers.length, label: t('admin.kpiCustomers') },
    { icon: 'bx-trending-up', value: '$' + aov.toFixed(2), label: t('admin.kpiAov') },
    { icon: 'bx-time-five', value: pend, label: t('admin.kpiPending') },
    { icon: 'bx-check-shield', value: '$' + delRev.toFixed(2), label: t('admin.kpiDelivered') }
  ];

  $('adminKpis').innerHTML = cards.map(c =>
    `<div class="kpi-card"><div class="kpi-icon"><i class='bx ${c.icon}'></i></div><div><div class="kpi-value">${c.value}</div><div class="kpi-label">${c.label}</div></div></div>`
  ).join('');
}

function renderAdminChart() {
  const map = {};
  orderHistory.filter(o => o.status !== 'cancelled').forEach(o => {
    map[o.date] = (map[o.date] || 0) + o.total;
  });

  const dates = Object.keys(map).sort().slice(-7);
  const data = dates.map(d => ({ date: d, value: map[d] }));
  const el = $('adminChartBars');

  if (!data.length) {
    el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`;
    return;
  }

  const max = Math.max(...data.map(d => d.value), 1);
  el.innerHTML = data.map(d => `
    <div class="admin-bar-col">
      <div class="admin-bar-value">$${d.value.toFixed(0)}</div>
      <div class="admin-bar-track"><div class="admin-bar" style="height:${Math.max(6, Math.round((d.value / max) * 130))}px"></div></div>
      <div class="admin-bar-label">${new Date(d.date).toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { day: '2-digit', month: 'short' })}</div>
    </div>`).join('');
}

function productSales() {
  const map = {};
  orderHistory.filter(o => o.status !== 'cancelled').forEach(o => o.itemsList.forEach(it => {
    if (!map[it.name]) map[it.name] = { name: it.name, name_ar: it.name_ar, qty: 0, revenue: 0 };
    map[it.name].qty += it.qty;
    map[it.name].revenue += it.qty * it.price;
  }));
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
}

function renderAdminTopProducts() {
  const list = productSales().slice(0, 5);
  const el = $('adminTopProducts');

  if (!list.length) {
    el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`;
    return;
  }

  const max = Math.max(...list.map(p => p.revenue), 1);
  el.innerHTML = list.map((p, i) => `
    <div class="admin-rank-item">
      <div class="admin-rank-num">${i + 1}</div>
      <div class="admin-rank-info">
        <div class="admin-rank-name">${esc(lang === 'ar' && p.name_ar ? p.name_ar : p.name)}</div>
        <div class="admin-rank-bar"><span style="width:${(p.revenue / max) * 100}%"></span></div>
      </div>
      <div class="admin-rank-value">$${p.revenue.toFixed(2)}</div>
    </div>`).join('');
}

function orderRowHtml(o, compact) {
  const c = custById(o.customerId);
  const items = o.itemsList.map(i => `${lang === 'ar' && i.name_ar ? i.name_ar : i.name} ×${i.qty}`).join(' • ');
  const pay = (o.payment === 'cod' || o.payment === 'cash') ? t('admin.payCod') : t('admin.payCard');

  return `<tr>
    <td><strong>${o.id}</strong><div class="admin-sub">${formatDate(o.date)}</div></td>
    <td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email || '')}</div></div></div></td>
    <td><div class="admin-items">${esc(items)}</div></td>
    <td><strong>$${o.total.toFixed(2)}</strong><div class="admin-sub">${pay}</div></td>
    <td><span class="order-status status-${o.status}"><i class='${statusIcon(o.status)}'></i> ${t('account.status_' + o.status)}</span></td>
    ${compact ? '' : `<td><select class="admin-status-select" data-status-order="${o.id}">${['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${t('account.status_' + s)}</option>`).join('')}</select></td><td><div class="admin-row-actions"><button class="admin-mini-btn primary" data-advance="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-right-arrow-alt'></i> ${t('admin.advance')}</button><button class="admin-mini-btn danger" data-cancel-order="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-x'></i></button></div></td>`}
  </tr>`;
}

function renderAdminRecentOrders() {
  const recent = [...orderHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  $('adminRecentOrders').innerHTML = recent.map(o => orderRowHtml(o, true)).join('');
}

function renderAdminOrders() {
  const counts = { all: orderHistory.length };
  ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].forEach(s => {
    counts[s] = orderHistory.filter(o => o.status === s).length;
  });

  const filters = [
    ['all', t('admin.all')],
    ['processing', t('account.status_processing')],
    ['packing', t('account.status_packing')],
    ['shipped', t('account.status_shipped')],
    ['out_for_delivery', t('account.status_out_for_delivery')],
    ['delivered', t('account.status_delivered')],
    ['cancelled', t('account.status_cancelled')]
  ];

  $('adminOrderFilters').innerHTML = filters.map(([k, l]) =>
    `<button class="admin-filter ${adminOrderFilter === k ? 'active' : ''}" data-ofilter="${k}">${l} <span class="flt-count">${counts[k] || 0}</span></button>`
  ).join('');

  const rows = orderHistory
    .filter(o => adminOrderFilter === 'all' || o.status === adminOrderFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  $('adminOrdersBody').innerHTML = rows.length
    ? rows.map(o => orderRowHtml(o, false)).join('')
    : `<tr><td colspan="7"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
}

function renderAdminCustomers() {
  const q = adminCustomerSearch.toLowerCase();
  const list = customers.filter(c =>
    !q || (c.name + ' ' + c.email + ' ' + c.phone + ' ' + c.city).toLowerCase().includes(q)
  );

  const tierLabels = { vip: t('admin.tierVip'), active: t('admin.tierActive'), new: t('admin.tierNew') };

  $('adminCustomersBody').innerHTML = list.length ? list.map(c => {
    const st = customerStats(c.id);
    return `<tr>
      <td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email || '')}</div></div></div></td>
      <td>${esc(c.phone || '—')}</td>
      <td>${esc(c.city || '—')}</td>
      <td>${st.orders}</td>
      <td><strong>$${st.spent.toFixed(2)}</strong></td>
      <td><span class="admin-tier ${c.tier}">${tierLabels[c.tier] || c.tier}</span></td>
      <td>${formatDate(c.joined)}</td>
      <td><div class="admin-row-actions">
        <button class="admin-mini-btn ghost" data-view-customer="${c.id}"><i class='bx bx-show'></i></button>
        <button class="admin-mini-btn danger" data-del-customer="${c.id}"><i class='bx bx-trash'></i></button>
      </div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="8"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
}

function renderAdminProducts() {
  const sales = productSales();
  $('adminProductsBody').innerHTML = products.map(p => {
    const s = sales.find(x => x.name === p.name) || { qty: 0, revenue: 0 };
    const cls = p.stock > 20 ? 'in' : (p.stock > 0 ? 'low' : 'out');
    const lbl = p.stock > 20 ? t('admin.stockIn') : (p.stock > 0 ? t('admin.stockLow') : t('admin.stockOut'));
    return `<tr>
      <td><div class="admin-user"><img class="admin-prod-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(L(p, 'name'))}</div><div class="admin-sub">${esc(L(p, 'badge') || '')}</div></div></div></td>
      <td><strong>$${Number(p.price).toFixed(2)}</strong>${p.oldPrice ? `<div class="admin-sub"><s style="opacity:.6">$${Number(p.oldPrice).toFixed(2)}</s></div>` : ''}</td>
      <td>${s.qty} <span class="admin-sub">${t('admin.units')}</span></td>
      <td><strong>$${s.revenue.toFixed(2)}</strong></td>
      <td><span class="admin-stock ${cls}"><i class='bx bx-package'></i> ${lbl} (${p.stock})</span></td>
    </tr>`;
  }).join('');
}

function renderAdminMessages() {
  const el = $('adminMessagesList');
  if (!contactMessages.length) {
    el.innerHTML = `<div class="account-empty"><i class='bx bx-envelope'></i><h3>${t('admin.noMessages')}</h3><p>${t('admin.noMessagesSub')}</p></div>`;
    return;
  }
  el.innerHTML = contactMessages.map(m => `
    <div class="admin-msg ${m.read ? 'read' : ''}">
      <div class="admin-msg-head">
        <div class="admin-user"><div class="admin-user-avatar">${esc((m.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(m.name)}</div><div class="admin-sub">${esc(m.email)} • ${formatDate(m.date)}</div></div></div>
        <div class="admin-msg-actions">
          <button class="admin-mini-btn ghost" data-msg-read="${m.id}"><i class='bx ${m.read ? 'bx-envelope' : 'bx-check-double'}'></i> ${m.read ? t('admin.markUnread') : t('admin.markRead')}</button>
          <button class="admin-mini-btn danger" data-msg-delete="${m.id}"><i class='bx bx-trash'></i></button>
        </div>
      </div>
      <div class="admin-msg-body">${esc(m.message)}</div>
    </div>`).join('');
}

function setOrderStatus(id, status) {
  const o = orderHistory.find(x => x.id === id);
  if (!o) return;
  if (o.status === status) { renderAdmin(); return; }

  o.status = status;
  const today = new Date().toISOString().split('T')[0];
  if (status === 'packing' && !o.packedAt) o.packedAt = today;
  if (status === 'shipped') {
    o.shippedAt = o.shippedAt || today;
    if (!o.tracking) o.tracking = 'JD-EXP-' + Math.floor(100000 + Math.random() * 899999);
  }
  if (status === 'out_for_delivery') o.outAt = o.outAt || today;
  if (status === 'delivered') { o.deliveredAt = o.deliveredAt || today; o.eta = o.eta || today; }

  renderAdmin();
  if ($('accountPage').classList.contains('show')) renderAccountPage();
  showToast(t('admin.statusUpdated', { id: o.id, status: t('account.status_' + status) }), 'bx-check-circle');
}

function advanceOrder(id) {
  const o = orderHistory.find(x => x.id === id);
  if (!o) return;
  const i = STATUS_FLOW.indexOf(o.status);
  if (i === -1 || i >= STATUS_FLOW.length - 1) return;
  setOrderStatus(id, STATUS_FLOW[i + 1]);
}

function exportOrdersCsv() {
  const rows = [['Order ID', 'Customer', 'Email', 'Date', 'Items', 'Total', 'Status', 'Payment']];
  orderHistory.forEach(o => {
    const c = custById(o.customerId);
    const qty = o.itemsList.reduce((s, i) => s + i.qty, 0);
    rows.push([o.id, c.name, c.email, o.date, qty, o.total.toFixed(2), t('account.status_' + o.status), o.payment]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hat-candy-orders.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('admin.exported'), 'bx-download');
}

function openAdminCustomerModal(customerId) {
  const c = customers.find(x => x.id === customerId);
  if (!c) return;

  const stats = customerStats(c.id);
  const orders = orderHistory.filter(o => o.customerId === c.id);

  $('adminCustomerName').textContent = c.name || 'Customer';
  $('adminCustomerEmail').textContent = c.email || '';

  $('adminCustomerBody').innerHTML = `
    <div class="account-stats" style="margin-bottom:16px;">
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-receipt'></i></div><div><div class="account-stat-value">${stats.orders}</div><div class="account-stat-label">Orders</div></div></div>
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-dollar-circle'></i></div><div><div class="account-stat-value">$${stats.spent.toFixed(2)}</div><div class="account-stat-label">Total Spent</div></div></div>
    </div>
    <div class="owner-form-grid" style="margin-bottom:16px;">
      <div class="form-group"><label>Phone</label><input type="text" id="adminCustPhone" value="${esc(c.phone || '')}"></div>
      <div class="form-group"><label>City</label><input type="text" id="adminCustCity" value="${esc(c.city || '')}"></div>
      <div class="form-group"><label>Tier</label><select id="adminCustTier"><option value="new" ${c.tier === 'new' ? 'selected' : ''}>New</option><option value="active" ${c.tier === 'active' ? 'selected' : ''}>Active</option><option value="vip" ${c.tier === 'vip' ? 'selected' : ''}>VIP</option></select></div>
    </div>
    <h4 style="margin:14px 0 10px;font-family:var(--font-heading);color:var(--primary);font-weight:400;">Recent Orders</h4>
    <div class="admin-table-wrap" style="box-shadow:none;padding:0;">
      <table class="admin-table"><thead><tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>${orders.length ? orders.map(o => `<tr><td><strong>${o.id}</strong></td><td>${formatDate(o.date)}</td><td>$${o.total.toFixed(2)}</td><td><span class="order-status status-${o.status}">${t('account.status_' + o.status)}</span></td></tr>`).join('') : `<tr><td colspan="4"><div class="admin-empty-note">No orders</div></td></tr>`}</tbody></table>
    </div>
    <div style="display:flex;justify-content:space-between;gap:8px;margin-top:18px;">
      <button class="owner-btn danger" id="adminCustDelete"><i class='bx bx-trash'></i> Delete</button>
      <div style="display:flex;gap:8px;">
        <button class="owner-btn ghost" data-close-owner-modal>Cancel</button>
        <button class="owner-btn primary" id="adminCustSave"><i class='bx bx-save'></i> Save</button>
      </div>
    </div>`;

  $('adminCustomerModal').classList.add('show');

  $('adminCustSave').addEventListener('click', () => {
    c.phone = $('adminCustPhone').value.trim();
    c.city = $('adminCustCity').value.trim();
    c.tier = $('adminCustTier').value;
    renderAdmin();
    $('adminCustomerModal').classList.remove('show');
    showToast('Customer updated', 'bx-check-circle');
  });

  $('adminCustDelete').addEventListener('click', () => {
    if (!confirm('Delete this customer? Their orders will remain.')) return;
    customers = customers.filter(x => x.id !== c.id);
    renderAdmin();
    $('adminCustomerModal').classList.remove('show');
    showToast('Customer deleted', 'bx-trash');
  });
}

/* =====================================================
   20. OWNER PANEL
   ===================================================== */
function signInAsOwner() {
  isOwner = true;
  isAdmin = true;
  currentUser = { id: 'owner', name: 'Developer', email: '0782342105', role: 'owner' };
  $('loginFormWrapper').style.display = 'none';
  $('loginSuccess').classList.add('show');
  $('successMessage').textContent = 'Full access granted ✨';
  $('loginBtn').classList.add('signed-in');
  $('userInitial').textContent = 'D';
  updateMobileAccountUI();
  setTimeout(() => {
    closeAllPanels();
    openOwnerPage();
    showToast(t('toast.ownerWelcome'), 'bx-code-alt');
  }, 900);
}

function openOwnerPage() {
  if (!isOwner) return;
  $('ownerPage').classList.add('show');
  lockBodyScroll();
  $('floatingSign').classList.add('hide');
  renderOwner();
  switchOwnerTab(ownerTab);
}

function closeOwnerPage() {
  $('ownerPage').classList.remove('show');
  if (!$('cartPanel').classList.contains('show') &&
      !$('loginPanel').classList.contains('show') &&
      !$('mixModal').classList.contains('show') &&
      !$('accountPage').classList.contains('show') &&
      !$('adminPage').classList.contains('show')) {
    unlockBodyScroll();
    $('floatingSign').classList.remove('hide');
  }
}

function switchOwnerTab(tab) {
  ownerTab = tab;
  document.querySelectorAll('#ownerPage .account-tab').forEach(x =>
    x.classList.toggle('active', x.dataset.otab === tab)
  );
  document.querySelectorAll('#ownerPage .account-pane').forEach(p =>
    p.classList.toggle('active', p.dataset.opane === tab)
  );
}

function renderOwner() {
  $('ownerProductsCount').textContent = products.length;
  $('ownerOffersCount').textContent = offers.length;
  $('ownerGalleryCount').textContent = galleryImages.length;
  renderOwnerStats();
  renderOwnerProducts();
  renderOwnerOffers();
  renderOwnerGallery();
  renderOwnerMixBuilder();
  renderOwnerDelivery();
  renderStoreHours();
  renderOwnerCMS();
}

function renderStoreHours() {
  if ($('ownerOpenHour')) $('ownerOpenHour').value = storeHours.open;
  if ($('ownerCloseHour')) $('ownerCloseHour').value = storeHours.close;
}

function renderOwnerStats() {
  const stats = [
    { icon: 'bx-package', value: products.length, label: 'Products' },
    { icon: 'bx-purchase-tag', value: offers.length, label: 'Offers' },
    { icon: 'bx-check-circle', value: offers.filter(o => o.isActive).length, label: 'Active Offers' },
    { icon: 'bx-image', value: galleryImages.length, label: 'Gallery Items' },
    { icon: 'bx-error-circle', value: products.filter(p => p.stock > 0 && p.stock <= 20).length, label: 'Low Stock' },
    { icon: 'bx-x-circle', value: products.filter(p => p.stock <= 0).length, label: 'Out of Stock' }
  ];
  $('ownerStats').innerHTML = stats.map(s =>
    `<div class="owner-stat"><div class="owner-stat-icon"><i class='bx ${s.icon}'></i></div><div class="owner-stat-value">${s.value}</div><div class="owner-stat-label">${s.label}</div></div>`
  ).join('');
}

function renderOwnerProducts() {
  const body = $('ownerProductsBody');
  if (!products.length) {
    body.innerHTML = `<tr><td colspan="6"><div class="owner-empty"><i class='bx bx-package'></i><p>No products yet</p></div></td></tr>`;
    return;
  }
  body.innerHTML = products.map(p => `
    <tr>
      <td><div class="admin-user"><img class="owner-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(p.name)}</div><div class="admin-sub">${esc(p.name_ar || '')}</div></div></div></td>
      <td><strong>$${Number(p.price).toFixed(2)}</strong></td>
      <td>${p.oldPrice ? `$${Number(p.oldPrice).toFixed(2)}` : '—'}</td>
      <td>${esc(p.badge || '—')}</td>
      <td>${p.stock}</td>
      <td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-product="${esc(p.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-product="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></td>
    </tr>`).join('');
}

function renderOwnerOffers() {
  const body = $('ownerOffersBody');
  if (!offers.length) {
    body.innerHTML = `<tr><td colspan="6"><div class="owner-empty"><i class='bx bx-purchase-tag'></i><p>No offers yet</p></div></td></tr>`;
    return;
  }
  body.innerHTML = offers.map(o => `
    <tr>
      <td><div class="admin-user"><img class="owner-thumb" src="${esc(o.img)}" alt=""><div><div class="admin-user-name">${esc(o.name)}</div><div class="admin-sub">${esc(o.name_ar || '')}</div></div></div></td>
      <td>${esc(o.category || '—')}</td>
      <td><strong>$${Number(o.price).toFixed(2)}</strong></td>
      <td>${esc(o.discount || '—')}</td>
      <td>${o.isActive ? '<span class="admin-tier active">Active</span>' : '<span class="admin-tier" style="background:rgba(107,114,128,0.15);color:#4b5563;">Inactive</span>'}</td>
      <td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-offer="${esc(o.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-offer="${esc(o.id)}"><i class='bx bx-trash'></i></button></div></td>
    </tr>`).join('');
}

function renderOwnerGallery() {
  const grid = $('ownerGalleryGrid');
  grid.innerHTML = galleryImages.map(g =>
    `<div class="owner-gallery-item"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"><button class="owner-gallery-remove" data-delete-gallery="${g.id}"><i class='bx bx-trash'></i></button></div>`
  ).join('') + `<div class="owner-gallery-add" id="ownerAddGalleryTile"><i class='bx bx-plus'></i><span>Add Image</span></div>`;

  const tile = $('ownerAddGalleryTile');
  if (tile) tile.addEventListener('click', openOwnerGalleryModal);
}

function renderOwnerMixBuilder() {
  const wl = $('ownerWeightsList');
  wl.innerHTML = mixWeights.length ? [...mixWeights].sort((a, b) => a - b).map(w =>
    `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-weight'></i></div><div class="owner-list-info"><div class="owner-list-title">${w} g</div><div class="owner-list-meta">${(w / 1000).toFixed(3)} kg</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-weight="${w}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-weight="${w}"><i class='bx bx-trash'></i></button></div></div>`
  ).join('') : `<div class="owner-empty"><i class='bx bx-weight'></i><p>No weights yet</p></div>`;

  const pl = $('ownerPackagingList');
  pl.innerHTML = mixPackaging.length ? mixPackaging.map(p =>
    `<div class="owner-list-item">${p.img ? `<img class="owner-list-thumb" src="${esc(p.img)}" alt="">` : `<div class="owner-list-thumb"><i class='bx ${p.icon || 'bx-box'}'></i></div>`}<div class="owner-list-info"><div class="owner-list-title">${esc(p.name)} <span style="opacity:.6;font-weight:500">/ ${esc(p.name_ar || '')}</span></div><div class="owner-list-meta">${Number(p.extra) === 0 ? 'Free' : '+$' + Number(p.extra).toFixed(2)} · ${p.img ? 'custom image' : 'icon: ' + (p.icon || 'bx-box')}</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-pack="${esc(p.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-pack="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></div>`
  ).join('') : `<div class="owner-empty"><i class='bx bx-package'></i><p>No packaging yet</p></div>`;

  const cl = $('ownerCandyTypesList');
  cl.innerHTML = candyTypes.length ? candyTypes.map(c => {
    const sale = Number(c.sale_price_per_kg) || 0;
    const base = Number(c.price_per_kg) || 0;
    const priceTxt = (sale > 0 && sale < base)
      ? `<s>$${base.toFixed(2)}</s> → $${sale.toFixed(2)} / kg`
      : `$${base.toFixed(2)} / kg`;
    return `<div class="owner-list-item"><img class="owner-list-thumb" src="${esc(c.img)}" alt=""><div class="owner-list-info"><div class="owner-list-title"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-inline-end:6px;vertical-align:middle;"></span>${esc(c.name)} <span style="opacity:.6;font-weight:500">/ ${esc(c.name_ar || '')}</span></div><div class="owner-list-meta">${priceTxt}</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-candy="${esc(c.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-candy="${esc(c.id)}"><i class='bx bx-trash'></i></button></div></div>`;
  }).join('') : `<div class="owner-empty"><i class='bx bx-candy'></i><p>No candy types yet</p></div>`;
}

function renderOwnerDelivery() {
  const zl = $('ownerZonesList');
  zl.innerHTML = deliveryZones.length ? deliveryZones.map(z =>
    `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-map-pin'></i></div><div class="owner-list-info"><div class="owner-list-title">${esc(z.name)} <span style="opacity:.6;font-weight:500">/ ${esc(z.name_ar || '')}</span></div><div class="owner-list-meta">$${Number(z.price).toFixed(2)}</div></div><span class="owner-chip-toggle ${z.active ? 'on' : 'off'}">${z.active ? 'Active' : 'Off'}</span><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-zone="${esc(z.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-zone="${esc(z.id)}"><i class='bx bx-trash'></i></button></div></div>`
  ).join('') : `<div class="owner-empty"><i class='bx bx-cycling'></i><p>No delivery zones yet</p></div>`;
}

function renderOwnerCMS() {
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.dataset.cms;
    const la = el.closest('[data-cms-lang]')?.dataset.cmsLang || 'en';
    const dict = I18N[la] || I18N.en;
    el.value = dict[key] || '';
  });

  const phE = document.querySelector('[data-cms-contact="phone"]');
  const emE = document.querySelector('[data-cms-contact="email"]');
  const phS = document.querySelector('[data-contact-phone]');
  const emS = document.querySelector('[data-contact-email]');

  if (phE && phS) phE.value = phS.textContent || '';
  if (emE && emS) emE.value = emS.textContent || '';
}

function closeOwnerModals() {
  document.querySelectorAll('.owner-modal.show').forEach(m => m.classList.remove('show'));
}

function confirmDelete(kind, id) {
  if (pendingDeleteId === id) {
    pendingDeleteId = null;
    if (kind === 'product') {
      products = products.filter(p => p.id !== id);
      saveAll();
      renderCandies();
      renderOwner();
      showToast(t('toast.productDeleted'), 'bx-trash');
    } else if (kind === 'offer') {
      offers = offers.filter(o => o.id !== id);
      saveAll();
      renderOffers();
      renderOwner();
      showToast(t('toast.offerDeleted'), 'bx-trash');
    }
  } else {
    pendingDeleteId = id;
    showToast(t('toast.confirmDelete'), 'bx-info-circle');
    setTimeout(() => pendingDeleteId = null, 3000);
  }
}

/* =====================================================
   21. OWNER MODALS
   ===================================================== */
function openOwnerProductModal(id) {
  const m = $('ownerProductModal');
  const f = $('ownerProductForm');
  f.reset();
  f.querySelector('[data-field="id"]').value = '';
  $('ownerProductModalTitle').textContent = id ? 'Edit Product' : 'Add Product';

  if (id) {
    const p = products.find(x => x.id === id);
    if (p) {
      ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'price', 'oldPrice', 'badge', 'badge_ar', 'stock', 'img'].forEach(k => {
        const el = f.querySelector(`[data-field="${k}"]`);
        if (el) el.value = p[k] !== undefined && p[k] !== null ? p[k] : '';
      });
    }
  } else {
    f.querySelector('[data-field="stock"]').value = 50;
  }
  m.classList.add('show');
}

function openOwnerOfferModal(id) {
  const m = $('ownerOfferModal');
  const f = $('ownerOfferForm');
  f.reset();
  f.querySelector('[data-field="id"]').value = '';
  $('ownerOfferModalTitle').textContent = id ? 'Edit Offer' : 'Add Offer';

  if (id) {
    const o = offers.find(x => x.id === id);
    if (o) {
      ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'category', 'category_ar', 'discount', 'discount_ar', 'price', 'oldPrice', 'ends', 'ends_ar', 'img'].forEach(k => {
        const el = f.querySelector(`[data-field="${k}"]`);
        if (el) el.value = o[k] !== undefined && o[k] !== null ? o[k] : '';
      });
      const a = f.querySelector('[data-field="isActive"]');
      if (a) a.checked = !!o.isActive;
    }
  } else {
    f.querySelector('[data-field="isActive"]').checked = true;
  }
  m.classList.add('show');
}

function openOwnerGalleryModal() {
  $('ownerGalleryForm').reset();
  $('ownerGalleryModal').classList.add('show');
}

function openOwnerWeightModal(val) {
  const f = $('ownerWeightForm');
  f.reset();
  f.querySelector('[data-wfield="old"]').value = val || '';
  f.querySelector('[data-wfield="value"]').value = val || '';
  $('ownerWeightModalTitle').textContent = val ? 'Edit Weight' : 'Add Weight';
  $('ownerWeightModal').classList.add('show');
}

function openOwnerPackagingModal(id) {
  const f = $('ownerPackagingForm');
  f.reset();
  f.querySelector('[data-pfield="id"]').value = '';
  $('ownerPackagingModalTitle').textContent = id ? 'Edit Packaging' : 'Add Packaging';

  if (id) {
    const p = mixPackaging.find(x => x.id === id);
    if (p) {
      ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'icon', 'extra', 'img'].forEach(k => {
        const el = f.querySelector(`[data-pfield="${k}"]`);
        if (el) el.value = p[k] !== undefined && p[k] !== null ? p[k] : '';
      });
    }
  } else {
    f.querySelector('[data-pfield="icon"]').value = 'bx-box';
    f.querySelector('[data-pfield="extra"]').value = 0;
  }
  $('ownerPackagingModal').classList.add('show');
}

function openOwnerCandyTypeModal(id) {
  const f = $('ownerCandyTypeForm');
  f.reset();
  f.querySelector('[data-cfield="id"]').value = '';
  $('ownerCandyTypeModalTitle').textContent = id ? 'Edit Candy Type' : 'Add Candy Type';

  if (id) {
    const c = candyTypes.find(x => x.id === id);
    if (c) {
      ['id', 'name', 'name_ar', 'price_per_kg', 'sale_price_per_kg', 'color', 'img'].forEach(k => {
        const el = f.querySelector(`[data-cfield="${k}"]`);
        if (el) el.value = c[k] !== undefined && c[k] !== null ? c[k] : '';
      });
    }
  } else {
    f.querySelector('[data-cfield="color"]').value = '#e2015d';
    f.querySelector('[data-cfield="price_per_kg"]').value = 12;
    f.querySelector('[data-cfield="sale_price_per_kg"]').value = '';
  }
  $('ownerCandyTypeModal').classList.add('show');
}

function openOwnerZoneModal(id) {
  const f = $('ownerZoneForm');
  f.reset();
  f.querySelector('[data-zfield="id"]').value = '';
  $('ownerZoneModalTitle').textContent = id ? 'Edit Delivery Zone' : 'Add Delivery Zone';

  if (id) {
    const z = deliveryZones.find(x => x.id === id);
    if (z) {
      f.querySelector('[data-zfield="name"]').value = z.name || '';
      f.querySelector('[data-zfield="name_ar"]').value = z.name_ar || '';
      f.querySelector('[data-zfield="price"]').value = z.price || 0;
      f.querySelector('[data-zfield="active"]').checked = !!z.active;
    }
  } else {
    f.querySelector('[data-zfield="active"]').checked = true;
    f.querySelector('[data-zfield="price"]').value = 2;
  }
  $('ownerZoneModal').classList.add('show');
}

/* =====================================================
   22. LANGUAGE APPLICATION
   ===================================================== */
function applyLanguage(newLang) {
  lang = (newLang === 'ar') ? 'ar' : 'en';
  try { localStorage.setItem('hatcandy-lang', lang); } catch (e) { /* silent */ }

  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.title = t('title.page');
  $('langLabel').textContent = isAr ? 'EN' : 'AR';

  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));

  const bi = $('mixBackIcon');
  if (bi) bi.className = 'bx ' + (isAr ? 'bx-right-arrow-alt' : 'bx-left-arrow-alt');

  renderOffers();
  renderCandies();
  renderGallery();
  renderCart();

  if ($('mixModal').classList.contains('show')) {
    renderMixWeights();
    renderMixPackaging();
    renderMixSlots();
    renderMixTypesGrid();
    $('mixCountNumber').textContent = mixState.typesCount;
    if (mixState.step === 4) renderMixReview();
    updateMixStep();
  }

  if ($('loginPanel').classList.contains('show') && !$('loginSuccess').classList.contains('show')) {
    if (checkoutIntent) {
      $('loginTitle').textContent = t('login.almost');
      $('loginSubtitle').textContent = t('login.almostSub');
    }
  }

  if ($('accountPage').classList.contains('show')) renderAccountPage();
  if ($('adminPage').classList.contains('show')) renderAdmin();
  if ($('ownerPage').classList.contains('show')) renderOwner();

  updateMobileAccountUI();
  updateSign(true);
  revealOnScroll();
}

/* =====================================================
   23. SIGNBOARD
   ===================================================== */
function updateSign(force) {
  const now = new Date();
  const h = now.getHours();
  const isOpen = h >= storeHours.open && h < storeHours.close;

  if (previousSignState !== isOpen || force) {
    $('sbBoard').textContent = isOpen ? t('sign.open') : t('sign.closed');
    document.body.classList.toggle('is-open', isOpen);
    $('sbNote').textContent = isOpen ? t('sign.openNote') : t('sign.closedNote');
    const b = $('sbBoard');
    b.classList.remove('text-change');
    void b.offsetWidth;
    b.classList.add('text-change');
    previousSignState = isOpen;

    const ch = $('contactHoursText');
    if (ch) ch.textContent = `${String(storeHours.open).padStart(2, '0')}:00 – ${String(storeHours.close).padStart(2, '0')}:00`;
  }
}

/* =====================================================
   24. SCROLL UTILITIES
   ===================================================== */
function revealOnScroll() {
  const wh = window.innerHeight;
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('active') && el.getBoundingClientRect().top < wh - 100) {
      el.classList.add('active');
    }
  });
}

function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  const start = performance.now();

  function ease(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  function step(now) {
    const el = now - start;
    const p = Math.min(el / duration, 1);
    window.scrollTo(0, startY + diff * ease(p));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* =====================================================
   25. EVENT WIRING
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ==== HEADER ==== */
  $('hamburger').addEventListener('click', () => {
    $('hamburger').classList.toggle('active');
    $('navLinks').classList.toggle('active');
  });
  $('navLinks').querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    $('hamburger').classList.remove('active');
    $('navLinks').classList.remove('active');
  }));
  window.addEventListener('scroll', () => $('header').classList.toggle('scrolled', window.scrollY > 50));

  /* ==== MOBILE ACCOUNT ==== */
  $('mobileAccountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    $('hamburger').classList.remove('active');
    $('navLinks').classList.remove('active');
    setTimeout(() => {
      if (currentUser) {
        if (isOwner) openOwnerPage();
        else if (isAdmin) openAdminPage();
        else openAccountPage();
      } else {
        resetLoginPanel('default');
        openPanel($('loginPanel'));
      }
    }, 250);
  });

  /* ==== CART / LOGIN ==== */
  $('cartBtn').addEventListener('click', () => openPanel($('cartPanel')));
  $('cartClose').addEventListener('click', closeAllPanels);
  $('loginBtn').addEventListener('click', () => {
    if (currentUser) {
      if (isOwner) openOwnerPage();
      else if (isAdmin) openAdminPage();
      else openAccountPage();
      return;
    }
    resetLoginPanel('default');
    openPanel($('loginPanel'));
  });
  $('loginClose').addEventListener('click', closeAllPanels);
  $('overlay').addEventListener('click', closeAllPanels);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('mixModal').classList.contains('show')) closeMixModal();
      else if ($('ownerPage').classList.contains('show')) closeOwnerPage();
      else if ($('adminPage').classList.contains('show')) closeAdminPage();
      else if ($('accountPage').classList.contains('show')) closeAccountPage();
      else closeAllPanels();
    }
  });

  /* ==== MIX BUILDER ==== */
  $('heroMixBtn').addEventListener('click', openMixModal);
  $('bannerMixBtn').addEventListener('click', openMixModal);
  $('mixClose').addEventListener('click', closeMixModal);
  $('mixBackdrop').addEventListener('click', closeMixModal);

  $('mixWeightGrid').addEventListener('click', (e) => {
    const p = e.target.closest('.mix-weight-pill');
    if (!p) return;
    mixState.weight = parseInt(p.dataset.weight);
    renderMixWeights();
    $('mixNextBtn').disabled = false;
  });

  $('mixPackGrid').addEventListener('click', (e) => {
    const c = e.target.closest('.mix-pack-card');
    if (!c) return;
    mixState.packaging = mixPackaging.find(p => p.id === c.dataset.pack);
    renderMixPackaging();
    $('mixNextBtn').disabled = false;
  });

  $('mixCountMinus').addEventListener('click', () => {
    if (mixState.typesCount > 1) {
      mixState.typesCount--;
      mixState.selectedTypes = mixState.selectedTypes.slice(0, mixState.typesCount);
      renderMixSlots();
      renderMixTypesGrid();
      $('mixCountNumber').textContent = mixState.typesCount;
      $('mixCountMinus').disabled = mixState.typesCount <= 1;
      $('mixCountPlus').disabled = mixState.typesCount >= 6;
      updateMixStep();
    }
  });

  $('mixCountPlus').addEventListener('click', () => {
    if (mixState.typesCount < 6) {
      mixState.typesCount++;
      $('mixCountNumber').textContent = mixState.typesCount;
      $('mixCountMinus').disabled = false;
      $('mixCountPlus').disabled = mixState.typesCount >= 6;
      renderMixSlots();
      renderMixTypesGrid();
      updateMixStep();
    }
  });

  $('mixTypesGrid').addEventListener('click', (e) => {
    const c = e.target.closest('.mix-type-card');
    if (!c) return;
    const id = c.dataset.type;
    const i = mixState.selectedTypes.indexOf(id);
    if (i !== -1) {
      mixState.selectedTypes.splice(i, 1);
    } else {
      if (mixState.selectedTypes.length >= mixState.typesCount) {
        showToast(t('toast.allSlots'), 'bx-info-circle');
        return;
      }
      mixState.selectedTypes.push(id);
    }
    renderMixSlots();
    renderMixTypesGrid();
    updateMixStep();
  });

  $('mixBackBtn').addEventListener('click', () => {
    if (mixState.step > 1) goToMixStep(mixState.step - 1);
  });

  $('mixNextBtn').addEventListener('click', () => {
    if (mixState.step < 4) {
      goToMixStep(mixState.step + 1);
    } else {
      const total = calcMixPrice();
      cart.push({
        id: 'mix-' + Date.now(),
        isMix: true,
        weight: mixState.weight,
        packaging: mixState.packaging,
        types: mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)),
        price: total,
        qty: 1,
        img: mixState.selectedTypes[0]
          ? candyTypes.find(c => c.id === mixState.selectedTypes[0]).img
          : (candyTypes[0] ? candyTypes[0].img : '')
      });
      renderCart();
      showToast(t('toast.added', { name: t('mix.customMix') }), 'bx-party');
      closeMixModal();
      setTimeout(() => openPanel($('cartPanel')), 400);
    }
  });

  /* ==== CART ACTIONS ==== */
  document.addEventListener('click', (e) => {
    const ab = e.target.closest('.add-to-cart-btn');
    if (ab) {
      addToCart(ab.dataset.id);
      const orig = ab.innerHTML;
      ab.classList.add('added');
      ab.innerHTML = `<i class='bx bx-check'></i> ${t('candies.added')}`;
      setTimeout(() => {
        ab.classList.remove('added');
        ab.innerHTML = orig;
      }, 900);
      return;
    }

    const ctrl = e.target.closest('[data-action]');
    if (ctrl) {
      const { action, id } = ctrl.dataset;
      if (action === 'inc') increaseQty(id);
      if (action === 'dec') decreaseQty(id);
      if (action === 'remove') removeItem(id);
    }
  });

  document.querySelectorAll('.delivery-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cartDelivery.method = btn.dataset.deliveryMethod;
      if (cartDelivery.method === 'delivery' && !cartDelivery.zoneId) {
        const first = deliveryZones.find(z => z.active);
        if (first) cartDelivery.zoneId = first.id;
      }
      renderCart();
    });
  });

  document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cartPayment.method = btn.dataset.payment;
      renderPaymentSection();
    });
  });

  /* ==== LOGIN FORM ==== */
  $('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value.trim();
    const phone = $('loginPhone').value.trim();

    if (isOwnerPhone(phone)) {
      const btn = $('loginSubmit');
      const orig = btn.innerHTML;
      btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        signInAsOwner();
      }, 800);
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const btn = $('loginSubmit');
      const orig = btn.innerHTML;
      btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        signInAsAdmin();
      }, 800);
      return;
    }

    if (!email || !password || !phone) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
    if (!email.includes('@')) { showToast(t('toast.validEmail'), 'bx-error-circle'); return; }
    if (!validateJordanPhone(phone)) { showToast(t('toast.validPhone'), 'bx-error-circle'); return; }

    const btn = $('loginSubmit');
    const orig = btn.innerHTML;
    btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      onSignInSuccess({
        name: email.split('@')[0],
        email,
        phone: '+962 ' + phone.replace(/\D/g, '')
      });
    }, 1200);
  });

  /* ==== GOOGLE SIGN-IN ==== */
  $('googleBtn').addEventListener('click', openGoogleChooser);

  $('gChooserBackdrop').addEventListener('click', closeGoogleChooser);
  $('gChooserCancel').addEventListener('click', closeGoogleChooser);

  $('gChooserUseOther').addEventListener('click', () => {
    closeGoogleChooser();
    const suffix = Date.now().toString().slice(-4);
    const newAcc = { name: 'Google User', email: `user${suffix}@gmail.com` };
    pendingGoogleAccount = newAcc;
    openGooglePhoneStep(newAcc);
  });

  $('gChooserList').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-google-remove]');
    if (removeBtn) {
      e.stopPropagation();
      const idx = parseInt(removeBtn.dataset.googleRemove, 10);
      googleAccounts.splice(idx, 1);
      persistGoogleAccounts();
      renderGoogleChooser();
      return;
    }
    const item = e.target.closest('[data-google-account]');
    if (item) handleGoogleAccountSelected(parseInt(item.dataset.googleAccount, 10));
  });

  $('gChooserList').addEventListener('keydown', (e) => {
    const item = e.target.closest('[data-google-account]');
    if (item && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleGoogleAccountSelected(parseInt(item.dataset.googleAccount, 10));
    }
  });

  $('googleChange').addEventListener('click', resetGoogleSignInUI);

  $('googleContinue').addEventListener('click', () => {
    const phone = $('googlePhone').value.trim();
    if (!phone) {
      showToast(t('toast.enterPhone'), 'bx-error-circle');
      $('googlePhone').focus();
      return;
    }
    if (isOwnerPhone(phone)) {
      resetGoogleSignInUI();
      signInAsOwner();
      return;
    }
    if (!validateJordanPhone(phone)) {
      showToast(t('toast.validPhone'), 'bx-error-circle');
      $('googlePhone').focus();
      return;
    }

    const btn = $('googleContinue');
    const original = btn.innerHTML;
    btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;

      const account = pendingGoogleAccount || {
        name: $('googleName').textContent,
        email: $('googleEmail').textContent
      };

      rememberGoogleAccount(account);

      onSignInSuccess({
        name: account.name,
        email: account.email,
        phone: '+962 ' + phone.replace(/\D/g, '')
      });

      setTimeout(resetGoogleSignInUI, 1800);
    }, 1100);
  });

  $('signupLink').addEventListener('click', (e) => { e.preventDefault(); closeAllPanels(); });
  $('forgotLink').addEventListener('click', (e) => { e.preventDefault(); showToast(t('toast.resetSent'), 'bx-envelope'); });

  /* ==== CHECKOUT ==== */
  $('checkoutBtn').addEventListener('click', () => {
    const btn = $('checkoutBtn');
    if (btn.disabled) return;
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 1500);

    if (cart.length === 0) { showToast(t('toast.cartEmpty'), 'bx-shopping-bag'); return; }

    if (!currentUser) {
      closeAllPanels();
      setTimeout(() => {
        resetLoginPanel('checkout');
        openPanel($('loginPanel'));
      }, 350);
      return;
    }

    if (cartPayment.method === 'card') {
      const c = cartPayment.card;
      if (!validateCardNumber(c.number)) { showToast(t('pay.invalidCard'), 'bx-error-circle'); return; }
      if (!c.name || c.name.trim().length < 3) { showToast(t('pay.invalidName'), 'bx-error-circle'); return; }
      if (!validateExpiry(c.expiry)) { showToast(t('pay.invalidExpiry'), 'bx-error-circle'); return; }
      if (!/^\d{3,4}$/.test(c.cvv)) { showToast(t('pay.invalidCvv'), 'bx-error-circle'); return; }
    }

    /* Persist card if requested */
    if (cartPayment.method === 'card' && cartPayment.card.save && !cartPayment.card.savedId) {
      const num = cartPayment.card.number.replace(/\s/g, '');
      const b = detectCardBrand(num);
      saveCardForCurrentUser({
        brand: b.brand,
        last4: num.slice(-4),
        name: cartPayment.card.name,
        expiry: cartPayment.card.expiry
      });
    }

    const subtotal = getCartSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;
    const zone = deliveryZones.find(z => z.id === cartDelivery.zoneId);
    const defAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
    const today = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: 'HC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      customerId: currentUser.id || 'c-guest',
      date: today,
      status: 'processing',
      itemsCount: cart.reduce((s, i) => s + i.qty, 0),
      itemsList: cart.map(i => {
        if (i.isMix) return { name: 'Custom Mix', name_ar: 'خلطة خاصة', qty: i.qty, price: i.price };
        const p = products.find(x => x.id === i.id) || offers.find(x => x.id === i.id);
        return p ? { name: p.name, name_ar: p.name_ar, qty: i.qty, price: p.price } : null;
      }).filter(Boolean),
      subtotal, deliveryFee, total,
      deliveryMethod: cartDelivery.method,
      deliveryZone: zone ? zone.name : null,
      payment: cartPayment.method,
      cardLast4: cartPayment.method === 'card' ? cartPayment.card.number.replace(/\s/g, '').slice(-4) : null,
      address: cartDelivery.method === 'pickup' ? 'Pickup from boutique' : (defAddr ? `${defAddr.city}, ${defAddr.area}` : 'Amman, Jordan'),
      tracking: null, placedAt: today, packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null
    };

    orderHistory.unshift(newOrder);
    showToast(t('toast.orderPlaced', { total: '$' + total.toFixed(2) }), 'bx-party');
    cart = [];
    cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
    renderCart();

    setTimeout(() => {
      closeAllPanels();
      setTimeout(openAccountPage, 300);
    }, 900);
  });

  /* ==== CONTACT FORM ==== */
  $('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('name').value.trim();
    const email = $('email').value.trim();
    const message = $('message').value.trim();

    if (!name || !email || !message) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = t('contact.sending');
    btn.disabled = true;

    setTimeout(() => {
      contactMessages.unshift({
        id: 'msg-' + Date.now(),
        name, email, message,
        date: new Date().toISOString().split('T')[0],
        read: false
      });
      if ($('adminPage').classList.contains('show')) renderAdmin();
      showToast(t('toast.thanks', { name }), 'bx-check-circle');
      e.target.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 1200);
  });

  /* ==== SMOOTH SCROLL ==== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const tgt = document.querySelector(href);
      if (!tgt) return;
      e.preventDefault();
      const y = tgt.getBoundingClientRect().top + window.pageYOffset - 80;
      const d = Math.abs(y - window.pageYOffset);
      smoothScrollTo(y, Math.min(600 + d * 0.5, 1600));
    });
  });
  document.documentElement.style.scrollBehavior = 'auto';
  window.addEventListener('scroll', revealOnScroll);

  /* ==== ACCOUNT ==== */
  document.querySelectorAll('#accountPage .account-tab').forEach(tb =>
    tb.addEventListener('click', () => switchAccountTab(tb.dataset.tab))
  );
  $('accountBack').addEventListener('click', closeAccountPage);
  $('accountSignout').addEventListener('click', signOutUser);

  $('addressFormEl').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $('addressId').value;
    const data = {
      label: $('addressLabelInput').value,
      name: $('addressNameInput').value.trim(),
      phone: $('addressPhoneInput').value.trim(),
      city: $('addressCityInput').value.trim(),
      area: $('addressAreaInput').value.trim(),
      line: $('addressLineInput').value.trim()
    };
    if (!data.name || !data.phone || !data.city || !data.area || !data.line) {
      showToast(t('toast.fillFields'), 'bx-error-circle');
      return;
    }
    if (id) {
      const i = savedAddresses.findIndex(a => a.id === id);
      if (i !== -1) savedAddresses[i] = { ...savedAddresses[i], ...data };
      showToast(t('toast.addressUpdated'), 'bx-check-circle');
    } else {
      savedAddresses.push({ id: 'addr-' + Date.now(), ...data, isDefault: savedAddresses.length === 0 });
      showToast(t('toast.addressAdded'), 'bx-check-circle');
    }
    hideAddressForm();
    renderAccountPage();
  });

  $('addressCancel').addEventListener('click', hideAddressForm);

  $('addressesGrid').addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit-address]');
    if (ed) { showAddressForm(ed.dataset.editAddress); return; }

    const dl = e.target.closest('[data-delete-address]');
    if (dl) {
      if (savedAddresses.length <= 1) { showToast(t('toast.needOneAddress'), 'bx-info-circle'); return; }
      savedAddresses = savedAddresses.filter(a => a.id !== dl.dataset.deleteAddress);
      if (!savedAddresses.some(a => a.isDefault) && savedAddresses.length) savedAddresses[0].isDefault = true;
      renderAccountPage();
      showToast(t('toast.addressDeleted'), 'bx-trash');
      return;
    }

    const df = e.target.closest('[data-default-address]');
    if (df) {
      savedAddresses.forEach(a => a.isDefault = a.id === df.dataset.defaultAddress);
      renderAccountPage();
      showToast(t('toast.addressDefaultSet'), 'bx-check-circle');
    }
  });

  $('ordersList').addEventListener('click', (e) => {
    const tr = e.target.closest('[data-track]');
    if (tr) { switchAccountTab('tracking'); return; }

    const ro = e.target.closest('[data-reorder]');
    if (ro) {
      const o = orderHistory.find(x => x.id === ro.dataset.reorder);
      if (!o) return;
      o.itemsList.forEach(it => {
        const p = products.find(x => x.name === it.name) || offers.find(x => x.name === it.name);
        if (p) {
          const ex = cart.find(c => c.id === p.id);
          if (ex) ex.qty += it.qty;
          else cart.push({ id: p.id, qty: it.qty });
        }
      });
      renderCart();
      showToast(t('toast.reordered'), 'bx-cart-add');
      closeAccountPage();
      setTimeout(() => openPanel($('cartPanel')), 300);
    }
  });

  /* ==== ADMIN ==== */
  $('adminBack').addEventListener('click', closeAdminPage);
  $('adminSignout').addEventListener('click', signOutUser);
  $('adminExportOrders').addEventListener('click', exportOrdersCsv);

  $('adminPage').addEventListener('click', (e) => {
    const tb = e.target.closest('[data-atab]');
    if (tb) { switchAdminTab(tb.dataset.atab); return; }

    const fl = e.target.closest('[data-ofilter]');
    if (fl) { adminOrderFilter = fl.dataset.ofilter; renderAdminOrders(); return; }

    const ad = e.target.closest('[data-advance]');
    if (ad) { advanceOrder(ad.dataset.advance); return; }

    const cn = e.target.closest('[data-cancel-order]');
    if (cn) { setOrderStatus(cn.dataset.cancelOrder, 'cancelled'); return; }

    const rd = e.target.closest('[data-msg-read]');
    if (rd) {
      const m = contactMessages.find(x => x.id === rd.dataset.msgRead);
      if (m) { m.read = !m.read; renderAdmin(); }
      return;
    }

    const dm = e.target.closest('[data-msg-delete]');
    if (dm) {
      contactMessages = contactMessages.filter(x => x.id !== dm.dataset.msgDelete);
      renderAdmin();
      showToast(t('admin.msgDeleted'), 'bx-trash');
      return;
    }

    const go = e.target.closest('[data-goto-orders]');
    if (go) { switchAdminTab('orders'); return; }

    const vc = e.target.closest('[data-view-customer]');
    if (vc) { openAdminCustomerModal(vc.dataset.viewCustomer); return; }

    const dc = e.target.closest('[data-del-customer]');
    if (dc) {
      if (!confirm('Delete this customer? Their orders will remain.')) return;
      customers = customers.filter(x => x.id !== dc.dataset.delCustomer);
      renderAdmin();
      showToast('Customer deleted', 'bx-trash');
      return;
    }
  });

  $('adminPage').addEventListener('change', (e) => {
    const s = e.target.closest('[data-status-order]');
    if (s) setOrderStatus(s.dataset.statusOrder, s.value);
  });

  $('adminPage').addEventListener('input', (e) => {
    if (e.target.id === 'adminCustomerSearch') {
      adminCustomerSearch = e.target.value.trim();
      renderAdminCustomers();
    }
  });

  /* ==== OWNER ==== */
  $('ownerBack').addEventListener('click', closeOwnerPage);
  $('ownerSignout').addEventListener('click', signOutUser);
  $('ownerAddProduct').addEventListener('click', () => openOwnerProductModal());
  $('ownerAddOffer').addEventListener('click', () => openOwnerOfferModal());
  $('ownerAddGallery').addEventListener('click', openOwnerGalleryModal);
  $('ownerAddWeight').addEventListener('click', () => openOwnerWeightModal());
  $('ownerAddPackaging').addEventListener('click', () => openOwnerPackagingModal());
  $('ownerAddCandyType').addEventListener('click', () => openOwnerCandyTypeModal());
  $('ownerAddZone').addEventListener('click', () => openOwnerZoneModal());

  $('ownerSaveHours').addEventListener('click', () => {
    const o = parseInt($('ownerOpenHour').value);
    const c = parseInt($('ownerCloseHour').value);
    if (isNaN(o) || isNaN(c) || o < 0 || o > 23 || c < 0 || c > 23) {
      showToast('Please enter valid hours (0–23)', 'bx-error-circle');
      return;
    }
    storeHours = { open: o, close: c };
    saveAll();
    updateSign(true);
    showToast(t('toast.hoursSaved'), 'bx-check-circle');
  });

  $('ownerSaveContent').addEventListener('click', () => {
    document.querySelectorAll('[data-cms]').forEach(el => {
      const k = el.dataset.cms;
      const la = el.closest('[data-cms-lang]')?.dataset.cmsLang || 'en';
      if (!contentOverrides[k]) contentOverrides[k] = {};
      contentOverrides[k][la] = el.value;
      if (I18N[la]) I18N[la][k] = el.value;
    });

    const phE = document.querySelector('[data-cms-contact="phone"]');
    const emE = document.querySelector('[data-cms-contact="email"]');
    if (phE) document.querySelector('[data-contact-phone]').textContent = phE.value;
    if (emE) document.querySelector('[data-contact-email]').textContent = emE.value;

    saveAll();
    applyLanguage(lang);
    showToast(t('toast.contentSaved'), 'bx-check-circle');
  });

  $('ownerResetContent').addEventListener('click', () => {
    try { localStorage.removeItem(LS_KEYS.content); } catch (e) { /* silent */ }
    location.reload();
  });

  $('ownerExportData').addEventListener('click', () => {
    const data = { products, offers, galleryImages, contentOverrides, mixWeights, mixPackaging, candyTypes, deliveryZones, storeHours };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hat-candy-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast.dataExported'), 'bx-download');
  });

  $('ownerImportData').addEventListener('click', () => $('ownerImportFile').click());

  $('ownerImportFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data.products)) products = data.products;
        if (Array.isArray(data.offers)) offers = data.offers;
        if (Array.isArray(data.galleryImages)) galleryImages = data.galleryImages;
        if (Array.isArray(data.mixWeights)) mixWeights = data.mixWeights;
        if (Array.isArray(data.mixPackaging)) mixPackaging = data.mixPackaging;
        if (Array.isArray(data.candyTypes)) candyTypes = data.candyTypes;
        if (Array.isArray(data.deliveryZones)) deliveryZones = data.deliveryZones;
        if (data.storeHours) storeHours = data.storeHours;
        if (data.contentOverrides && typeof data.contentOverrides === 'object') {
          contentOverrides = data.contentOverrides;
          Object.keys(contentOverrides).forEach(k => {
            const v = contentOverrides[k];
            if (I18N.en[k] !== undefined && v.en !== undefined) I18N.en[k] = v.en;
            if (I18N.ar[k] !== undefined && v.ar !== undefined) I18N.ar[k] = v.ar;
          });
        }
        saveAll();
        renderOffers();
        renderCandies();
        renderGallery();
        renderCart();
        renderMixWeights();
        renderMixPackaging();
        renderMixTypesGrid();
        renderOwner();
        applyLanguage(lang);
        showToast(t('toast.dataImported'), 'bx-check-circle');
      } catch (err) {
        showToast(t('toast.dataInvalid'), 'bx-error-circle');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  $('ownerResetAll').addEventListener('click', () => {
    if (!confirm('Reset all data to defaults? This cannot be undone.')) return;
    try { Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k)); } catch (e) { /* silent */ }
    location.reload();
  });

  document.querySelectorAll('[data-close-owner-modal]').forEach(el =>
    el.addEventListener('click', closeOwnerModals)
  );

  /* ==== OWNER FORMS ==== */
  $('ownerProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const id = f.querySelector('[data-field="id"]').value;
    const data = {};
    f.querySelectorAll('[data-field]').forEach(el => {
      const k = el.dataset.field;
      if (k === 'id') return;
      if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
      else if (el.type === 'checkbox') data[k] = el.checked;
      else data[k] = el.value.trim();
    });
    if (!data.name || !data.name_ar || !data.price) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    if (id) {
      const i = products.findIndex(p => p.id === id);
      if (i !== -1) products[i] = { ...products[i], ...data };
    } else {
      data.id = 'p-' + Date.now();
      products.push(data);
    }
    saveAll();
    renderCandies();
    renderOwner();
    closeOwnerModals();
    showToast(t('toast.productSaved'), 'bx-check-circle');
  });

  $('ownerOfferForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const id = f.querySelector('[data-field="id"]').value;
    const data = {};
    f.querySelectorAll('[data-field]').forEach(el => {
      const k = el.dataset.field;
      if (k === 'id') return;
      if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
      else if (el.type === 'checkbox') data[k] = el.checked;
      else data[k] = el.value.trim();
    });
    if (!data.name || !data.name_ar || !data.price) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    if (id) {
      const i = offers.findIndex(o => o.id === id);
      if (i !== -1) offers[i] = { ...offers[i], ...data };
    } else {
      data.id = 'offer-' + Date.now();
      offers.push(data);
    }
    saveAll();
    renderOffers();
    renderOwner();
    closeOwnerModals();
    showToast(t('toast.offerSaved'), 'bx-check-circle');
  });

  $('ownerGalleryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const img = e.target.querySelector('[data-field="img"]').value.trim();
    const alt = e.target.querySelector('[data-field="alt"]').value.trim();
    if (!img) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
    galleryImages.push({ id: 'g-' + Date.now(), img, alt });
    saveAll();
    renderGallery();
    renderOwner();
    closeOwnerModals();
    showToast(t('toast.galleryAdded'), 'bx-image-add');
  });

  $('ownerWeightForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const oldV = f.querySelector('[data-wfield="old"]').value;
    const newV = parseInt(f.querySelector('[data-wfield="value"]').value);
    if (!newV || newV <= 0) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    if (oldV) {
      const i = mixWeights.indexOf(parseInt(oldV));
      if (i !== -1) mixWeights[i] = newV;
      else mixWeights.push(newV);
    } else if (!mixWeights.includes(newV)) {
      mixWeights.push(newV);
    }
    saveAll();
    renderMixWeights();
    renderOwner();
    closeOwnerModals();
    showToast('Weight saved', 'bx-check-circle');
  });

  $('ownerPackagingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const id = f.querySelector('[data-pfield="id"]').value;
    const data = {};
    f.querySelectorAll('[data-pfield]').forEach(el => {
      const k = el.dataset.pfield;
      if (k === 'id') return;
      if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
      else data[k] = el.value.trim();
    });
    if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    if (id) {
      const i = mixPackaging.findIndex(p => p.id === id);
      if (i !== -1) mixPackaging[i] = { ...mixPackaging[i], ...data };
    } else {
      data.id = 'pack-' + Date.now();
      mixPackaging.push(data);
    }
    saveAll();
    renderMixPackaging();
    renderOwner();
    closeOwnerModals();
    showToast('Packaging saved', 'bx-check-circle');
  });

  $('ownerCandyTypeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const id = f.querySelector('[data-cfield="id"]').value;
    const data = {};
    f.querySelectorAll('[data-cfield]').forEach(el => {
      const k = el.dataset.cfield;
      if (k === 'id') return;
      if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
      else data[k] = el.value.trim();
    });
    if (!data.name || !data.name_ar || !data.price_per_kg || !data.img) {
      showToast(t('toast.fillFields'), 'bx-error-circle');
      return;
    }

    if (id) {
      const i = candyTypes.findIndex(c => c.id === id);
      if (i !== -1) candyTypes[i] = { ...candyTypes[i], ...data };
    } else {
      data.id = 'candy-' + Date.now();
      candyTypes.push(data);
    }
    saveAll();
    renderMixTypesGrid();
    renderOwner();
    if ($('mixModal').classList.contains('show')) {
      renderMixSlots();
      if (mixState.step === 4) renderMixReview();
    }
    closeOwnerModals();
    showToast('Candy type saved', 'bx-check-circle');
  });

  $('ownerZoneForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const id = f.querySelector('[data-zfield="id"]').value;
    const data = {
      name: f.querySelector('[data-zfield="name"]').value.trim(),
      name_ar: f.querySelector('[data-zfield="name_ar"]').value.trim(),
      price: parseFloat(f.querySelector('[data-zfield="price"]').value) || 0,
      active: f.querySelector('[data-zfield="active"]').checked
    };
    if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

    if (id) {
      const i = deliveryZones.findIndex(z => z.id === id);
      if (i !== -1) deliveryZones[i] = { ...deliveryZones[i], ...data };
    } else {
      data.id = 'zone-' + Date.now();
      deliveryZones.push(data);
    }
    saveAll();
    renderOwner();
    renderCart();
    closeOwnerModals();
    showToast('Zone saved', 'bx-check-circle');
  });

  /* ==== OWNER PAGE CLICK ==== */
  $('ownerPage').addEventListener('click', (e) => {
    const sw = e.target.closest('[data-lang-switch] button');
    if (sw) {
      const lk = sw.dataset.lang;
      const parent = sw.closest('.owner-cms-section');
      parent.querySelectorAll('[data-lang-switch] button').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === lk)
      );
      parent.querySelectorAll('[data-cms-lang]').forEach(f =>
        f.style.display = (f.dataset.cmsLang === lk) ? 'block' : 'none'
      );
      return;
    }

    const tb = e.target.closest('[data-otab]');
    if (tb) { switchOwnerTab(tb.dataset.otab); return; }

    const add = e.target.closest('[data-owner-add]');
    if (add) {
      const k = add.dataset.ownerAdd;
      if (k === 'product') openOwnerProductModal();
      if (k === 'offer') openOwnerOfferModal();
      return;
    }

    const go = e.target.closest('[data-owner-goto]');
    if (go) { switchOwnerTab(go.dataset.ownerGoto); return; }

    const ep = e.target.closest('[data-edit-product]');
    if (ep) { openOwnerProductModal(ep.dataset.editProduct); return; }

    const dp = e.target.closest('[data-delete-product]');
    if (dp) { confirmDelete('product', dp.dataset.deleteProduct); return; }

    const eo = e.target.closest('[data-edit-offer]');
    if (eo) { openOwnerOfferModal(eo.dataset.editOffer); return; }

    const dof = e.target.closest('[data-delete-offer]');
    if (dof) { confirmDelete('offer', dof.dataset.deleteOffer); return; }

    const dg = e.target.closest('[data-delete-gallery]');
    if (dg) {
      galleryImages = galleryImages.filter(g => g.id !== dg.dataset.deleteGallery);
      saveAll();
      renderGallery();
      renderOwner();
      showToast(t('toast.galleryRemoved'), 'bx-trash');
      return;
    }

    const ew = e.target.closest('[data-edit-weight]');
    if (ew) { openOwnerWeightModal(parseInt(ew.dataset.editWeight)); return; }

    const dw = e.target.closest('[data-del-weight]');
    if (dw) {
      const w = parseInt(dw.dataset.delWeight);
      mixWeights = mixWeights.filter(x => x !== w);
      saveAll();
      renderMixWeights();
      renderOwner();
      showToast('Weight removed', 'bx-trash');
      return;
    }

    const epk = e.target.closest('[data-edit-pack]');
    if (epk) { openOwnerPackagingModal(epk.dataset.editPack); return; }

    const dpk = e.target.closest('[data-del-pack]');
    if (dpk) {
      mixPackaging = mixPackaging.filter(x => x.id !== dpk.dataset.delPack);
      saveAll();
      renderMixPackaging();
      renderOwner();
      showToast('Packaging removed', 'bx-trash');
      return;
    }

    const ect = e.target.closest('[data-edit-candy]');
    if (ect) { openOwnerCandyTypeModal(ect.dataset.editCandy); return; }

    const dct = e.target.closest('[data-del-candy]');
    if (dct) {
      candyTypes = candyTypes.filter(x => x.id !== dct.dataset.delCandy);
      saveAll();
      renderMixTypesGrid();
      renderOwner();
      showToast('Candy type removed', 'bx-trash');
      return;
    }

    const ez = e.target.closest('[data-edit-zone]');
    if (ez) { openOwnerZoneModal(ez.dataset.editZone); return; }

    const dz = e.target.closest('[data-del-zone]');
    if (dz) {
      deliveryZones = deliveryZones.filter(x => x.id !== dz.dataset.delZone);
      saveAll();
      renderOwner();
      renderCart();
      showToast('Zone removed', 'bx-trash');
      return;
    }
  });

  /* ==== LANGUAGE TOGGLE ==== */
  $('langToggle').addEventListener('click', () => applyLanguage(lang === 'ar' ? 'en' : 'ar'));

  /* ==== MOBILE: iOS viewport height fix ==== */
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', () => setTimeout(setVH, 200));

  /* ==== MOBILE: swipe-to-close side panels ==== */
  ['cartPanel', 'loginPanel'].forEach(id => {
    const el = $(id);
    let startX = 0, startY = 0, curX = 0, tracking = false;

    el.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      curX = startX;
      tracking = true;
      el.style.transition = 'none';
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!tracking) return;
      curX = e.touches[0].clientX;
      const dy = Math.abs(e.touches[0].clientY - startY);
      const dx = curX - startX;
      const rtl = document.documentElement.dir === 'rtl';
      const wrongDir = (!rtl && dx < 0) || (rtl && dx > 0);

      if (dy > 40 || wrongDir) {
        tracking = false;
        el.style.transition = '';
        el.style.transform = '';
        return;
      }
      el.style.transform = `translateX(${dx}px)`;
    }, { passive: true });

    el.addEventListener('touchend', () => {
      if (!tracking) return;
      tracking = false;
      el.style.transition = '';
      const dx = curX - startX;
      const rtl = document.documentElement.dir === 'rtl';
      const shouldClose = (!rtl && dx > 100) || (rtl && dx < -100);
      el.style.transform = '';
      if (shouldClose) closeAllPanels();
    });
  });

  /* ==== INIT ==== */
  loadAll();
  loadGoogleAccounts();
  renderOffers();
  renderCandies();
  renderGallery();
  renderCart();
  applyLanguage(lang);
  updateMobileAccountUI();
  updateSign(false);
  setInterval(() => updateSign(false), 10000);
  revealOnScroll();
});