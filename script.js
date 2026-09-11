/* =====================================================
   Hat Candy - Full App Script
   ===================================================== */

/* ===== i18n DICTIONARY ===== */
const I18N = {
  en: {
    'title.page': 'Hat Candy | Every Candy Begins with Magic',
    'nav.home': 'Home', 'nav.offers': 'Offers', 'nav.candies': 'Candies',
    'nav.about': 'About', 'nav.gallery': 'Gallery', 'nav.contact': 'Contact', 'nav.account': 'My Account',
    'hero.badge': 'Luxury Candy Brand',
    'hero.text': 'Every Candy Begins with Magic. Combining premium quality, elegant presentation, and playful creativity to transform every sweet treat into a memorable experience.',
    'hero.seeOffers': 'See Offers', 'hero.buildMix': 'Build Your Mix',
    'offers.title': 'Limited-Time Offers',
    'offers.subtitle': "Sweet deals that won't last forever — grab them before they're gone!",
    'offers.empty': 'No active offers right now.<br>Check back soon for more magic ✨',
    'offers.grab': 'Grab this Offer', 'offers.save': 'Save',
    'banner.title': 'Mix It <span>Your Way</span> ✨',
    'banner.text': 'Choose your weight, pick your packaging, and combine your favorite candies into one magical custom mix.',
    'banner.cta': 'Start Building',
    'candies.title': 'Signature Collection',
    'candies.subtitle': 'Indulge in our curated selection — add your favorites to the cart',
    'candies.add': 'Add', 'candies.added': 'Added',
    'about.title': 'Our Magical Story',
    'about.p1': 'Hat Candy is a luxury candy brand created to transform every sweet treat into a memorable experience. Combining premium quality, elegant presentation, and playful creativity, the brand celebrates the joy of indulgence with a touch of wonder.',
    'about.p2': 'Inspired by our slogan, "Every Candy Begins with Magic," we believe that every piece of candy starts with imagination, care, and a little magic—making every bite as special as the moment it creates.',
    'about.f1': 'Premium Ingredients', 'about.f2': 'Elegant Presentation',
    'about.f3': 'Luxury Gift Boxes', 'about.f4': 'Made with Love',
    'gallery.title': 'Magic in Every Detail',
    'gallery.subtitle': 'A glimpse into our world of premium sweets and elegant packaging',
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Order your magical treats — online orders are accepted 24/7',
    'contact.infoTitle': 'Contact Information',
    'contact.infoText': "We'd love to hear from you! Place your order online any time, or visit our boutique during opening hours.",
    'contact.addressLabel': 'Boutique Address',
    'contact.address': 'Amman, Jordan — Magic Avenue',
    'contact.phoneLabel': 'Phone', 'contact.emailLabel': 'Email',
    'contact.hoursLabel': 'Boutique Hours',
    'contact.hours': 'Mon–Sat: 8am – 5pm | Online: 24/7',
    'contact.formName': 'Full Name', 'contact.formEmail': 'Email Address',
    'contact.formMessage': 'Your Order / Message',
    'contact.send': 'Send Message', 'contact.sending': 'Sending...',
    'footer.copy': '© 2025 Hat Candy. All rights reserved. Every Candy Begins with Magic.',
    'cart.title': 'My Cart', 'cart.item': 'item', 'cart.items': 'items',
    'cart.empty': 'Your cart is empty.<br>Add some magic ✨',
    'cart.total': 'Total', 'cart.checkout': 'Proceed to Checkout',
    'cart.customMix': 'Custom Mix ✨',
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Sign in to your Hat Candy account',
    'login.almost': 'Almost There!',
    'login.almostSub': 'Sign in to complete your order',
    'login.callout': 'We need a few details to <strong>complete your checkout</strong> and deliver your magical treats.',
    'login.successTitle': "You're Signed In!",
    'login.successSub': 'Ready to complete your order ✨',
    'login.successWelcome': 'Welcome back, {name}! ✨',
    'login.google': 'Continue with Google',
    'login.googleSetup': 'Google sign-in needs a configured Google Client ID.',
    'login.divider': 'Or continue with email',
    'login.email': 'Email Address <span class="req">*</span>',
    'login.password': 'Password <span class="req">*</span>',
    'login.phone': 'Phone Number <span class="req">*</span>',
    'login.remember': 'Remember me', 'login.forgot': 'Forgot password?',
    'login.signin': 'Sign In', 'login.signingIn': 'Signing in...',
    'login.noAccount': 'Not a member?', 'login.createAccount': 'Create an account',
    'login.change': 'Change', 'login.continue': 'Continue',
    'mix.title': 'Build Your Own Mix',
    'mix.subtitle': 'Every Candy Begins with Magic',
    'mix.step1': 'Weight', 'mix.step2': 'Packaging', 'mix.step3': 'Candy Types', 'mix.step4': 'Review',
    'mix.weightTitle': 'Choose Your Weight',
    'mix.weightSub': 'From 100 g up to 1 kg — pick the perfect size for your magic mix.',
    'mix.packTitle': 'Choose Packaging',
    'mix.packSub': 'How would you like your candy mix packaged?',
    'mix.typesTitle': 'Choose Your Candy Types',
    'mix.typesSub': 'How many different candy types would you like to mix?',
    'mix.typesLabel': 'Types',
    'mix.pickTypes': 'Now pick your candy types',
    'mix.reviewTitle': 'Review Your Custom Mix',
    'mix.reviewSub': 'One last look before we add it to your cart.',
    'mix.yourMix': 'Your Custom Mix', 'mix.readyToAdd': 'Ready to add to your cart',
    'mix.weight': 'Weight', 'mix.packaging': 'Packaging', 'mix.candyTypes': 'Candy Types',
    'mix.candySelection': 'Candy Selection', 'mix.candy': 'Candy', 'mix.total': 'Total',
    'mix.back': 'Back', 'mix.next': 'Next', 'mix.addToCart': 'Add to Cart',
    'mix.tapToChoose': 'Tap below to choose', 'mix.type': 'Type',
    'mix.halfKilo': 'Half Kilo', 'mix.fullKilo': 'Full Kilo', 'mix.min': 'Min',
    'mix.kilogram': '1 Kilogram', 'mix.gramsLabel': '{w} grams', 'mix.unitG': 'g',
    'mix.free': 'Free', 'mix.customMix': 'Custom Mix ✨',
    'sign.open': 'OPEN', 'sign.closed': 'CLOSED',
    'sign.openNote': 'Open now – order online ✨',
    'sign.closedNote': 'Closed – order online 24/7 ✨',
    'toast.added': '{name} added to cart',
    'toast.removed': 'Item removed',
    'toast.cartEmpty': 'Your cart is empty',
    'toast.welcome': 'Welcome, {name}!',
    'toast.signedInCheckout': "You're signed in! Proceed to checkout ✨",
    'toast.orderPlaced': 'Order placed! Total: {total}',
    'toast.paymentSetup': 'Secure card checkout is not configured yet.',
    'toast.paymentStartFailed': 'Could not start secure checkout. Please try again.',
    'toast.fillFields': 'Please fill all required fields',
    'toast.validEmail': 'Please enter a valid email address',
    'toast.validPhone': 'Please enter a valid Jordanian number (7X XXX XXXX)',
    'toast.enterPhone': 'Please enter your phone number',
    'toast.resetSent': 'Password reset link sent to your email',
    'toast.thanks': 'Thank you, {name}! Message received.',
    'toast.allSlots': 'All slots are filled. Deselect one to swap.',
    'toast.signedOut': 'You have been signed out',
    'toast.addressAdded': 'Address added successfully',
    'toast.addressUpdated': 'Address updated',
    'toast.addressDeleted': 'Address deleted',
    'toast.addressDefaultSet': 'Default address updated',
    'toast.needOneAddress': 'You need at least one saved address',
    'toast.reordered': 'Items added back to your cart',
    'toast.ownerWelcome': 'Welcome back, Developer ✨',
    'toast.adminWelcome': 'Welcome back, Admin ✨',
    'toast.productSaved': 'Product saved successfully',
    'toast.productDeleted': 'Product deleted',
    'toast.offerSaved': 'Offer saved successfully',
    'toast.offerDeleted': 'Offer deleted',
    'toast.galleryAdded': 'Gallery image added',
    'toast.galleryRemoved': 'Gallery image removed',
    'toast.contentSaved': 'Site content updated',
    'toast.dataExported': 'Data exported',
    'toast.dataImported': 'Data imported successfully',
    'toast.dataInvalid': 'Invalid file format',
    'toast.confirmDelete': 'Click again to confirm delete',
    'admin.back': 'Back to Store',
    'admin.badge': 'Admin',
    'admin.heroName': 'Store Administration',
    'admin.heroSub': 'Full control over orders, customers & revenue',
    'admin.tabOverview': 'Overview',
    'admin.tabOrders': 'Orders',
    'admin.tabCustomers': 'Customers',
    'admin.tabProducts': 'Products',
    'admin.tabMessages': 'Messages',
    'admin.kpiRevenue': 'Total Revenue',
    'admin.kpiOrders': 'Total Orders',
    'admin.kpiCustomers': 'Customers',
    'admin.kpiAov': 'Avg. Order Value',
    'admin.kpiPending': 'Pending Orders',
    'admin.kpiDelivered': 'Delivered Revenue',
    'admin.revenueChart': 'Revenue Trend',
    'admin.last7': 'Last 7 days',
    'admin.topProducts': 'Top Selling Products',
    'admin.recentOrders': 'Recent Orders',
    'admin.viewAll': 'View all',
    'admin.noData': 'No data yet',
    'admin.thOrder': 'Order',
    'admin.thCustomer': 'Customer',
    'admin.thItems': 'Items',
    'admin.thTotal': 'Total',
    'admin.thStatus': 'Status',
    'admin.thActions': 'Actions',
    'admin.thProduct': 'Product',
    'admin.thPrice': 'Price',
    'admin.thStock': 'Stock',
    'admin.thSold': 'Sold',
    'admin.thRevenue': 'Revenue',
    'admin.thPhone': 'Phone',
    'admin.thCity': 'City',
    'admin.thOrders': 'Orders',
    'admin.thSpent': 'Total Spent',
    'admin.thTier': 'Tier',
    'admin.thJoined': 'Joined',
    'admin.all': 'All',
    'admin.export': 'Export CSV',
    'admin.exported': 'Orders exported successfully',
    'admin.advance': 'Advance',
    'admin.searchCustomers': 'Search customers…',
    'admin.payCard': 'Card',
    'admin.payCod': 'Cash on delivery',
    'admin.stockIn': 'In stock',
    'admin.stockLow': 'Low stock',
    'admin.stockOut': 'Out of stock',
    'admin.tierVip': 'VIP',
    'admin.tierActive': 'Active',
    'admin.tierNew': 'New',
    'admin.noMessages': 'No messages yet',
    'admin.noMessagesSub': 'Messages sent from the contact form will appear here.',
    'admin.markRead': 'Mark as read',
    'admin.markUnread': 'Mark as unread',
    'admin.deleteMsg': 'Delete',
    'admin.statusUpdated': 'Order {id} updated to {status}',
    'admin.msgDeleted': 'Message deleted',
    'admin.units': 'units',
    'account.back': 'Back to Store',
    'account.signout': 'Sign Out',
    'account.memberSince': 'Member since 2025',
    'account.savedAddresses': 'saved addresses',
    'account.tabOrders': 'Orders',
    'account.tabTracking': 'Tracking',
    'account.tabAddresses': 'Addresses',
    'account.statTotal': 'Total Orders',
    'account.statActive': 'Active',
    'account.statDelivered': 'Delivered',
    'account.statSpent': 'Total Spent',
    'account.orderId': 'Order',
    'account.orderTotal': 'Order Total',
    'account.trackOrder': 'Track',
    'account.reorder': 'Reorder',
    'account.noOrders': 'No orders yet',
    'account.noOrdersSub': 'Your sweet journey starts with your first order ✨',
    'account.shopNow': 'Shop Now',
    'account.noTracking': 'No active shipments',
    'account.noTrackingSub': 'When you place an order, you can track it here.',
    'account.trackingFor': 'Tracking for',
    'account.stepPlaced': 'Placed',
    'account.stepProcessing': 'Processing',
    'account.stepPacking': 'Packing',
    'account.stepShipped': 'Shipped',
    'account.stepOut': 'Out for Delivery',
    'account.stepDelivered': 'Delivered',
    'account.eta': 'Estimated delivery',
    'account.deliveringTo': 'Delivering to',
    'account.default': 'Default',
    'account.edit': 'Edit',
    'account.delete': 'Delete',
    'account.setDefault': 'Set as Default',
    'account.addNew': 'Add New Address',
    'account.addAddressTitle': 'Add New Address',
    'account.addAddressSub': 'Where should we deliver your magical treats?',
    'account.editAddressTitle': 'Edit Address',
    'account.fieldLabel': 'Label',
    'account.fieldName': 'Full Name',
    'account.fieldPhone': 'Phone Number',
    'account.fieldCity': 'City',
    'account.fieldArea': 'Area / Neighborhood',
    'account.fieldLine': 'Street, Building, Floor, Apt',
    'account.labelHome': 'Home',
    'account.labelWork': 'Work',
    'account.labelOther': 'Other',
    'account.cancel': 'Cancel',
    'account.save': 'Save Address',
    'account.cartNotice': 'You have {n} item(s) waiting in your cart.',
    'account.goToCart': 'Go to Cart',
    'account.status_processing': 'Processing',
    'account.status_packing': 'Packing',
    'account.status_shipped': 'Shipped',
    'account.status_out_for_delivery': 'Out for Delivery',
    'account.status_delivered': 'Delivered',
    'account.status_cancelled': 'Cancelled',
    'delivery.title': 'Delivery Options',
    'delivery.delivery': 'Delivery',
    'delivery.pickup': 'Pickup',
    'delivery.zone': 'Delivery Area',
    'delivery.selectZone': 'Select your area…',
    'delivery.fee': 'Delivery Fee',
    'delivery.pickupTitle': 'Pickup from Boutique',
    'delivery.pickupAddress': 'Amman, Jordan — Magic Avenue',
    'delivery.pickupHours': 'Mon–Sat: 8am – 5pm',
    'delivery.noZones': 'No delivery areas configured yet',
    'delivery.subtotal': 'Subtotal',
    'delivery.feeLabel': 'Delivery Fee'
  },
  ar: {
    'title.page': 'هات كاندي | كل قطعة حلوى تبدأ بالسحر',
    'nav.home': 'الرئيسية', 'nav.offers': 'العروض', 'nav.candies': 'الحلويات',
    'nav.about': 'من نحن', 'nav.gallery': 'المعرض', 'nav.contact': 'تواصل معنا', 'nav.account': 'حسابي',
    'hero.badge': 'علامة حلويات فاخرة',
    'hero.text': 'كل قطعة حلوى تبدأ بالسحر. نجمع بين الجودة الفاخرة والتقديم الأنيق والإبداع المرح لتحويل كل قطعة حلوى إلى تجربة لا تُنسى.',
    'hero.seeOffers': 'شاهد العروض', 'hero.buildMix': 'اصنع خلطتك',
    'offers.title': 'عروض لفترة محدودة',
    'offers.subtitle': 'عروض حلوة لن تدوم للأبد — احصل عليها قبل أن تنتهي!',
    'offers.empty': 'لا توجد عروض فعّالة حالياً.<br>عُد قريباً لمزيد من السحر ✨',
    'offers.grab': 'احصل على العرض', 'offers.save': 'وفّر',
    'banner.title': 'امزجها <span>على طريقتك</span> ✨',
    'banner.text': 'اختر الوزن، واختر التغليف، وامزج حلوياتك المفضلة في خلطة سحرية خاصة بك.',
    'banner.cta': 'ابدأ الآن',
    'candies.title': 'التشكيلة المميزة',
    'candies.subtitle': 'استمتع بتشكيلتنا المنتقاة — أضف مفضلاتك إلى السلة',
    'candies.add': 'أضف', 'candies.added': 'تمت الإضافة',
    'about.title': 'قصتنا السحرية',
    'about.p1': 'هات كاندي هي علامة حلويات فاخرة أُنشئت لتحويل كل قطعة حلوى إلى تجربة لا تُنسى. تجمع العلامة بين الجودة العالية والتقديم الأنيق والإبداع المرح، وتحتفي بمتعة التذوّق مع لمسة من الدهشة.',
    'about.p2': 'مستوحاة من شعارنا «كل قطعة حلوى تبدأ بالسحر»، نؤمن أن كل قطعة حلوى تبدأ من الخيال والعناية وقليل من السحر — لتجعل كل لقمة مميزة كاللحظة التي تصنعها.',
    'about.f1': 'مكونات فاخرة', 'about.f2': 'تقديم أنيق',
    'about.f3': 'علب هدايا فاخرة', 'about.f4': 'مصنوعة بحب',
    'gallery.title': 'السحر في كل تفصيلة',
    'gallery.subtitle': 'لمحة عن عالمنا من الحلويات الفاخرة والتغليف الأنيق',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'اطلب حلوياتك السحرية — الطلبات الإلكترونية متاحة ٢٤/٧',
    'contact.infoTitle': 'معلومات التواصل',
    'contact.infoText': 'يسعدنا سماعك! اطلب عبر الإنترنت في أي وقت، أو زُر متجرنا خلال ساعات العمل.',
    'contact.addressLabel': 'عنوان المتجر',
    'contact.address': 'عمّان، الأردن — شارع السحر',
    'contact.phoneLabel': 'الهاتف', 'contact.emailLabel': 'البريد الإلكتروني',
    'contact.hoursLabel': 'ساعات العمل',
    'contact.hours': 'الاثنين–السبت: ٨ص – ٥م | الإنترنت: ٢٤/٧',
    'contact.formName': 'الاسم الكامل', 'contact.formEmail': 'البريد الإلكتروني',
    'contact.formMessage': 'طلبك / رسالتك',
    'contact.send': 'إرسال الرسالة', 'contact.sending': 'جارٍ الإرسال...',
    'footer.copy': '© 2025 هات كاندي. جميع الحقوق محفوظة. كل قطعة حلوى تبدأ بالسحر.',
    'cart.title': 'سلتي', 'cart.item': 'عنصر', 'cart.items': 'عناصر',
    'cart.empty': 'سلتك فارغة.<br>أضف بعض السحر ✨',
    'cart.total': 'الإجمالي', 'cart.checkout': 'إتمام الشراء',
    'cart.customMix': 'خلطة خاصة ✨',
    'login.welcome': 'مرحباً بعودتك',
    'login.subtitle': 'سجّل الدخول إلى حسابك في هات كاندي',
    'login.almost': 'اقتربت من النهاية!',
    'login.almostSub': 'سجّل الدخول لإتمام طلبك',
    'login.callout': 'نحتاج بعض التفاصيل <strong>لإتمام طلبك</strong> وتوصيل حلوياتك السحرية.',
    'login.successTitle': 'تم تسجيل دخولك!',
    'login.successSub': 'جاهز لإتمام طلبك ✨',
    'login.successWelcome': 'مرحباً بعودتك، {name}! ✨',
    'login.google': 'المتابعة عبر جوجل',
    'login.googleSetup': 'تسجيل الدخول عبر Google يحتاج إلى إعداد Google Client ID.',
    'login.divider': 'أو تابع بالبريد الإلكتروني',
    'login.email': 'البريد الإلكتروني <span class="req">*</span>',
    'login.password': 'كلمة المرور <span class="req">*</span>',
    'login.phone': 'رقم الهاتف <span class="req">*</span>',
    'login.remember': 'تذكرني', 'login.forgot': 'نسيت كلمة المرور؟',
    'login.signin': 'تسجيل الدخول', 'login.signingIn': 'جارٍ تسجيل الدخول...',
    'login.noAccount': 'لست عضواً؟', 'login.createAccount': 'أنشئ حساباً',
    'login.change': 'تغيير', 'login.continue': 'متابعة',
    'mix.title': 'اصنع خلطتك الخاصة',
    'mix.subtitle': 'كل قطعة حلوى تبدأ بالسحر',
    'mix.step1': 'الوزن', 'mix.step2': 'التغليف', 'mix.step3': 'أنواع الحلوى', 'mix.step4': 'المراجعة',
    'mix.weightTitle': 'اختر الوزن',
    'mix.weightSub': 'من ١٠٠ غرام حتى ١ كيلو — اختر الحجم المثالي لخلطتك السحرية.',
    'mix.packTitle': 'اختر التغليف',
    'mix.packSub': 'كيف تريد تغليف خلطة الحلوى؟',
    'mix.typesTitle': 'اختر أنواع الحلوى',
    'mix.typesSub': 'كم عدد أنواع الحلوى التي تريد مزجها؟',
    'mix.typesLabel': 'أنواع',
    'mix.pickTypes': 'اختر الآن أنواع الحلوى',
    'mix.reviewTitle': 'راجع خلطتك الخاصة',
    'mix.reviewSub': 'نظرة أخيرة قبل إضافتها إلى سلتك.',
    'mix.yourMix': 'خلطتك الخاصة', 'mix.readyToAdd': 'جاهزة للإضافة إلى سلتك',
    'mix.weight': 'الوزن', 'mix.packaging': 'التغليف', 'mix.candyTypes': 'أنواع الحلوى',
    'mix.candySelection': 'اختيار الحلوى', 'mix.candy': 'الحلوى', 'mix.total': 'الإجمالي',
    'mix.back': 'السابق', 'mix.next': 'التالي', 'mix.addToCart': 'أضف إلى السلة',
    'mix.tapToChoose': 'اضغط بالأسفل للاختيار', 'mix.type': 'النوع',
    'mix.halfKilo': 'نصف كيلو', 'mix.fullKilo': 'كيلو كامل', 'mix.min': 'الحد الأدنى',
    'mix.kilogram': '١ كيلوغرام', 'mix.gramsLabel': '{w} غرام', 'mix.unitG': 'غ',
    'mix.free': 'مجاني', 'mix.customMix': 'خلطة خاصة ✨',
    'sign.open': 'مفتوح', 'sign.closed': 'مغلق',
    'sign.openNote': 'مفتوح الآن – اطلب عبر الإنترنت ✨',
    'sign.closedNote': 'مغلق – اطلب عبر الإنترنت ٢٤/٧ ✨',
    'toast.added': 'تمت إضافة {name} إلى السلة',
    'toast.removed': 'تم حذف العنصر',
    'toast.cartEmpty': 'سلتك فارغة',
    'toast.welcome': 'أهلاً بك، {name}!',
    'toast.signedInCheckout': 'تم تسجيل دخولك! أكمل عملية الشراء ✨',
    'toast.orderPlaced': 'تم تقديم الطلب! الإجمالي: {total}',
    'toast.paymentSetup': 'الدفع الآمن بالبطاقة غير مُعد بعد.',
    'toast.paymentStartFailed': 'تعذر بدء الدفع الآمن. حاول مرة أخرى.',
    'toast.fillFields': 'يرجى تعبئة جميع الحقول المطلوبة',
    'toast.validEmail': 'يرجى إدخال بريد إلكتروني صالح',
    'toast.validPhone': 'يرجى إدخال رقم أردني صالح (7X XXX XXXX)',
    'toast.enterPhone': 'يرجى إدخال رقم هاتفك',
    'toast.resetSent': 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك',
    'toast.thanks': 'شكراً لك، {name}! تم استلام رسالتك.',
    'toast.allSlots': 'كل الخانات ممتلئة. ألغِ اختيار واحدة للتبديل.',
    'toast.signedOut': 'تم تسجيل خروجك',
    'toast.addressAdded': 'تمت إضافة العنوان بنجاح',
    'toast.addressUpdated': 'تم تحديث العنوان',
    'toast.addressDeleted': 'تم حذف العنوان',
    'toast.addressDefaultSet': 'تم تحديث العنوان الافتراضي',
    'toast.needOneAddress': 'تحتاج إلى عنوان محفوظ واحد على الأقل',
    'toast.reordered': 'تمت إعادة العناصر إلى سلتك',
    'toast.ownerWelcome': 'مرحباً بعودتك أيها المطوّر ✨',
    'toast.adminWelcome': 'مرحباً بعودتك أيها المشرف ✨',
    'toast.productSaved': 'تم حفظ المنتج بنجاح',
    'toast.productDeleted': 'تم حذف المنتج',
    'toast.offerSaved': 'تم حفظ العرض بنجاح',
    'toast.offerDeleted': 'تم حذف العرض',
    'toast.galleryAdded': 'تمت إضافة صورة للمعرض',
    'toast.galleryRemoved': 'تم حذف الصورة',
    'toast.contentSaved': 'تم تحديث محتوى الموقع',
    'toast.dataExported': 'تم تصدير البيانات',
    'toast.dataImported': 'تم استيراد البيانات بنجاح',
    'toast.dataInvalid': 'صيغة الملف غير صحيحة',
    'toast.confirmDelete': 'اضغط مرة أخرى للتأكيد',
    'admin.back': 'العودة للمتجر',
    'admin.badge': 'مشرف',
    'admin.heroName': 'إدارة المتجر',
    'admin.heroSub': 'تحكم كامل بالطلبات والعملاء والإيرادات',
    'admin.tabOverview': 'نظرة عامة',
    'admin.tabOrders': 'الطلبات',
    'admin.tabCustomers': 'العملاء',
    'admin.tabProducts': 'المنتجات',
    'admin.tabMessages': 'الرسائل',
    'admin.kpiRevenue': 'إجمالي الإيرادات',
    'admin.kpiOrders': 'إجمالي الطلبات',
    'admin.kpiCustomers': 'العملاء',
    'admin.kpiAov': 'متوسط قيمة الطلب',
    'admin.kpiPending': 'طلبات قيد التنفيذ',
    'admin.kpiDelivered': 'إيرادات مكتملة',
    'admin.revenueChart': 'منحنى الإيرادات',
    'admin.last7': 'آخر ٧ أيام',
    'admin.topProducts': 'الأكثر مبيعاً',
    'admin.recentOrders': 'أحدث الطلبات',
    'admin.viewAll': 'عرض الكل',
    'admin.noData': 'لا توجد بيانات بعد',
    'admin.thOrder': 'الطلب',
    'admin.thCustomer': 'العميل',
    'admin.thItems': 'العناصر',
    'admin.thTotal': 'الإجمالي',
    'admin.thStatus': 'الحالة',
    'admin.thActions': 'إجراءات',
    'admin.thProduct': 'المنتج',
    'admin.thPrice': 'السعر',
    'admin.thStock': 'المخزون',
    'admin.thSold': 'المبيعات',
    'admin.thRevenue': 'الإيراد',
    'admin.thPhone': 'الهاتف',
    'admin.thCity': 'المدينة',
    'admin.thOrders': 'الطلبات',
    'admin.thSpent': 'إجمالي الإنفاق',
    'admin.thTier': 'التصنيف',
    'admin.thJoined': 'تاريخ الانضمام',
    'admin.all': 'الكل',
    'admin.export': 'تصدير CSV',
    'admin.exported': 'تم تصدير الطلبات بنجاح',
    'admin.advance': 'المرحلة التالية',
    'admin.searchCustomers': 'ابحث عن عميل…',
    'admin.payCard': 'بطاقة',
    'admin.payCod': 'الدفع عند الاستلام',
    'admin.stockIn': 'متوفر',
    'admin.stockLow': 'مخزون منخفض',
    'admin.stockOut': 'غير متوفر',
    'admin.tierVip': 'كبار العملاء',
    'admin.tierActive': 'نشط',
    'admin.tierNew': 'جديد',
    'admin.noMessages': 'لا توجد رسائل بعد',
    'admin.noMessagesSub': 'ستظهر هنا الرسائل المرسلة من نموذج التواصل.',
    'admin.markRead': 'تعليم كمقروءة',
    'admin.markUnread': 'تعليم كغير مقروءة',
    'admin.deleteMsg': 'حذف',
    'admin.statusUpdated': 'تم تحديث الطلب {id} إلى {status}',
    'admin.msgDeleted': 'تم حذف الرسالة',
    'admin.units': 'وحدة',
    'account.back': 'العودة للمتجر',
    'account.signout': 'تسجيل الخروج',
    'account.memberSince': 'عضو منذ 2025',
    'account.savedAddresses': 'عناوين محفوظة',
    'account.tabOrders': 'طلباتي',
    'account.tabTracking': 'تتبع الشحنة',
    'account.tabAddresses': 'العناوين',
    'account.statTotal': 'إجمالي الطلبات',
    'account.statActive': 'نشطة',
    'account.statDelivered': 'تم التوصيل',
    'account.statSpent': 'إجمالي الإنفاق',
    'account.orderId': 'طلب',
    'account.orderTotal': 'إجمالي الطلب',
    'account.trackOrder': 'تتبع',
    'account.reorder': 'إعادة الطلب',
    'account.noOrders': 'لا توجد طلبات بعد',
    'account.noOrdersSub': 'رحلتك الحلوة تبدأ من طلبك الأول ✨',
    'account.shopNow': 'تسوّق الآن',
    'account.noTracking': 'لا توجد شحنات نشطة',
    'account.noTrackingSub': 'عند تقديم طلب، يمكنك تتبعه هنا.',
    'account.trackingFor': 'تتبع الطلب',
    'account.stepPlaced': 'تم الطلب',
    'account.stepProcessing': 'قيد التجهيز',
    'account.stepPacking': 'قيد التغليف',
    'account.stepShipped': 'تم الشحن',
    'account.stepOut': 'خرج للتوصيل',
    'account.stepDelivered': 'تم التوصيل',
    'account.eta': 'التوصيل المتوقع',
    'account.deliveringTo': 'التوصيل إلى',
    'account.default': 'افتراضي',
    'account.edit': 'تعديل',
    'account.delete': 'حذف',
    'account.setDefault': 'تعيين افتراضي',
    'account.addNew': 'إضافة عنوان جديد',
    'account.addAddressTitle': 'إضافة عنوان جديد',
    'account.addAddressSub': 'أين نوصل حلوياتك السحرية؟',
    'account.editAddressTitle': 'تعديل العنوان',
    'account.fieldLabel': 'التسمية',
    'account.fieldName': 'الاسم الكامل',
    'account.fieldPhone': 'رقم الهاتف',
    'account.fieldCity': 'المدينة',
    'account.fieldArea': 'المنطقة / الحي',
    'account.fieldLine': 'الشارع، المبنى، الطابق، الشقة',
    'account.labelHome': 'المنزل',
    'account.labelWork': 'العمل',
    'account.labelOther': 'أخرى',
    'account.cancel': 'إلغاء',
    'account.save': 'حفظ العنوان',
    'account.cartNotice': 'لديك {n} عنصر في سلتك بانتظار إتمام الشراء.',
    'account.goToCart': 'الذهاب للسلة',
    'account.status_processing': 'قيد التجهيز',
    'account.status_packing': 'قيد التغليف',
    'account.status_shipped': 'تم الشحن',
    'account.status_out_for_delivery': 'خرج للتوصيل',
    'account.status_delivered': 'تم التوصيل',
    'account.status_cancelled': 'ملغي',
    'delivery.title': 'خيارات التوصيل',
    'delivery.delivery': 'توصيل',
    'delivery.pickup': 'استلام من المحل',
    'delivery.zone': 'منطقة التوصيل',
    'delivery.selectZone': 'اختر منطقتك…',
    'delivery.fee': 'رسوم التوصيل',
    'delivery.pickupTitle': 'الاستلام من المتجر',
    'delivery.pickupAddress': 'عمّان، الأردن — شارع السحر',
    'delivery.pickupHours': 'الاثنين–السبت: ٨ص – ٥م',
    'delivery.noZones': 'لا توجد مناطق توصيل مُعدّة',
    'delivery.subtotal': 'المجموع الفرعي',
    'delivery.feeLabel': 'رسوم التوصيل'
  }
};

/* ===== DEFAULT DATA ===== */
const DEFAULT_PRODUCTS = [
  { id: 'gummies', name: 'Gourmet Gummies', name_ar: 'حلوى الجيلي الفاخرة', desc: 'Soft, fruity, and bursting with natural flavors. A luxurious twist on a classic favorite.', desc_ar: 'ناعمة، فاكهية، ومليئة بالنكهات الطبيعية. لمسة فاخرة على حلوى كلاسيكية.', price: 8.99, oldPrice: 12.99, badge: 'Bestseller', badge_ar: 'الأكثر مبيعاً', stock: 140, img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600' },
  { id: 'truffles', name: 'Velvet Truffles', name_ar: 'ترافل مخملي', desc: 'Rich, creamy chocolate ganache coated in premium Belgian cocoa.', desc_ar: 'غاناش شوكولاتة غني وكريمي مغطى بمسحوق الكاكاو البلجيكي الفاخر.', price: 14.99, oldPrice: 19.99, badge: 'Premium', badge_ar: 'فاخر', stock: 62, img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600' },
  { id: 'lollipops', name: 'Honey Swirl Pops', name_ar: 'مصاصات العسل', desc: 'Colorful artisan lollipops crafted with real honey and natural fruit extracts.', desc_ar: 'مصاصات ملونة حرفية مصنوعة من العسل الطبيعي وخلاصات الفواكه.', price: 6.99, oldPrice: 9.99, badge: 'New', badge_ar: 'جديد', stock: 18, img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=600' },
  { id: 'cloud', name: 'Cloud Candy', name_ar: 'حلوى السحاب', desc: 'Fluffy, melt-in-your-mouth cotton candy in assorted magical pastel colors.', desc_ar: 'غزل البنات الهش الذائب في الفم بألوان باستيل سحرية متنوعة.', price: 7.99, oldPrice: 10.99, badge: 'New', badge_ar: 'جديد', stock: 95, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600' },
  { id: 'sours', name: 'Zesty Sours', name_ar: 'حلوى حامضة', desc: 'Tangy and sweet gummy worms with a delicate sour sugar coating.', desc_ar: 'ديدان جيلي حامضة وحلوة مع طبقة رقيقة من السكر الحامض.', price: 8.49, oldPrice: 11.99, badge: 'Bestseller', badge_ar: 'الأكثر مبيعاً', stock: 8, img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600' },
  { id: 'caramel', name: 'Golden Caramel Corn', name_ar: 'فشار الكراميل الذهبي', desc: 'Crunchy popcorn coated in buttery, sweet honey caramel glaze.', desc_ar: 'فشار مقرمش مغطى بطبقة الكراميل بالزبدة والعسل.', price: 9.99, oldPrice: 13.99, badge: 'Premium', badge_ar: 'فاخر', stock: 34, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600' }
];

const DEFAULT_OFFERS = [
  { id: 'offer-love-box', name: 'Love Box Special', name_ar: 'علبة الحب الخاصة', desc: 'A romantic assortment of our finest gummies, truffles & swirl pops in a heart-shaped box.', desc_ar: 'تشكيلة رومانسية من أفخر الجيلي والترافل ومصاصات العسل في علبة على شكل قلب.', category: 'Valentine Special', category_ar: 'عرض الفالنتاين', discount: '35% OFF', discount_ar: 'خصم ٣٥٪', price: 24.99, oldPrice: 38.99, ends: 'Ends in 3 days', ends_ar: 'ينتهي خلال ٣ أيام', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600', isActive: true },
  { id: 'offer-family-pack', name: 'Family Magic Pack', name_ar: 'علبة العائلة السحرية', desc: '6 gourmet candy bags — perfect for sharing the magic with everyone you love.', desc_ar: '٦ أكياس حلوى فاخرة — مثالية لمشاركة السحر مع كل من تحب.', category: 'Bundle Deal', category_ar: 'عرض مجمّع', discount: '40% OFF', discount_ar: 'خصم ٤٠٪', price: 44.99, oldPrice: 74.99, ends: 'Ends in 5 days', ends_ar: 'ينتهي خلال ٥ أيام', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', isActive: true },
  { id: 'offer-truffle-trio', name: 'Truffle Lover Trio', name_ar: 'ثلاثية عشّاق الترافل', desc: 'Three premium truffle flavors: Belgian Dark, Milk Silk & White Vanilla Dream.', desc_ar: 'ثلاث نكهات ترافل فاخرة: الشوكولاتة الداكنة البلجيكية، الحليب الحريري، والفانيليا البيضاء.', category: 'Premium Deal', category_ar: 'عرض فاخر', discount: '25% OFF', discount_ar: 'خصم ٢٥٪', price: 32.99, oldPrice: 43.99, ends: 'Ends in 2 days', ends_ar: 'ينتهي خلال يومين', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', isActive: true }
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
  { id: 'gummy-bears', name: 'Gummy Bears', name_ar: 'دببة الجيلي', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', color: '#e2015d', price_per_kg: 12.00 },
  { id: 'sour-worms', name: 'Sour Worms', name_ar: 'ديدان حامضة', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#22c55e', price_per_kg: 11.00 },
  { id: 'chocolate', name: 'Chocolate Truffles', name_ar: 'ترافل الشوكولاتة', img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', color: '#7b3f00', price_per_kg: 18.00 },
  { id: 'lollipops', name: 'Swirl Lollipops', name_ar: 'مصاصات ملتوية', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=300', color: '#fd5183', price_per_kg: 9.00 },
  { id: 'cotton-candy', name: 'Cloud Candy', name_ar: 'حلوى السحاب', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#fdba74', price_per_kg: 10.00 },
  { id: 'jelly-beans', name: 'Jelly Beans', name_ar: 'حبوب الجيلي', img: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300', color: '#facc43', price_per_kg: 13.00 },
  { id: 'marshmallows', name: 'Marshmallows', name_ar: 'مارشميلو', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', color: '#fef3c7', price_per_kg: 8.00 },
  { id: 'caramel', name: 'Caramel Bites', name_ar: 'قطع الكراميل', img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', color: '#d97706', price_per_kg: 15.00 }
];

const DEFAULT_DELIVERY_ZONES = [
  { id: 'z1', name: 'Amman', name_ar: 'عمان', price: 2.00, active: true },
  { id: 'z2', name: 'Zarqa', name_ar: 'الزرقاء', price: 3.00, active: true },
  { id: 'z3', name: 'Irbid', name_ar: 'إربد', price: 3.50, active: true },
  { id: 'z4', name: 'Aqaba', name_ar: 'العقبة', price: 5.00, active: true },
  { id: 'z5', name: 'Salt', name_ar: 'السلط', price: 2.50, active: true }
];

/* ===== MUTABLE STATE ===== */
let products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
let offers = JSON.parse(JSON.stringify(DEFAULT_OFFERS));
let galleryImages = JSON.parse(JSON.stringify(DEFAULT_GALLERY));
let mixWeights = [...DEFAULT_MIX_WEIGHTS];
let mixPackaging = JSON.parse(JSON.stringify(DEFAULT_MIX_PACKAGING));
let candyTypes = JSON.parse(JSON.stringify(DEFAULT_CANDY_TYPES));
let deliveryZones = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_ZONES));
let contentOverrides = {};

let cart = [];
let currentUser = null;
let checkoutIntent = false;
let cartDelivery = { method: 'delivery', zoneId: null };
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
  { id: 'msg-1', name: 'Noor Ali', email: 'noor.ali@example.com', date: '2025-12-08', read: false, message: 'مرحبا، بدي أطلب علبة هدايا كبيرة للمناسبة، هل ممكن التوصيل قبل يوم الخميس؟' },
  { id: 'msg-2', name: 'Mohammad Zaid', email: 'm.zaid@example.com', date: '2025-12-07', read: true, message: 'Do you offer corporate gift boxes with custom branding? We need 50 boxes for an event.' },
  { id: 'msg-3', name: 'Dana Sami', email: 'dana.sami@example.com', date: '2025-12-05', read: false, message: 'أحببت خلطة الترافل! هل متوفرة بنكهة الفستق؟' }
];

/* ===== CONFIG ===== */
const ADMIN_EMAIL = '123321';
const ADMIN_PASSWORD = '123321';
const GOOGLE_CLIENT_ID = window.HATCANDY_GOOGLE_CLIENT_ID || '';
const PAYMENT_CHECKOUT_ENDPOINT = window.HATCANDY_PAYMENT_CHECKOUT_ENDPOINT || '';
const OWNER_PHONE_DIGITS = ['0782342105', '962782342105', '782342105'];
const PRICE_PER_GRAM = 0.023;
const OPEN_HOUR = 8, CLOSE_HOUR = 17;
const STATUS_FLOW = ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

/* ===== APP STATE ===== */
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

/* ===== HELPERS ===== */
function t(key, vars) {
  const dict = I18N[lang] || I18N.en;
  let s = dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
  if (vars) { for (const k in vars) s = s.split('{' + k + '}').join(vars[k]); }
  return s;
}
function L(obj, field) { return (lang === 'ar' && obj[field + '_ar']) ? obj[field + '_ar'] : obj[field]; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])); }
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}
function statusIcon(s) {
  return { processing: 'bx bx-time-five', packing: 'bx bx-archive', shipped: 'bx bx-package', out_for_delivery: 'bx bx-cycling', delivered: 'bx bx-check-circle', cancelled: 'bx bx-x-circle' }[s] || 'bx bx-package';
}
function custById(id) { return customers.find(c => c.id === id) || { name: 'Guest', email: '—', phone: '—', city: '—' }; }
function customerStats(id) {
  const list = orderHistory.filter(o => o.customerId === id && o.status !== 'cancelled');
  return { orders: list.length, spent: list.reduce((s, o) => s + o.total, 0) };
}
function registerCustomer(user) {
  let c = customers.find(x => x.email && user.email && x.email.toLowerCase() === user.email.toLowerCase());
  if (!c) {
    c = { id: 'c-' + Date.now(), name: user.name || 'Guest', email: user.email || '', phone: user.phone || '', city: 'Amman', joined: new Date().toISOString().split('T')[0], tier: 'new' };
    customers.push(c);
  } else if (user.phone) { c.phone = user.phone; }
  return c;
}
function customerOrders() {
  if (!currentUser) return [];
  const email = (currentUser.email || '').toLowerCase();
  return orderHistory.filter(order => order.customerId === currentUser.id || (order.customerEmail && order.customerEmail.toLowerCase() === email));
}
function workspaceKey(user = currentUser) {
  return 'hatcandy-workspace-' + ((user && user.email) || 'guest').trim().toLowerCase();
}
function loadCustomerWorkspace(user) {
  try {
    const stored = localStorage.getItem(workspaceKey(user));
    if (stored) {
      const data = JSON.parse(stored);
      savedAddresses = Array.isArray(data.addresses) ? data.addresses : [];
      return;
    }
  } catch (e) {}
  savedAddresses = user.id === 'c-1001' ? [
    { id: 'addr-1', label: 'home', name: 'Ahmad Al-Rashid', phone: '+962 7 9876 5432', city: 'Amman', area: 'Abdoun', line: 'Magic Avenue, Building 5, Floor 2, Apt 201', isDefault: true },
    { id: 'addr-2', label: 'work', name: 'Ahmad Al-Rashid', phone: '+962 7 9876 5432', city: 'Amman', area: 'Sweifieh', line: 'Rainbow Street, Office 12, 3rd Floor', isDefault: false }
  ] : [];
}
function saveCustomerWorkspace() {
  if (!currentUser) return;
  try { localStorage.setItem(workspaceKey(), JSON.stringify({ addresses: savedAddresses })); } catch (e) {}
}
function validateJordanPhone(phone) {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 9 && clean.startsWith('7')) return true;
  if (clean.length === 10 && clean.startsWith('07')) return true;
  if (clean.length === 12 && clean.startsWith('9627')) return true;
  return false;
}
function isOwnerPhone(phone) {
  const clean = (phone || '').replace(/\D/g, '');
  return OWNER_PHONE_DIGITS.includes(clean);
}

/* ===== ELEMENTS ===== */
const $ = (id) => document.getElementById(id);

const cartPanel = $('cartPanel'), cartBtn = $('cartBtn'), cartClose = $('cartClose');
const cartItemsEl = $('cartItems'), cartBadge = $('cartBadge'), cartItemCount = $('cartItemCount');
const cartTotalEl = $('cartTotal'), checkoutBtn = $('checkoutBtn');
const loginPanel = $('loginPanel'), loginBtn = $('loginBtn'), loginClose = $('loginClose');
const loginForm = $('loginForm'), loginFormWrapper = $('loginFormWrapper'), loginSuccess = $('loginSuccess');
const successMessage = $('successMessage'), loginTitle = $('loginTitle'), loginSubtitle = $('loginSubtitle');
const loginCallout = $('loginCallout'), loginDivider = $('loginDivider');
const googleBtn = $('googleBtn'), googlePreview = $('googlePreview'), googlePhoneReveal = $('googlePhoneReveal');
const googleContinue = $('googleContinue'), googleChange = $('googleChange');
const googleAvatar = $('googleAvatar'), googleName = $('googleName'), googleEmail = $('googleEmail');
const googlePhone = $('googlePhone'), userInitial = $('userInitial');
const overlay = $('overlay'), floatingSign = $('floatingSign'), toast = $('toast'), toastMessage = $('toastMessage');
const mixModal = $('mixModal'), mixBackdrop = $('mixBackdrop'), mixClose = $('mixClose');
const mixBackBtn = $('mixBackBtn'), mixNextBtn = $('mixNextBtn');
const mixWeightGrid = $('mixWeightGrid'), mixPackGrid = $('mixPackGrid'), mixTypesGrid = $('mixTypesGrid');
const mixSlots = $('mixSlots'), mixCountMinus = $('mixCountMinus'), mixCountPlus = $('mixCountPlus');
const mixCountNumber = $('mixCountNumber'), mixReview = $('mixReview');
const langToggle = $('langToggle'), langLabel = $('langLabel');
const mobileAccountBtn = $('mobileAccountBtn'), mobileAccountInitial = $('mobileAccountInitial');
const accountPageEl = $('accountPage'), adminPageEl = $('adminPage'), ownerPageEl = $('ownerPage');
const galleryGridEl = $('galleryGrid'), offersGrid = $('offersGrid'), candyGrid = $('candyGrid');
function syncMobileAccount(user) {
  if (!mobileAccountBtn || !mobileAccountInitial) return;
  mobileAccountBtn.classList.toggle('signed-in', Boolean(user));
  mobileAccountInitial.textContent = ((user && (user.name || user.email)) || 'H').charAt(0).toUpperCase();
}

/* ===== PERSISTENCE ===== */
const LS_KEYS = {
  products: 'hatcandy-products', offers: 'hatcandy-offers',
  gallery: 'hatcandy-gallery', content: 'hatcandy-content', contact: 'hatcandy-contact',
  mixWeights: 'hatcandy-mix-weights', mixPackaging: 'hatcandy-mix-packaging',
  candyTypes: 'hatcandy-candy-types', deliveryZones: 'hatcandy-delivery-zones',
  customers: 'hatcandy-customers', orders: 'hatcandy-orders'
};
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
    localStorage.setItem(LS_KEYS.customers, JSON.stringify(customers));
    localStorage.setItem(LS_KEYS.orders, JSON.stringify(orderHistory));
    const phEl = document.querySelector('[data-contact-phone]'), emEl = document.querySelector('[data-contact-email]');
    localStorage.setItem(LS_KEYS.contact, JSON.stringify({ phone: phEl ? phEl.textContent : '', email: emEl ? emEl.textContent : '' }));
  } catch (e) {}
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
    const cs = localStorage.getItem(LS_KEYS.customers); if (cs) customers = JSON.parse(cs);
    const oh = localStorage.getItem(LS_KEYS.orders); if (oh) orderHistory = JSON.parse(oh);
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
      const phEl = document.querySelector('[data-contact-phone]');
      const emEl = document.querySelector('[data-contact-email]');
      if (obj.phone && phEl) phEl.textContent = obj.phone;
      if (obj.email && emEl) emEl.textContent = obj.email;
    }
  } catch (e) {}
}

/* ===== TOAST & PANELS ===== */
function showToast(msg, icon = 'bx-check-circle') {
  toast.querySelector('i').className = 'bx ' + icon;
  toastMessage.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}
function openPanel(panel) { panel.classList.add('show'); overlay.classList.add('show'); document.body.classList.add('no-scroll'); floatingSign.classList.add('hide'); }
function closeAllPanels() {
  cartPanel.classList.remove('show'); loginPanel.classList.remove('show');
  overlay.classList.remove('show'); document.body.classList.remove('no-scroll'); floatingSign.classList.remove('hide');
}

/* ===== CART CALC ===== */
function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    if (item.isMix) return sum + (item.price * item.qty);
    const p = products.find(x => x.id === item.id) || offers.find(x => x.id === item.id);
    if (!p) return sum;
    return sum + (p.price * item.qty);
  }, 0);
}
function getDeliveryFee() {
  if (cartDelivery.method === 'pickup') return 0;
  const z = deliveryZones.find(z => z.id === cartDelivery.zoneId);
  return z ? Number(z.price) : 0;
}
function calcMixPrice() {
  if (!mixState.weight || !mixState.packaging || !mixState.selectedTypes.length) return 0;
  const selected = mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)).filter(Boolean);
  if (!selected.length) return 0;
  const avgPricePerKg = selected.reduce((s, tp) => s + (Number(tp.price_per_kg) || 0), 0) / selected.length;
  const candyCost = avgPricePerKg * (mixState.weight / 1000);
  return candyCost + (Number(mixState.packaging.extra) || 0);
}

/* ===== RENDER: OFFERS ===== */
function renderOffers() {
  const activeOffers = offers.filter(o => o.isActive);
  if (activeOffers.length === 0) {
    offersGrid.innerHTML = `<div class="offers-empty"><i class='bx bx-time-five'></i><p>${t('offers.empty')}</p></div>`;
    return;
  }
  offersGrid.innerHTML = activeOffers.map(o => `
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
    </article>
  `).join('');
}

/* ===== RENDER: CANDIES ===== */
function renderCandies() {
  candyGrid.innerHTML = products.map(p => `
    <div class="candy-card reveal">
      <div class="candy-card-img"><span class="candy-badge">${esc(L(p, 'badge') || '')}</span><img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}"></div>
      <div class="candy-card-body">
        <h3>${esc(L(p, 'name'))}</h3>
        <p>${esc(L(p, 'desc') || '')}</p>
        <div class="candy-price-row">
          <span class="price">$${Number(p.price).toFixed(2)}${p.oldPrice ? `<s>$${Number(p.oldPrice).toFixed(2)}</s>` : ''}</span>
          <button class="add-to-cart-btn" data-id="${esc(p.id)}"><i class='bx bx-cart-add'></i> ${t('candies.add')}</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ===== RENDER: GALLERY ===== */
function renderGallery() {
  if (!galleryGridEl) return;
  galleryGridEl.innerHTML = galleryImages.map(g => `
    <div class="gallery-item reveal"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"></div>
  `).join('');
}

/* ===== MIX RENDERERS ===== */
function renderMixWeights() {
  mixWeightGrid.classList.toggle('compact', mixWeights.length > 8);
  mixWeightGrid.innerHTML = mixWeights.map(w => {
    const isSelected = mixState.weight === w;
    let tag = '';
    if (w === 500) tag = `<span class="mix-weight-tag">${t('mix.halfKilo')}</span>`;
    else if (w === 1000) tag = `<span class="mix-weight-tag">${t('mix.fullKilo')}</span>`;
    else if (w === 100) tag = `<span class="mix-weight-tag">${t('mix.min')}</span>`;
    const label = w === 1000 ? t('mix.kilogram') : t('mix.gramsLabel', { w: w });
    return `<div class="mix-weight-pill ${isSelected ? 'selected' : ''}" data-weight="${w}">${tag}<div class="mix-weight-amount">${w}<small style="font-size:0.55em;">${t('mix.unitG')}</small></div><div class="mix-weight-label">${label}</div></div>`;
  }).join('');
}

function renderMixPackaging() {
  mixPackGrid.innerHTML = mixPackaging.map(p => {
    const isSelected = mixState.packaging && mixState.packaging.id === p.id;
    const priceText = Number(p.extra) === 0 ? t('mix.free') : `+$${Number(p.extra).toFixed(2)}`;
    const visual = p.img
      ? `<img src="${esc(p.img)}" alt="${esc(L(p,'name'))}">`
      : `<i class='bx ${p.icon || 'bx-box'}'></i>`;
    return `<div class="mix-pack-card ${isSelected ? 'selected' : ''}" data-pack="${esc(p.id)}"><div class="mix-pack-icon">${visual}</div><div class="mix-pack-name">${esc(L(p, 'name'))}</div><div class="mix-pack-desc">${esc(L(p, 'desc') || '')}</div><div class="mix-pack-price ${Number(p.extra) === 0 ? 'free' : ''}">${priceText}</div></div>`;
  }).join('');
}

function renderMixSlots() {
  const slots = [];
  for (let i = 0; i < mixState.typesCount; i++) {
    const typeId = mixState.selectedTypes[i];
    const type = typeId ? candyTypes.find(c => c.id === typeId) : null;
    slots.push(`<div class="mix-slot"><div class="mix-slot-num">${i + 1}</div><div class="mix-slot-info"><div class="mix-slot-label">${t('mix.type')} ${i + 1}</div><div class="mix-slot-value ${type ? '' : 'empty'}">${type ? `<span class="mix-type-color" style="background:${type.color};"></span>${esc(L(type, 'name'))}` : t('mix.tapToChoose')}</div></div></div>`);
  }
  mixSlots.innerHTML = slots.join('');
}

function renderMixTypesGrid() {
  const selectedSet = new Set(mixState.selectedTypes);
  mixTypesGrid.innerHTML = candyTypes.map(c => {
    const isSelected = selectedSet.has(c.id);
    return `<div class="mix-type-card ${isSelected ? 'selected' : ''}" data-type="${c.id}"><img class="mix-type-img" src="${esc(c.img)}" alt="${esc(L(c, 'name'))}"><div class="mix-type-info"><div class="mix-type-name"><span class="mix-type-color" style="background:${c.color};"></span>${esc(L(c, 'name'))}</div><div class="mix-type-price">$${Number(c.price_per_kg).toFixed(2)}/kg</div></div></div>`;
  }).join('');
}

function renderMixReview() {
  const p = mixState.packaging;
  const total = calcMixPrice();
  const selected = mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)).filter(Boolean);
  const avgPerKg = selected.length ? selected.reduce((s, tp) => s + (Number(tp.price_per_kg) || 0), 0) / selected.length : 0;
  const candyCost = avgPerKg * (mixState.weight / 1000);
  const packExtra = p ? Number(p.extra) || 0 : 0;
  mixReview.innerHTML = `
    <div class="mix-review-hero"><i class='bx bxs-magic-wand'></i><h3>${t('mix.yourMix')}</h3><p>${t('mix.readyToAdd')}</p></div>
    <div class="mix-review-grid">
      <div class="mix-review-card"><div class="label">${t('mix.weight')}</div><div class="value">${mixState.weight} ${t('mix.unitG')}</div></div>
      <div class="mix-review-card"><div class="label">${t('mix.packaging')}</div><div class="value" style="font-size:1.15rem;">${p ? esc(L(p, 'name')) : '—'}</div></div>
      <div class="mix-review-card"><div class="label">${t('mix.candyTypes')}</div><div class="value">${mixState.selectedTypes.length}</div></div>
    </div>
    <div class="mix-review-types"><div class="label">${t('mix.candySelection')}</div><div class="mix-review-types-list">
      ${selected.map(c => `<span class="mix-review-type-chip"><span class="dot" style="background:${c.color};"></span>${esc(L(c, 'name'))} · $${Number(c.price_per_kg).toFixed(2)}/kg</span>`).join('')}
    </div></div>
    <div class="mix-review-total">
      <div>
        <div class="mix-review-total-label">${t('mix.candy')} (${mixState.weight}${t('mix.unitG')})</div>
        <div class="mix-review-sub">$${candyCost.toFixed(2)} <span style="font-size:0.72rem;opacity:.7;">($${avgPerKg.toFixed(2)}/kg)</span></div>
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
  document.querySelectorAll('.mix-progress-line').forEach((line, i) => line.classList.toggle('done', i + 1 < mixState.step));
  document.querySelectorAll('.mix-pane').forEach(p => p.classList.toggle('active', parseInt(p.dataset.pane) === mixState.step));
  mixBackBtn.disabled = mixState.step === 1;
  const nextIcon = lang === 'ar' ? 'bx-left-arrow-alt' : 'bx-right-arrow-alt';
  if (mixState.step === 4) { mixNextBtn.innerHTML = `<i class='bx bx-cart-add'></i> <span>${t('mix.addToCart')}</span>`; mixNextBtn.classList.add('grab'); }
  else { mixNextBtn.innerHTML = `<span>${t('mix.next')}</span> <i class='bx ${nextIcon}'></i>`; mixNextBtn.classList.remove('grab'); }
  if (mixState.step === 1) mixNextBtn.disabled = !mixState.weight;
  else if (mixState.step === 2) mixNextBtn.disabled = !mixState.packaging;
  else if (mixState.step === 3) { const filled = mixState.selectedTypes.filter(Boolean).length; mixNextBtn.disabled = filled < mixState.typesCount; }
  else mixNextBtn.disabled = false;
}

function goToMixStep(step) {
  mixState.step = step;
  if (step === 3) {
    renderMixSlots(); renderMixTypesGrid();
    mixCountNumber.textContent = mixState.typesCount;
    mixCountMinus.disabled = mixState.typesCount <= 1;
    mixCountPlus.disabled = mixState.typesCount >= 6;
  }
  if (step === 4) renderMixReview();
  updateMixStep();
  document.querySelector('.mix-body').scrollTop = 0;
}

function openMixModal() {
  mixState.step = 1; mixState.weight = null; mixState.packaging = null; mixState.typesCount = 1; mixState.selectedTypes = [];
  renderMixWeights(); renderMixPackaging(); renderMixSlots(); renderMixTypesGrid(); renderMixReview(); updateMixStep();
  mixModal.classList.add('show');
  document.body.classList.add('no-scroll');
  floatingSign.classList.add('hide');
}
function closeMixModal() {
  mixModal.classList.remove('show');
  if (!cartPanel.classList.contains('show') && !loginPanel.classList.contains('show') && !accountPageEl.classList.contains('show') && !adminPageEl.classList.contains('show') && !ownerPageEl.classList.contains('show')) {
    document.body.classList.remove('no-scroll');
    floatingSign.classList.remove('hide');
  }
}

/* ===== MIX EVENTS ===== */
$('heroMixBtn').addEventListener('click', openMixModal);
$('bannerMixBtn').addEventListener('click', openMixModal);
mixClose.addEventListener('click', closeMixModal);
mixBackdrop.addEventListener('click', closeMixModal);
mixWeightGrid.addEventListener('click', (e) => {
  const pill = e.target.closest('.mix-weight-pill'); if (!pill) return;
  mixState.weight = parseInt(pill.dataset.weight); renderMixWeights(); mixNextBtn.disabled = false;
});
mixPackGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.mix-pack-card'); if (!card) return;
  mixState.packaging = mixPackaging.find(p => p.id === card.dataset.pack); renderMixPackaging(); mixNextBtn.disabled = false;
});
mixCountMinus.addEventListener('click', () => {
  if (mixState.typesCount > 1) {
    mixState.typesCount--;
    mixState.selectedTypes = mixState.selectedTypes.slice(0, mixState.typesCount);
    renderMixSlots(); renderMixTypesGrid();
    mixCountNumber.textContent = mixState.typesCount;
    mixCountMinus.disabled = mixState.typesCount <= 1;
    mixCountPlus.disabled = mixState.typesCount >= 6;
    updateMixStep();
  }
});
mixCountPlus.addEventListener('click', () => {
  if (mixState.typesCount < 6) {
    mixState.typesCount++;
    mixCountNumber.textContent = mixState.typesCount;
    mixCountMinus.disabled = mixState.typesCount <= 1;
    mixCountPlus.disabled = mixState.typesCount >= 6;
    renderMixSlots(); renderMixTypesGrid(); updateMixStep();
  }
});
mixTypesGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.mix-type-card'); if (!card) return;
  const typeId = card.dataset.type;
  const idx = mixState.selectedTypes.indexOf(typeId);
  if (idx !== -1) mixState.selectedTypes.splice(idx, 1);
  else {
    if (mixState.selectedTypes.length >= mixState.typesCount) { showToast(t('toast.allSlots'), 'bx-info-circle'); return; }
    mixState.selectedTypes.push(typeId);
  }
  renderMixSlots(); renderMixTypesGrid(); updateMixStep();
});
mixBackBtn.addEventListener('click', () => { if (mixState.step > 1) goToMixStep(mixState.step - 1); });
mixNextBtn.addEventListener('click', () => {
  if (mixState.step < 4) goToMixStep(mixState.step + 1);
  else {
    const total = calcMixPrice();
    const mixId = 'mix-' + Date.now();
    cart.push({
      id: mixId, isMix: true,
      weight: mixState.weight, packaging: mixState.packaging,
      types: mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)),
      price: total, qty: 1,
      img: mixState.selectedTypes[0] ? candyTypes.find(c => c.id === mixState.selectedTypes[0]).img : (candyTypes[0] ? candyTypes[0].img : '')
    });
    renderCart();
    showToast(t('toast.added', { name: t('mix.customMix') }), 'bx-party');
    closeMixModal();
    setTimeout(() => openPanel(cartPanel), 400);
  }
});

/* ===== CART RENDER ===== */
function renderDeliverySection() {
  const body = $('deliveryBody');
  document.querySelectorAll('.delivery-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.deliveryMethod === cartDelivery.method));
  if (cartDelivery.method === 'pickup') {
    body.innerHTML = `<div class="delivery-pickup-info"><i class='bx bx-store'></i><div><strong>${t('delivery.pickupTitle')}</strong><span>${t('delivery.pickupAddress')}<br>${t('delivery.pickupHours')}</span></div></div>`;
  } else {
    const active = deliveryZones.filter(z => z.active);
    if (!active.length) { body.innerHTML = `<div class="delivery-empty">${t('delivery.noZones')}</div>`; return; }
    body.innerHTML = `
      <label>${t('delivery.zone')}</label>
      <select class="delivery-select" id="deliveryZoneSelect">
        <option value="">${t('delivery.selectZone')}</option>
        ${active.map(z => `<option value="${z.id}" ${cartDelivery.zoneId === z.id ? 'selected' : ''}>${esc(L(z, 'name'))} — $${Number(z.price).toFixed(2)}</option>`).join('')}
      </select>
      ${cartDelivery.zoneId ? (() => { const z = deliveryZones.find(x => x.id === cartDelivery.zoneId); return z ? `<div class="delivery-fee-row"><span>${t('delivery.fee')}</span><span class="fee-value">$${Number(z.price).toFixed(2)}</span></div>` : ''; })() : ''}
    `;
    const sel = $('deliveryZoneSelect');
    if (sel) sel.addEventListener('change', (e) => { cartDelivery.zoneId = e.target.value || null; renderCart(); });
  }
}
function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalQty;
  cartBadge.classList.toggle('show', totalQty > 0);
  cartItemCount.textContent = totalQty === 1 ? `1 ${t('cart.item')}` : `${totalQty} ${t('cart.items')}`;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty"><i class='bx bx-shopping-bag'></i><p>${t('cart.empty')}</p></div>`;
    cartTotalEl.textContent = '$0.00';
    $('deliverySection').style.display = 'none';
    const footer = document.querySelector('.cart-footer');
    const extra = footer.querySelector('.cart-extra-rows'); if (extra) extra.innerHTML = '';
    return;
  }
  $('deliverySection').style.display = 'block';
  cartItemsEl.innerHTML = cart.map(item => {
    if (item.isMix) {
      const typesList = item.types.map(x => L(x, 'name')).join(' • ');
      return `<div class="cart-item" data-id="${item.id}"><div class="cart-item-img"><img src="${item.img}" alt="${t('mix.customMix')}"></div><div class="cart-item-info"><h4>${t('cart.customMix')}</h4><div class="item-meta">${item.weight}${t('mix.unitG')} • ${esc(L(item.packaging, 'name'))}<br>${esc(typesList)}</div><span class="item-price">$${(item.price * item.qty).toFixed(2)}</span><div class="cart-item-controls"><button class="qty-btn" data-action="dec" data-id="${item.id}">−</button><span class="qty-value">${item.qty}</span><button class="qty-btn" data-action="inc" data-id="${item.id}">+</button></div></div><button class="item-remove" data-action="remove" data-id="${item.id}"><i class='bx bx-trash'></i></button></div>`;
    }
    const p = products.find(x => x.id === item.id) || offers.find(x => x.id === item.id);
    if (!p) return '';
    return `<div class="cart-item" data-id="${p.id}"><div class="cart-item-img"><img src="${p.img}" alt="${esc(L(p, 'name'))}"></div><div class="cart-item-info"><h4>${esc(L(p, 'name'))}</h4><span class="item-price">$${(p.price * item.qty).toFixed(2)}</span><div class="cart-item-controls"><button class="qty-btn" data-action="dec" data-id="${p.id}">−</button><span class="qty-value">${item.qty}</span><button class="qty-btn" data-action="inc" data-id="${p.id}">+</button></div></div><button class="item-remove" data-action="remove" data-id="${p.id}"><i class='bx bx-trash'></i></button></div>`;
  }).join('');
  renderDeliverySection();
  const subtotal = getCartSubtotal();
  const fee = getDeliveryFee();
  const total = subtotal + fee;
  const footer = document.querySelector('.cart-footer');
  let extra = footer.querySelector('.cart-extra-rows');
  if (!extra) { extra = document.createElement('div'); extra.className = 'cart-extra-rows'; footer.insertBefore(extra, footer.firstChild); }
  extra.innerHTML = `
    <div class="cart-subtotal-row"><span>${t('delivery.subtotal')}</span><span class="sub-value">$${subtotal.toFixed(2)}</span></div>
    <div class="cart-delivery-row"><span>${t('delivery.feeLabel')} ${cartDelivery.method === 'pickup' ? `(${t('delivery.pickup')})` : ''}</span><span class="sub-value">$${fee.toFixed(2)}</span></div>
  `;
  cartTotalEl.textContent = '$' + total.toFixed(2);
}
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1; else cart.push({ id, qty: 1 });
  renderCart();
  const p = products.find(x => x.id === id) || offers.find(x => x.id === id);
  if (p) showToast(t('toast.added', { name: L(p, 'name') }), 'bx-cart-add');
}
function increaseQty(id) { const i = cart.find(c => c.id === id); if (i) { i.qty++; renderCart(); } }
function decreaseQty(id) { const item = cart.find(i => i.id === id); if (!item) return; if (item.qty > 1) item.qty -= 1; else cart = cart.filter(i => i.id !== id); renderCart(); }
function removeItem(id) { cart = cart.filter(i => i.id !== id); renderCart(); showToast(t('toast.removed'), 'bx-trash'); }

document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.add-to-cart-btn');
  if (addBtn) {
    addToCart(addBtn.dataset.id);
    const orig = addBtn.innerHTML;
    addBtn.classList.add('added');
    addBtn.innerHTML = `<i class='bx bx-check'></i> ${t('candies.added')}`;
    setTimeout(() => { addBtn.classList.remove('added'); addBtn.innerHTML = orig; }, 900);
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
      const firstActive = deliveryZones.find(z => z.active);
      if (firstActive) cartDelivery.zoneId = firstActive.id;
    }
    renderCart();
  });
});

cartBtn.addEventListener('click', () => openPanel(cartPanel));
cartClose.addEventListener('click', closeAllPanels);
loginBtn.addEventListener('click', () => {
  if (currentUser) {
    if (isOwner) openOwnerPage();
    else if (isAdmin) openAdminPage();
    else openAccountPage();
    return;
  }
  resetLoginPanel('default');
  openPanel(loginPanel);
});
mobileAccountBtn.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('active');
  loginBtn.click();
});
loginClose.addEventListener('click', closeAllPanels);
overlay.addEventListener('click', closeAllPanels);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mixModal.classList.contains('show')) closeMixModal();
    else if (ownerPageEl.classList.contains('show')) closeOwnerPage();
    else if (adminPageEl.classList.contains('show')) closeAdminPage();
    else if (accountPageEl.classList.contains('show')) closeAccountPage();
    else closeAllPanels();
  }
});

/* ===== LOGIN ===== */
function resetLoginPanel(mode = 'default') {
  loginFormWrapper.style.display = 'block';
  loginSuccess.classList.remove('show');
  loginForm.reset();
  googlePreview.classList.remove('show');
  googlePhoneReveal.classList.remove('show');
  googleBtn.style.display = 'flex';
  loginDivider.style.display = 'flex';
  loginForm.style.display = 'flex';
  googlePhone.value = '';
  if (mode === 'checkout') {
    checkoutIntent = true;
    loginTitle.textContent = t('login.almost');
    loginSubtitle.textContent = t('login.almostSub');
    loginCallout.style.display = 'flex';
  } else {
    checkoutIntent = false;
    loginTitle.textContent = t('login.welcome');
    loginSubtitle.textContent = t('login.subtitle');
    loginCallout.style.display = 'none';
  }
}
function onSignInSuccess(user) {
  isAdmin = false; isOwner = false;
  const c = registerCustomer(user);
  currentUser = { ...user, id: c.id, role: 'customer' };
  loadCustomerWorkspace(currentUser);
  saveAll();
  loginFormWrapper.style.display = 'none';
  loginSuccess.classList.add('show');
  successMessage.textContent = checkoutIntent ? t('login.successSub') : t('login.successWelcome', { name: user.name || 'Sweet Friend' });
  loginBtn.classList.add('signed-in');
  userInitial.textContent = (user.name || user.email || 'H').charAt(0).toUpperCase();
  syncMobileAccount(currentUser);
  setTimeout(() => {
    cartPanel.classList.remove('show'); loginPanel.classList.remove('show'); overlay.classList.remove('show');
    openAccountPage();
    if (checkoutIntent) { showToast(t('toast.signedInCheckout'), 'bx-party'); checkoutIntent = false; }
    else showToast(t('toast.welcome', { name: user.name || user.email }), 'bx-user-check');
  }, 1400);
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value.trim();
  const phone = $('loginPhone').value.trim();

  if (isOwnerPhone(phone)) {
    const btn = $('loginSubmit'), orig = btn.innerHTML;
    btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; signInAsOwner(); }, 800);
    return;
  }
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const btn = $('loginSubmit'), orig = btn.innerHTML;
    btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; signInAsAdmin(); }, 800);
    return;
  }
  if (!email || !password || !phone) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (!email.includes('@')) { showToast(t('toast.validEmail'), 'bx-error-circle'); return; }
  if (!validateJordanPhone(phone)) { showToast(t('toast.validPhone'), 'bx-error-circle'); return; }
  const btn = $('loginSubmit'), orig = btn.innerHTML;
  btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig; btn.disabled = false;
    onSignInSuccess({ name: email.split('@')[0], email, phone: '+962 ' + phone.replace(/\D/g, '') });
  }, 1200);
});

function decodeGoogleCredential(credential) {
  const payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(atob(payload).split('').map(char => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)).join('')));
}
function showGoogleAccount(profile) {
  googleName.textContent = profile.name || profile.email;
  googleEmail.textContent = profile.email;
  googleAvatar.textContent = (profile.name || profile.email || 'H').charAt(0).toUpperCase();
  googleBtn.style.display = 'none';
  loginDivider.style.display = 'none';
  loginForm.style.display = 'none';
  googlePreview.classList.add('show');
  googlePhoneReveal.classList.add('show');
  setTimeout(() => googlePhone.focus(), 200);
}
async function handleGoogleToken(response) {
  try {
    if (!response.access_token) throw new Error('Google did not return an access token');
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: 'Bearer ' + response.access_token }
    });
    if (!profileResponse.ok) throw new Error('Google profile request failed');
    showGoogleAccount(await profileResponse.json());
  } catch (e) { loginSubtitle.textContent = t('login.googleSetup'); }
}
googleBtn.addEventListener('click', () => {
  if (!GOOGLE_CLIENT_ID || !window.google || !window.google.accounts) {
    loginSubtitle.textContent = t('login.googleSetup');
    return;
  }
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    prompt: 'select_account',
    callback: handleGoogleToken
  });
  tokenClient.requestAccessToken({ prompt: 'select_account' });
});
googleChange.addEventListener('click', () => {
  googlePreview.classList.remove('show');
  googlePhoneReveal.classList.remove('show');
  googleBtn.style.display = 'flex';
  loginDivider.style.display = 'flex';
  loginForm.style.display = 'flex';
  googlePhone.value = '';
});
googleContinue.addEventListener('click', () => {
  const phone = googlePhone.value.trim();
  if (!phone) { showToast(t('toast.enterPhone'), 'bx-error-circle'); googlePhone.focus(); return; }
  if (isOwnerPhone(phone)) {
    signInAsOwner();
    googlePreview.classList.remove('show'); googlePhoneReveal.classList.remove('show');
    return;
  }
  if (!validateJordanPhone(phone)) { showToast(t('toast.validPhone'), 'bx-error-circle'); googlePhone.focus(); return; }
  const orig = googleContinue.innerHTML;
  googleContinue.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
  googleContinue.disabled = true;
  setTimeout(() => {
    googleContinue.innerHTML = orig; googleContinue.disabled = false;
    onSignInSuccess({ name: googleName.textContent, email: googleEmail.textContent, phone: '+962 ' + phone.replace(/\D/g, ''), google: true });
    setTimeout(() => { googlePreview.classList.remove('show'); googlePhoneReveal.classList.remove('show'); googleBtn.style.display = 'flex'; loginDivider.style.display = 'flex'; loginForm.style.display = 'flex'; googlePhone.value = ''; }, 1800);
  }, 1200);
});

$('signupLink').addEventListener('click', (e) => { e.preventDefault(); closeAllPanels(); });
$('forgotLink').addEventListener('click', (e) => { e.preventDefault(); showToast(t('toast.resetSent'), 'bx-envelope'); });

/* ===== CHECKOUT ===== */
checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) { showToast(t('toast.cartEmpty'), 'bx-shopping-bag'); return; }
  if (!currentUser) {
    closeAllPanels();
    setTimeout(() => { resetLoginPanel('checkout'); openPanel(loginPanel); }, 350);
    return;
  }
  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;
  if (!PAYMENT_CHECKOUT_ENDPOINT) {
    showToast(t('toast.paymentSetup'), 'bx-error-circle');
    return;
  }
  let paymentResult;
  try {
    const response = await fetch(PAYMENT_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { id: currentUser.id, email: currentUser.email, phone: currentUser.phone },
        items: cart,
        subtotal,
        deliveryFee,
        total,
        currency: 'USD',
        delivery: cartDelivery
      })
    });
    paymentResult = await response.json();
    if (!response.ok) throw new Error('payment request failed');
    if (paymentResult.checkoutUrl) {
      window.location.assign(paymentResult.checkoutUrl);
      return;
    }
    if (paymentResult.paymentStatus !== 'paid') throw new Error('payment not confirmed');
  } catch (e) {
    showToast(t('toast.paymentStartFailed'), 'bx-error-circle');
    return;
  }
  const delivZone = deliveryZones.find(z => z.id === cartDelivery.zoneId);
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
  const today = new Date().toISOString().split('T')[0];
  const newOrder = {
    id: 'HC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    customerId: currentUser.id || 'c-guest',
    customerEmail: currentUser.email,
    date: today, status: 'processing',
    itemsCount: cart.reduce((s, i) => s + i.qty, 0),
    itemsList: cart.map(i => {
      if (i.isMix) return { name: 'Custom Mix', name_ar: 'خلطة خاصة', qty: i.qty, price: i.price };
      const p = products.find(x => x.id === i.id) || offers.find(x => x.id === i.id);
      return p ? { name: p.name, name_ar: p.name_ar, qty: i.qty, price: p.price } : null;
    }).filter(Boolean),
    subtotal: subtotal, deliveryFee: deliveryFee, total: total,
    deliveryMethod: cartDelivery.method,
    deliveryZone: delivZone ? delivZone.name : null,
    payment: 'card', paymentIntentId: paymentResult.paymentIntentId || null,
    address: cartDelivery.method === 'pickup' ? 'Pickup from boutique' : (defaultAddr ? `${defaultAddr.city}, ${defaultAddr.area}` : 'Amman, Jordan'),
    tracking: null, placedAt: today, packedAt: null, shippedAt: null, outAt: null, deliveredAt: null, eta: null
  };
  orderHistory.unshift(newOrder);
  saveAll();
  showToast(t('toast.orderPlaced', { total: '$' + total.toFixed(2) }), 'bx-party');
  cart = [];
  renderCart();
  setTimeout(() => { closeAllPanels(); setTimeout(openAccountPage, 300); }, 900);
});

/* ===== NAV / SCROLL / CONTACT ===== */
const hamburger = $('hamburger'), navLinks = $('navLinks');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navLinks.classList.toggle('active'); });
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('active'); }));

const header = $('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

function revealOnScroll() {
  const wh = window.innerHeight;
  document.querySelectorAll('.reveal').forEach(el => { if (!el.classList.contains('active') && el.getBoundingClientRect().top < wh - 100) el.classList.add('active'); });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

$('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('name').value.trim(), email = $('email').value.trim(), message = $('message').value.trim();
  if (!name || !email || !message) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  const btn = e.target.querySelector('button[type="submit"]'), orig = btn.textContent;
  btn.textContent = t('contact.sending'); btn.disabled = true;
  setTimeout(() => {
    contactMessages.unshift({ id: 'msg-' + Date.now(), name, email, message, date: new Date().toISOString().split('T')[0], read: false });
    if (adminPageEl.classList.contains('show')) renderAdmin();
    showToast(t('toast.thanks', { name: name }), 'bx-check-circle');
    e.target.reset(); btn.textContent = orig; btn.disabled = false;
  }, 1200);
});

function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.pageYOffset, diff = targetY - startY, start = performance.now();
  function ease(x) { return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2; }
  function step(now) {
    const elapsed = now - start, progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const tgt = document.querySelector(href);
    if (!tgt) return;
    e.preventDefault();
    const targetY = tgt.getBoundingClientRect().top + window.pageYOffset - 80;
    const dist = Math.abs(targetY - window.pageYOffset);
    smoothScrollTo(targetY, Math.min(600 + dist * 0.5, 1600));
  });
});
document.documentElement.style.scrollBehavior = 'auto';

/* ===== FLOATING SIGN ===== */
const sbBoard = $('sbBoard'), sbNote = $('sbNote');
function updateSign(force) {
  const now = new Date();
  const isOpen = now.getHours() >= OPEN_HOUR && now.getHours() < CLOSE_HOUR;
  if (previousSignState !== isOpen || force) {
    sbBoard.textContent = isOpen ? t('sign.open') : t('sign.closed');
    document.body.classList.toggle('is-open', isOpen);
    sbNote.textContent = isOpen ? t('sign.openNote') : t('sign.closedNote');
    sbBoard.classList.remove('text-change');
    void sbBoard.offsetWidth;
    sbBoard.classList.add('text-change');
    previousSignState = isOpen;
  }
}

/* ===== ACCOUNT PAGE ===== */
function openAccountPage() {
  if (!currentUser) return;
  $('accountAvatar').textContent = (currentUser.name || 'H').charAt(0).toUpperCase();
  $('accountName').textContent = currentUser.name || 'Hat Candy User';
  $('accountEmail').textContent = currentUser.email || '';
  accountPageEl.classList.add('show');
  document.body.classList.add('no-scroll');
  floatingSign.classList.add('hide');
  renderAccountPage();
  switchAccountTab(accountTab);
}
function closeAccountPage() {
  accountPageEl.classList.remove('show');
  if (!cartPanel.classList.contains('show') && !loginPanel.classList.contains('show') && !mixModal.classList.contains('show') && !adminPageEl.classList.contains('show') && !ownerPageEl.classList.contains('show')) {
    document.body.classList.remove('no-scroll'); floatingSign.classList.remove('hide');
  }
}
function switchAccountTab(tab) {
  accountTab = tab;
  document.querySelectorAll('#accountPage .account-tab').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
  document.querySelectorAll('#accountPage .account-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === tab));
}
function renderAccountPage() {
  const orders = customerOrders();
  const activeCount = orders.filter(o => ['processing','packing','shipped','out_for_delivery'].includes(o.status)).length;
  $('ordersCount').textContent = orders.length;
  $('trackingCount').textContent = activeCount;
  $('accountAddressCount').textContent = savedAddresses.length + ' ' + t('account.savedAddresses');
  renderAccountNotice(); renderAccountStats(); renderOrders(); renderTracking(); renderAddresses();
}
function renderAccountNotice() {
  const el = $('accountNotice');
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  if (qty > 0) {
    el.innerHTML = `<div class="account-notice"><i class='bx bxs-cart'></i><div class="account-notice-text">${t('account.cartNotice', { n: qty })}</div><button id="accountGoCart">${t('account.goToCart')}</button></div>`;
    $('accountGoCart').addEventListener('click', () => { closeAccountPage(); setTimeout(() => openPanel(cartPanel), 300); });
  } else el.innerHTML = '';
}
function renderAccountStats() {
  const orders = customerOrders();
  const total = orders.length;
  const active = orders.filter(o => ['processing','packing','shipped','out_for_delivery'].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const spent = orders.reduce((s, o) => s + o.total, 0);
  $('accountStats').innerHTML = `
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-receipt'></i></div><div class="account-stat-info"><div class="account-stat-value">${total}</div><div class="account-stat-label">${t('account.statTotal')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-package'></i></div><div class="account-stat-info"><div class="account-stat-value">${active}</div><div class="account-stat-label">${t('account.statActive')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-check-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">${delivered}</div><div class="account-stat-label">${t('account.statDelivered')}</div></div></div>
    <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-dollar-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">$${spent.toFixed(2)}</div><div class="account-stat-label">${t('account.statSpent')}</div></div></div>`;
}
function renderOrders() {
  const list = $('ordersList');
  const orders = customerOrders();
  if (orders.length === 0) {
    list.innerHTML = `<div class="account-empty"><i class='bx bx-receipt'></i><h3>${t('account.noOrders')}</h3><p>${t('account.noOrdersSub')}</p><a href="#candies" class="btn btn-primary" id="emptyShopBtn">${t('account.shopNow')}</a></div>`;
    $('emptyShopBtn').addEventListener('click', closeAccountPage);
    return;
  }
  list.innerHTML = orders.map(o => `
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
  const tracked = customerOrders().filter(o => ['packing','shipped','out_for_delivery','delivered'].includes(o.status));
  if (tracked.length === 0) { list.innerHTML = `<div class="account-empty"><i class='bx bx-package'></i><h3>${t('account.noTracking')}</h3><p>${t('account.noTrackingSub')}</p></div>`; return; }
  const statusIdx = { processing: 1, packing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };
  list.innerHTML = tracked.map(o => {
    const currentIdx = statusIdx[o.status] || 1;
    const steps = [
      { icon: 'bx bx-check', label: t('account.stepPlaced'), time: o.placedAt },
      { icon: 'bx bx-cog', label: t('account.stepProcessing'), time: o.placedAt },
      { icon: 'bx bx-archive', label: t('account.stepPacking'), time: o.packedAt },
      { icon: 'bx bx-package', label: t('account.stepShipped'), time: o.shippedAt },
      { icon: 'bx bx-cycling', label: t('account.stepOut'), time: o.outAt },
      { icon: 'bx bx-home-smile', label: t('account.stepDelivered'), time: o.deliveredAt }
    ];
    const qty = o.itemsList.reduce((s, i) => s + i.qty, 0);
    return `<div class="tracking-card"><div class="tracking-head"><div class="tracking-head-info"><h3>${t('account.trackingFor')} ${o.id}</h3><p>${formatDate(o.date)} • ${qty} ${qty === 1 ? t('cart.item') : t('cart.items')}</p></div><div class="tracking-num"><i class='bx bx-package'></i> ${o.tracking || '—'}</div></div><div class="tracking-timeline">${steps.map((s, i) => `<div class="tracking-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx && o.status !== 'delivered' ? 'current' : ''}"><div class="tracking-step-dot"><i class='${s.icon}'></i></div><div class="tracking-step-text"><div class="tracking-step-label">${s.label}</div><div class="tracking-step-time">${s.time ? formatDate(s.time) : ''}</div></div></div>`).join('')}</div><div class="tracking-foot"><div class="tracking-eta"><i class='bx bx-time-five'></i> ${t('account.eta')}: ${o.eta ? formatDate(o.eta) : '—'}</div><div>${t('account.deliveringTo')}: ${o.address}</div></div></div>`;
  }).join('');
}
function renderAddresses() {
  const grid = $('addressesGrid');
  const labelIcon = { home: 'bx-home', work: 'bx-briefcase', other: 'bx-map-pin' };
  const labelText = { home: t('account.labelHome'), work: t('account.labelWork'), other: t('account.labelOther') };
  grid.innerHTML = savedAddresses.map(a => `
    <div class="address-card ${a.isDefault ? 'is-default' : ''}">
      ${a.isDefault ? `<span class="address-default-badge">${t('account.default')}</span>` : ''}
      <span class="address-label ${a.label}"><i class='bx ${labelIcon[a.label]}'></i> ${labelText[a.label]}</span>
      <div class="address-name">${esc(a.name)}</div>
      <div class="address-line"><i class='bx bx-phone'></i> <span>${esc(a.phone)}</span></div>
      <div class="address-line"><i class='bx bx-map'></i> <span>${esc(a.city)}, ${esc(a.area)} — ${esc(a.line)}</span></div>
      <div class="address-actions">
        <button class="address-btn edit" data-edit-address="${a.id}"><i class='bx bx-edit'></i> ${t('account.edit')}</button>
        ${!a.isDefault ? `<button class="address-btn setdefault" data-default-address="${a.id}"><i class='bx bx-check-circle'></i> ${t('account.setDefault')}</button>` : ''}
        <button class="address-btn delete" data-delete-address="${a.id}"><i class='bx bx-trash'></i> ${t('account.delete')}</button>
      </div>
    </div>`).join('') + `<div class="address-add-card" id="addAddressBtn"><div class="address-add-icon"><i class='bx bx-plus'></i></div><span>${t('account.addNew')}</span></div>`;
  $('addAddressBtn').addEventListener('click', () => showAddressForm());
}
function showAddressForm(addressId) {
  const form = $('addressForm'), formEl = $('addressFormEl');
  formEl.reset(); $('addressId').value = '';
  if (addressId) {
    const a = savedAddresses.find(x => x.id === addressId);
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
  } else $('addressFormTitle').textContent = t('account.addAddressTitle');
  form.classList.add('show');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function hideAddressForm() { $('addressForm').classList.remove('show'); $('addressFormEl').reset(); }

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
  if (!data.name || !data.phone || !data.city || !data.area || !data.line) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) {
    const idx = savedAddresses.findIndex(a => a.id === id);
    if (idx !== -1) savedAddresses[idx] = { ...savedAddresses[idx], ...data };
    showToast(t('toast.addressUpdated'), 'bx-check-circle');
  } else {
    savedAddresses.push({ id: 'addr-' + Date.now(), ...data, isDefault: savedAddresses.length === 0 });
    showToast(t('toast.addressAdded'), 'bx-check-circle');
  }
  saveCustomerWorkspace();
  hideAddressForm(); renderAccountPage();
});
$('addressCancel').addEventListener('click', hideAddressForm);
$('addressesGrid').addEventListener('click', (e) => {
  const editBtn = e.target.closest('[data-edit-address]');
  if (editBtn) { showAddressForm(editBtn.dataset.editAddress); return; }
  const delBtn = e.target.closest('[data-delete-address]');
  if (delBtn) {
    if (savedAddresses.length <= 1) { showToast(t('toast.needOneAddress'), 'bx-info-circle'); return; }
    savedAddresses = savedAddresses.filter(a => a.id !== delBtn.dataset.deleteAddress);
    if (!savedAddresses.some(a => a.isDefault) && savedAddresses.length) savedAddresses[0].isDefault = true;
    saveCustomerWorkspace();
    renderAccountPage(); showToast(t('toast.addressDeleted'), 'bx-trash');
    return;
  }
  const defBtn = e.target.closest('[data-default-address]');
  if (defBtn) {
    savedAddresses.forEach(a => a.isDefault = a.id === defBtn.dataset.defaultAddress);
    saveCustomerWorkspace();
    renderAccountPage(); showToast(t('toast.addressDefaultSet'), 'bx-check-circle');
  }
});
$('ordersList').addEventListener('click', (e) => {
  const trackBtn = e.target.closest('[data-track]');
  if (trackBtn) { switchAccountTab('tracking'); return; }
  const reorderBtn = e.target.closest('[data-reorder]');
  if (reorderBtn) {
    const order = customerOrders().find(o => o.id === reorderBtn.dataset.reorder);
    if (!order) return;
    order.itemsList.forEach(it => {
      const p = products.find(x => x.name === it.name) || offers.find(x => x.name === it.name);
      if (p) {
        const existing = cart.find(c => c.id === p.id);
        if (existing) existing.qty += it.qty;
        else cart.push({ id: p.id, qty: it.qty });
      }
    });
    renderCart(); showToast(t('toast.reordered'), 'bx-cart-add');
    closeAccountPage(); setTimeout(() => openPanel(cartPanel), 300);
  }
});
document.querySelectorAll('#accountPage .account-tab').forEach(tab => tab.addEventListener('click', () => switchAccountTab(tab.dataset.tab)));
$('accountBack').addEventListener('click', closeAccountPage);
$('accountSignout').addEventListener('click', signOutUser);

function signOutUser() {
  isAdmin = false; isOwner = false;
  currentUser = null;
  loginBtn.classList.remove('signed-in');
  userInitial.textContent = 'H';
  syncMobileAccount(null);
  closeAccountPage(); closeAdminPage(); closeOwnerPage();
  showToast(t('toast.signedOut'), 'bx-log-out');
}

/* ===== ADMIN ===== */
function signInAsAdmin() {
  isAdmin = true; isOwner = false;
  currentUser = { id: 'admin', name: 'Store Admin', email: ADMIN_EMAIL, role: 'admin' };
  loginFormWrapper.style.display = 'none';
  loginSuccess.classList.add('show');
  successMessage.textContent = t('login.successSub');
  loginBtn.classList.add('signed-in');
  userInitial.textContent = 'A';
  syncMobileAccount(currentUser);
  setTimeout(() => { closeAllPanels(); openAdminPage(); showToast(t('toast.adminWelcome'), 'bx-shield-quarter'); }, 900);
}
function openAdminPage() {
  if (!isAdmin) return;
  $('adminToday').textContent = formatDate(new Date().toISOString().split('T')[0]);
  $('adminClock').textContent = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  adminPageEl.classList.add('show');
  document.body.classList.add('no-scroll');
  floatingSign.classList.add('hide');
  renderAdmin(); switchAdminTab(adminTab);
}
function closeAdminPage() {
  adminPageEl.classList.remove('show');
  if (!cartPanel.classList.contains('show') && !loginPanel.classList.contains('show') && !mixModal.classList.contains('show') && !accountPageEl.classList.contains('show') && !ownerPageEl.classList.contains('show')) {
    document.body.classList.remove('no-scroll'); floatingSign.classList.remove('hide');
  }
}
function switchAdminTab(tab) {
  adminTab = tab;
  document.querySelectorAll('#adminPage .account-tab').forEach(x => x.classList.toggle('active', x.dataset.atab === tab));
  document.querySelectorAll('#adminPage .account-pane').forEach(p => p.classList.toggle('active', p.dataset.apane === tab));
}
function renderAdmin() {
  if (!adminPageEl) return;
  $('adminOrdersCount').textContent = orderHistory.length;
  $('adminCustomersCount').textContent = customers.length;
  $('adminMessagesCount').textContent = contactMessages.filter(m => !m.read).length;
  renderAdminKpis(); renderAdminChart(); renderAdminTopProducts(); renderAdminRecentOrders();
  renderAdminOrders(); renderAdminCustomers(); renderAdminProducts(); renderAdminMessages();
}
function renderAdminKpis() {
  const active = orderHistory.filter(o => o.status !== 'cancelled');
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const deliveredRevenue = orderHistory.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const pending = orderHistory.filter(o => ['processing', 'packing'].includes(o.status)).length;
  const aov = active.length ? revenue / active.length : 0;
  const cards = [
    { icon: 'bx-dollar-circle', value: '$' + revenue.toFixed(2), label: t('admin.kpiRevenue') },
    { icon: 'bx-receipt', value: orderHistory.length, label: t('admin.kpiOrders') },
    { icon: 'bx-group', value: customers.length, label: t('admin.kpiCustomers') },
    { icon: 'bx-trending-up', value: '$' + aov.toFixed(2), label: t('admin.kpiAov') },
    { icon: 'bx-time-five', value: pending, label: t('admin.kpiPending') },
    { icon: 'bx-check-shield', value: '$' + deliveredRevenue.toFixed(2), label: t('admin.kpiDelivered') }
  ];
  $('adminKpis').innerHTML = cards.map(c => `<div class="kpi-card"><div class="kpi-icon"><i class='bx ${c.icon}'></i></div><div><div class="kpi-value">${c.value}</div><div class="kpi-label">${c.label}</div></div></div>`).join('');
}
function renderAdminChart() {
  const map = {};
  orderHistory.filter(o => o.status !== 'cancelled').forEach(o => { map[o.date] = (map[o.date] || 0) + o.total; });
  const dates = Object.keys(map).sort().slice(-7);
  const data = dates.map(d => ({ date: d, value: map[d] }));
  const el = $('adminChartBars');
  if (!data.length) { el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`; return; }
  const max = Math.max(...data.map(d => d.value), 1);
  el.innerHTML = data.map(d => `<div class="admin-bar-col"><div class="admin-bar-value">$${d.value.toFixed(0)}</div><div class="admin-bar-track"><div class="admin-bar" style="height:${Math.max(6, Math.round((d.value / max) * 130))}px"></div></div><div class="admin-bar-label">${new Date(d.date).toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { day: '2-digit', month: 'short' })}</div></div>`).join('');
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
  if (!list.length) { el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`; return; }
  const max = Math.max(...list.map(p => p.revenue), 1);
  el.innerHTML = list.map((p, i) => `<div class="admin-rank-item"><div class="admin-rank-num">${i + 1}</div><div class="admin-rank-info"><div class="admin-rank-name">${esc(lang === 'ar' && p.name_ar ? p.name_ar : p.name)}</div><div class="admin-rank-bar"><span style="width:${(p.revenue / max) * 100}%"></span></div></div><div class="admin-rank-value">$${p.revenue.toFixed(2)}</div></div>`).join('');
}
function orderRowHtml(o, compact) {
  const c = custById(o.customerId);
  const items = o.itemsList.map(i => `${lang === 'ar' && i.name_ar ? i.name_ar : i.name} ×${i.qty}`).join(' • ');
  const pay = o.payment === 'cod' ? t('admin.payCod') : t('admin.payCard');
  return `<tr>
    <td><strong>${o.id}</strong><div class="admin-sub">${formatDate(o.date)}</div></td>
    <td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email || '')}</div></div></div></td>
    <td><div class="admin-items">${esc(items)}</div></td>
    <td><strong>$${o.total.toFixed(2)}</strong><div class="admin-sub">${pay}</div></td>
    <td><span class="order-status status-${o.status}"><i class='${statusIcon(o.status)}'></i> ${t('account.status_' + o.status)}</span></td>
    ${compact ? '' : `
      <td><select class="admin-status-select" data-status-order="${o.id}">${['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${t('account.status_' + s)}</option>`).join('')}</select></td>
      <td><div class="admin-row-actions"><button class="admin-mini-btn primary" data-advance="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-right-arrow-alt'></i> ${t('admin.advance')}</button><button class="admin-mini-btn danger" data-cancel-order="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-x'></i></button></div></td>`}
  </tr>`;
}
function renderAdminRecentOrders() {
  const recent = [...orderHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  $('adminRecentOrders').innerHTML = recent.map(o => orderRowHtml(o, true)).join('');
}
function renderAdminOrders() {
  const counts = { all: orderHistory.length };
  ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].forEach(s => { counts[s] = orderHistory.filter(o => o.status === s).length; });
  const filters = [['all', t('admin.all')], ['processing', t('account.status_processing')], ['packing', t('account.status_packing')], ['shipped', t('account.status_shipped')], ['out_for_delivery', t('account.status_out_for_delivery')], ['delivered', t('account.status_delivered')], ['cancelled', t('account.status_cancelled')]];
  $('adminOrderFilters').innerHTML = filters.map(([k, label]) => `<button class="admin-filter ${adminOrderFilter === k ? 'active' : ''}" data-ofilter="${k}">${label} <span class="flt-count">${counts[k] || 0}</span></button>`).join('');
  const rows = orderHistory.filter(o => adminOrderFilter === 'all' || o.status === adminOrderFilter).sort((a, b) => b.date.localeCompare(a.date));
  $('adminOrdersBody').innerHTML = rows.length ? rows.map(o => orderRowHtml(o, false)).join('') : `<tr><td colspan="7"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
}
function renderAdminCustomers() {
  const q = adminCustomerSearch;
  const list = customers.filter(c => !q || (c.name + ' ' + c.email + ' ' + c.phone + ' ' + c.city).toLowerCase().includes(q));
  const tierLabel = { vip: t('admin.tierVip'), active: t('admin.tierActive'), new: t('admin.tierNew') };
  $('adminCustomersBody').innerHTML = list.length ? list.map(c => {
    const st = customerStats(c.id);
    return `<tr><td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email)}</div></div></div></td><td>${esc(c.phone)}</td><td>${esc(c.city)}</td><td>${st.orders}</td><td><strong>$${st.spent.toFixed(2)}</strong></td><td><span class="admin-tier ${c.tier}">${tierLabel[c.tier] || c.tier}</span></td><td>${formatDate(c.joined)}</td></tr>`;
  }).join('') : `<tr><td colspan="7"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
}
function renderAdminProducts() {
  const sales = productSales();
  $('adminProductsBody').innerHTML = products.map(p => {
    const s = sales.find(x => x.name === p.name) || { qty: 0, revenue: 0 };
    const stockCls = p.stock > 20 ? 'in' : (p.stock > 0 ? 'low' : 'out');
    const stockLbl = p.stock > 20 ? t('admin.stockIn') : (p.stock > 0 ? t('admin.stockLow') : t('admin.stockOut'));
    return `<tr><td><div class="admin-user"><img class="admin-prod-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(L(p, 'name'))}</div><div class="admin-sub">${esc(L(p, 'badge') || '')}</div></div></div></td><td><strong>$${Number(p.price).toFixed(2)}</strong>${p.oldPrice ? `<div class="admin-sub"><s style="opacity:.6">$${Number(p.oldPrice).toFixed(2)}</s></div>` : ''}</td><td>${s.qty} <span class="admin-sub">${t('admin.units')}</span></td><td><strong>$${s.revenue.toFixed(2)}</strong></td><td><span class="admin-stock ${stockCls}"><i class='bx bx-package'></i> ${stockLbl} (${p.stock})</span></td></tr>`;
  }).join('');
}
function renderAdminMessages() {
  const el = $('adminMessagesList');
  if (!contactMessages.length) { el.innerHTML = `<div class="account-empty"><i class='bx bx-envelope'></i><h3>${t('admin.noMessages')}</h3><p>${t('admin.noMessagesSub')}</p></div>`; return; }
  el.innerHTML = contactMessages.map(m => `<div class="admin-msg ${m.read ? 'read' : ''}"><div class="admin-msg-head"><div class="admin-user"><div class="admin-user-avatar">${esc((m.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(m.name)}</div><div class="admin-sub">${esc(m.email)} • ${formatDate(m.date)}</div></div></div><div class="admin-msg-actions"><button class="admin-mini-btn ghost" data-msg-read="${m.id}"><i class='bx ${m.read ? 'bx-envelope' : 'bx-check-double'}'></i> ${m.read ? t('admin.markUnread') : t('admin.markRead')}</button><button class="admin-mini-btn danger" data-msg-delete="${m.id}"><i class='bx bx-trash'></i></button></div></div><div class="admin-msg-body">${esc(m.message)}</div></div>`).join('');
}
function setOrderStatus(orderId, status) {
  const o = orderHistory.find(x => x.id === orderId); if (!o) return;
  if (o.status === status) { renderAdmin(); return; }
  o.status = status;
  const today = new Date().toISOString().split('T')[0];
  if (status === 'packing' && !o.packedAt) o.packedAt = today;
  if (status === 'shipped') { o.shippedAt = o.shippedAt || today; if (!o.tracking) o.tracking = 'JD-EXP-' + Math.floor(100000 + Math.random() * 899999); }
  if (status === 'out_for_delivery') o.outAt = o.outAt || today;
  if (status === 'delivered') { o.deliveredAt = o.deliveredAt || today; o.eta = o.eta || today; }
  renderAdmin();
  if (accountPageEl.classList.contains('show')) renderAccountPage();
  showToast(t('admin.statusUpdated', { id: o.id, status: t('account.status_' + status) }), 'bx-check-circle');
}
function advanceOrder(orderId) {
  const o = orderHistory.find(x => x.id === orderId); if (!o) return;
  const idx = STATUS_FLOW.indexOf(o.status);
  if (idx === -1 || idx >= STATUS_FLOW.length - 1) return;
  setOrderStatus(orderId, STATUS_FLOW[idx + 1]);
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
  const a = document.createElement('a'); a.href = url; a.download = 'hat-candy-orders.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('admin.exported'), 'bx-download');
}
adminPageEl.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-atab]'); if (tabBtn) { switchAdminTab(tabBtn.dataset.atab); return; }
  const filterBtn = e.target.closest('[data-ofilter]'); if (filterBtn) { adminOrderFilter = filterBtn.dataset.ofilter; renderAdminOrders(); return; }
  const adv = e.target.closest('[data-advance]'); if (adv) { advanceOrder(adv.dataset.advance); return; }
  const cancelBtn = e.target.closest('[data-cancel-order]'); if (cancelBtn) { setOrderStatus(cancelBtn.dataset.cancelOrder, 'cancelled'); return; }
  const readBtn = e.target.closest('[data-msg-read]'); if (readBtn) { const m = contactMessages.find(x => x.id === readBtn.dataset.msgRead); if (m) { m.read = !m.read; renderAdmin(); } return; }
  const delMsgBtn = e.target.closest('[data-msg-delete]'); if (delMsgBtn) { contactMessages = contactMessages.filter(x => x.id !== delMsgBtn.dataset.msgDelete); renderAdmin(); showToast(t('admin.msgDeleted'), 'bx-trash'); return; }
  const gotoOrders = e.target.closest('[data-goto-orders]'); if (gotoOrders) { switchAdminTab('orders'); return; }
});
adminPageEl.addEventListener('change', (e) => {
  const sel = e.target.closest('[data-status-order]');
  if (sel) setOrderStatus(sel.dataset.statusOrder, sel.value);
});
adminPageEl.addEventListener('input', (e) => {
  if (e.target.id === 'adminCustomerSearch') { adminCustomerSearch = e.target.value.trim().toLowerCase(); renderAdminCustomers(); }
});
$('adminBack').addEventListener('click', closeAdminPage);
$('adminSignout').addEventListener('click', signOutUser);
$('adminExportOrders').addEventListener('click', exportOrdersCsv);

/* ===== OWNER PANEL ===== */
function signInAsOwner() {
  isOwner = true; isAdmin = true;
  currentUser = { id: 'owner', name: 'Developer', email: '0782342105', role: 'owner' };
  loginFormWrapper.style.display = 'none';
  loginSuccess.classList.add('show');
  successMessage.textContent = 'Full access granted ✨';
  loginBtn.classList.add('signed-in');
  userInitial.textContent = 'D';
  syncMobileAccount(currentUser);
  setTimeout(() => { closeAllPanels(); openOwnerPage(); showToast(t('toast.ownerWelcome'), 'bx-code-alt'); }, 900);
}
function openOwnerPage() {
  if (!isOwner) return;
  ownerPageEl.classList.add('show');
  document.body.classList.add('no-scroll');
  floatingSign.classList.add('hide');
  renderOwner(); switchOwnerTab(ownerTab);
}
function closeOwnerPage() {
  ownerPageEl.classList.remove('show');
  if (!cartPanel.classList.contains('show') && !loginPanel.classList.contains('show') && !mixModal.classList.contains('show') && !accountPageEl.classList.contains('show') && !adminPageEl.classList.contains('show')) {
    document.body.classList.remove('no-scroll'); floatingSign.classList.remove('hide');
  }
}
function switchOwnerTab(tab) {
  ownerTab = tab;
  document.querySelectorAll('#ownerPage .account-tab').forEach(x => x.classList.toggle('active', x.dataset.otab === tab));
  document.querySelectorAll('#ownerPage .account-pane').forEach(p => p.classList.toggle('active', p.dataset.opane === tab));
}
function renderOwner() {
  if (!ownerPageEl) return;
  $('ownerProductsCount').textContent = products.length;
  $('ownerOffersCount').textContent = offers.length;
  $('ownerGalleryCount').textContent = galleryImages.length;
  renderOwnerStats(); renderOwnerProducts(); renderOwnerOffers(); renderOwnerGallery();
  renderOwnerMixBuilder(); renderOwnerDelivery(); renderOwnerCMS();
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
  $('ownerStats').innerHTML = stats.map(s => `<div class="owner-stat"><div class="owner-stat-icon"><i class='bx ${s.icon}'></i></div><div class="owner-stat-value">${s.value}</div><div class="owner-stat-label">${s.label}</div></div>`).join('');
}
function renderOwnerProducts() {
  const body = $('ownerProductsBody');
  if (!products.length) { body.innerHTML = `<tr><td colspan="6"><div class="owner-empty"><i class='bx bx-package'></i><p>No products yet</p></div></td></tr>`; return; }
  body.innerHTML = products.map(p => `<tr><td><div class="admin-user"><img class="owner-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(p.name)}</div><div class="admin-sub">${esc(p.name_ar || '')}</div></div></div></td><td><strong>$${Number(p.price).toFixed(2)}</strong></td><td>${p.oldPrice ? `$${Number(p.oldPrice).toFixed(2)}` : '—'}</td><td>${esc(p.badge || '—')}</td><td>${p.stock}</td><td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-product="${esc(p.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-product="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></td></tr>`).join('');
}
function renderOwnerOffers() {
  const body = $('ownerOffersBody');
  if (!offers.length) { body.innerHTML = `<tr><td colspan="6"><div class="owner-empty"><i class='bx bx-purchase-tag'></i><p>No offers yet</p></div></td></tr>`; return; }
  body.innerHTML = offers.map(o => `<tr><td><div class="admin-user"><img class="owner-thumb" src="${esc(o.img)}" alt=""><div><div class="admin-user-name">${esc(o.name)}</div><div class="admin-sub">${esc(o.name_ar || '')}</div></div></div></td><td>${esc(o.category || '—')}</td><td><strong>$${Number(o.price).toFixed(2)}</strong></td><td>${esc(o.discount || '—')}</td><td>${o.isActive ? '<span class="admin-tier active">Active</span>' : '<span class="admin-tier" style="background:rgba(107,114,128,0.15);color:#4b5563;">Inactive</span>'}</td><td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-offer="${esc(o.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-offer="${esc(o.id)}"><i class='bx bx-trash'></i></button></div></td></tr>`).join('');
}
function renderOwnerGallery() {
  const grid = $('ownerGalleryGrid');
  grid.innerHTML = galleryImages.map(g => `<div class="owner-gallery-item"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"><button class="owner-gallery-remove" data-delete-gallery="${g.id}"><i class='bx bx-trash'></i></button></div>`).join('') + `<div class="owner-gallery-add" id="ownerAddGalleryTile"><i class='bx bx-plus'></i><span>Add Image</span></div>`;
  const tile = $('ownerAddGalleryTile');
  if (tile) tile.addEventListener('click', openOwnerGalleryModal);
}
function renderOwnerMixBuilder() {
  const wl = $('ownerWeightsList');
  wl.innerHTML = mixWeights.length ? [...mixWeights].sort((a, b) => a - b).map(w => `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-weight'></i></div><div class="owner-list-info"><div class="owner-list-title">${w} g</div><div class="owner-list-meta">${(w / 1000).toFixed(3)} kg</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-weight="${w}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-weight="${w}"><i class='bx bx-trash'></i></button></div></div>`).join('') : `<div class="owner-empty"><i class='bx bx-weight'></i><p>No weights yet</p></div>`;

  const pl = $('ownerPackagingList');
  pl.innerHTML = mixPackaging.length ? mixPackaging.map(p => `<div class="owner-list-item">${p.img ? `<img class="owner-list-thumb" src="${esc(p.img)}" alt="">` : `<div class="owner-list-thumb"><i class='bx ${p.icon || 'bx-box'}'></i></div>`}<div class="owner-list-info"><div class="owner-list-title">${esc(p.name)} <span style="opacity:.6;font-weight:500">/ ${esc(p.name_ar || '')}</span></div><div class="owner-list-meta">${Number(p.extra) === 0 ? 'Free' : '+$' + Number(p.extra).toFixed(2)} · ${p.img ? 'custom image' : 'icon: ' + (p.icon || 'bx-box')}</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-pack="${esc(p.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-pack="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></div>`).join('') : `<div class="owner-empty"><i class='bx bx-package'></i><p>No packaging yet</p></div>`;

  const cl = $('ownerCandyTypesList');
  cl.innerHTML = candyTypes.length ? candyTypes.map(c => `<div class="owner-list-item"><img class="owner-list-thumb" src="${esc(c.img)}" alt=""><div class="owner-list-info"><div class="owner-list-title"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-inline-end:6px;vertical-align:middle;"></span>${esc(c.name)} <span style="opacity:.6;font-weight:500">/ ${esc(c.name_ar || '')}</span></div><div class="owner-list-meta">$${Number(c.price_per_kg).toFixed(2)} / kg</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-candy="${esc(c.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-candy="${esc(c.id)}"><i class='bx bx-trash'></i></button></div></div>`).join('') : `<div class="owner-empty"><i class='bx bx-candy'></i><p>No candy types yet</p></div>`;
}
function renderOwnerDelivery() {
  const zl = $('ownerZonesList');
  zl.innerHTML = deliveryZones.length ? deliveryZones.map(z => `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-map-pin'></i></div><div class="owner-list-info"><div class="owner-list-title">${esc(z.name)} <span style="opacity:.6;font-weight:500">/ ${esc(z.name_ar || '')}</span></div><div class="owner-list-meta">$${Number(z.price).toFixed(2)}</div></div><span class="owner-chip-toggle ${z.active ? 'on' : 'off'}">${z.active ? 'Active' : 'Off'}</span><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-zone="${esc(z.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-zone="${esc(z.id)}"><i class='bx bx-trash'></i></button></div></div>`).join('') : `<div class="owner-empty"><i class='bx bx-cycling'></i><p>No delivery zones yet</p></div>`;
}
function renderOwnerCMS() {
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.dataset.cms;
    const langAttr = el.closest('[data-cms-lang]')?.dataset.cmsLang || 'en';
    const dict = I18N[langAttr] || I18N.en;
    el.value = dict[key] || '';
  });
  const phEl = document.querySelector('[data-cms-contact="phone"]');
  const emEl = document.querySelector('[data-cms-contact="email"]');
  const phShown = document.querySelector('[data-contact-phone]');
  const emShown = document.querySelector('[data-contact-email]');
  if (phEl && phShown) phEl.value = phShown.textContent || '';
  if (emEl && emShown) emEl.value = emShown.textContent || '';
}

ownerPageEl.addEventListener('click', (e) => {
  const swBtn = e.target.closest('[data-lang-switch] button');
  if (swBtn) {
    const langKey = swBtn.dataset.lang;
    const parent = swBtn.closest('.owner-cms-section');
    parent.querySelectorAll('[data-lang-switch] button').forEach(b => b.classList.toggle('active', b.dataset.lang === langKey));
    parent.querySelectorAll('[data-cms-lang]').forEach(f => f.style.display = (f.dataset.cmsLang === langKey) ? 'block' : 'none');
    return;
  }
  const tabBtn = e.target.closest('[data-otab]'); if (tabBtn) { switchOwnerTab(tabBtn.dataset.otab); return; }
  const addBtn = e.target.closest('[data-owner-add]');
  if (addBtn) { const k = addBtn.dataset.ownerAdd; if (k === 'product') openOwnerProductModal(); if (k === 'offer') openOwnerOfferModal(); return; }
  const gotoBtn = e.target.closest('[data-owner-goto]'); if (gotoBtn) { switchOwnerTab(gotoBtn.dataset.ownerGoto); return; }
  const editP = e.target.closest('[data-edit-product]'); if (editP) { openOwnerProductModal(editP.dataset.editProduct); return; }
  const delP = e.target.closest('[data-delete-product]'); if (delP) { confirmDelete('product', delP.dataset.deleteProduct); return; }
  const editO = e.target.closest('[data-edit-offer]'); if (editO) { openOwnerOfferModal(editO.dataset.editOffer); return; }
  const delO = e.target.closest('[data-delete-offer]'); if (delO) { confirmDelete('offer', delO.dataset.deleteOffer); return; }
  const delG = e.target.closest('[data-delete-gallery]');
  if (delG) { galleryImages = galleryImages.filter(g => g.id !== delG.dataset.deleteGallery); saveAll(); renderGallery(); renderOwner(); showToast(t('toast.galleryRemoved'), 'bx-trash'); return; }
  const editW = e.target.closest('[data-edit-weight]'); if (editW) { openOwnerWeightModal(parseInt(editW.dataset.editWeight)); return; }
  const delW = e.target.closest('[data-del-weight]');
  if (delW) { const w = parseInt(delW.dataset.delWeight); mixWeights = mixWeights.filter(x => x !== w); saveAll(); renderMixWeights(); renderOwner(); showToast('Weight removed', 'bx-trash'); return; }
  const editPk = e.target.closest('[data-edit-pack]'); if (editPk) { openOwnerPackagingModal(editPk.dataset.editPack); return; }
  const delPk = e.target.closest('[data-del-pack]');
  if (delPk) { mixPackaging = mixPackaging.filter(x => x.id !== delPk.dataset.delPack); saveAll(); renderMixPackaging(); renderOwner(); showToast('Packaging removed', 'bx-trash'); return; }
  const editCt = e.target.closest('[data-edit-candy]'); if (editCt) { openOwnerCandyTypeModal(editCt.dataset.editCandy); return; }
  const delCt = e.target.closest('[data-del-candy]');
  if (delCt) { candyTypes = candyTypes.filter(x => x.id !== delCt.dataset.delCandy); saveAll(); renderMixTypesGrid(); renderOwner(); showToast('Candy type removed', 'bx-trash'); return; }
  const editZ = e.target.closest('[data-edit-zone]'); if (editZ) { openOwnerZoneModal(editZ.dataset.editZone); return; }
  const delZ = e.target.closest('[data-del-zone]');
  if (delZ) { deliveryZones = deliveryZones.filter(x => x.id !== delZ.dataset.delZone); saveAll(); renderOwner(); renderCart(); showToast('Zone removed', 'bx-trash'); return; }
});

function confirmDelete(kind, id) {
  if (pendingDeleteId === id) {
    pendingDeleteId = null;
    if (kind === 'product') { products = products.filter(p => p.id !== id); saveAll(); renderCandies(); renderOwner(); showToast(t('toast.productDeleted'), 'bx-trash'); }
    else if (kind === 'offer') { offers = offers.filter(o => o.id !== id); saveAll(); renderOffers(); renderOwner(); showToast(t('toast.offerDeleted'), 'bx-trash'); }
  } else {
    pendingDeleteId = id;
    showToast(t('toast.confirmDelete'), 'bx-info-circle');
    setTimeout(() => { pendingDeleteId = null; }, 3000);
  }
}

/* ===== OWNER MODALS ===== */
function closeOwnerModals() { document.querySelectorAll('.owner-modal.show').forEach(m => m.classList.remove('show')); }
document.querySelectorAll('[data-close-owner-modal]').forEach(el => el.addEventListener('click', closeOwnerModals));

/* Product */
function openOwnerProductModal(id) {
  const modal = $('ownerProductModal'), form = $('ownerProductForm');
  form.reset(); form.querySelector('[data-field="id"]').value = '';
  $('ownerProductModalTitle').textContent = id ? 'Edit Product' : 'Add Product';
  if (id) {
    const p = products.find(x => x.id === id);
    if (p) ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'price', 'oldPrice', 'badge', 'badge_ar', 'stock', 'img'].forEach(f => {
      const el = form.querySelector(`[data-field="${f}"]`);
      if (el) el.value = p[f] !== undefined && p[f] !== null ? p[f] : '';
    });
  } else form.querySelector('[data-field="stock"]').value = 50;
  modal.classList.add('show');
}
$('ownerProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target, id = form.querySelector('[data-field="id"]').value, data = {};
  form.querySelectorAll('[data-field]').forEach(el => {
    const f = el.dataset.field; if (f === 'id') return;
    if (el.type === 'number') data[f] = parseFloat(el.value) || 0;
    else if (el.type === 'checkbox') data[f] = el.checked;
    else data[f] = el.value.trim();
  });
  if (!data.name || !data.name_ar || !data.price) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) { const idx = products.findIndex(p => p.id === id); if (idx !== -1) products[idx] = { ...products[idx], ...data }; }
  else { data.id = 'p-' + Date.now(); products.push(data); }
  saveAll(); renderCandies(); renderOwner(); closeOwnerModals();
  showToast(t('toast.productSaved'), 'bx-check-circle');
});
$('ownerAddProduct').addEventListener('click', () => openOwnerProductModal());

/* Offer */
function openOwnerOfferModal(id) {
  const modal = $('ownerOfferModal'), form = $('ownerOfferForm');
  form.reset(); form.querySelector('[data-field="id"]').value = '';
  $('ownerOfferModalTitle').textContent = id ? 'Edit Offer' : 'Add Offer';
  if (id) {
    const o = offers.find(x => x.id === id);
    if (o) {
      ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'category', 'category_ar', 'discount', 'discount_ar', 'price', 'oldPrice', 'ends', 'ends_ar', 'img'].forEach(f => {
        const el = form.querySelector(`[data-field="${f}"]`);
        if (el) el.value = o[f] !== undefined && o[f] !== null ? o[f] : '';
      });
      const a = form.querySelector('[data-field="isActive"]'); if (a) a.checked = !!o.isActive;
    }
  } else form.querySelector('[data-field="isActive"]').checked = true;
  modal.classList.add('show');
}
$('ownerOfferForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target, id = form.querySelector('[data-field="id"]').value, data = {};
  form.querySelectorAll('[data-field]').forEach(el => {
    const f = el.dataset.field; if (f === 'id') return;
    if (el.type === 'number') data[f] = parseFloat(el.value) || 0;
    else if (el.type === 'checkbox') data[f] = el.checked;
    else data[f] = el.value.trim();
  });
  if (!data.name || !data.name_ar || !data.price) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) { const idx = offers.findIndex(o => o.id === id); if (idx !== -1) offers[idx] = { ...offers[idx], ...data }; }
  else { data.id = 'offer-' + Date.now(); offers.push(data); }
  saveAll(); renderOffers(); renderOwner(); closeOwnerModals();
  showToast(t('toast.offerSaved'), 'bx-check-circle');
});
$('ownerAddOffer').addEventListener('click', () => openOwnerOfferModal());

/* Gallery */
function openOwnerGalleryModal() { $('ownerGalleryForm').reset(); $('ownerGalleryModal').classList.add('show'); }
$('ownerGalleryForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const img = form.querySelector('[data-field="img"]').value.trim();
  const alt = form.querySelector('[data-field="alt"]').value.trim();
  if (!img) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  galleryImages.push({ id: 'g-' + Date.now(), img, alt });
  saveAll(); renderGallery(); renderOwner(); closeOwnerModals();
  showToast(t('toast.galleryAdded'), 'bx-image-add');
});
$('ownerAddGallery').addEventListener('click', openOwnerGalleryModal);

/* Weight */
function openOwnerWeightModal(val) {
  const f = $('ownerWeightForm'); f.reset();
  f.querySelector('[data-wfield="old"]').value = val || '';
  f.querySelector('[data-wfield="value"]').value = val || '';
  $('ownerWeightModalTitle').textContent = val ? 'Edit Weight' : 'Add Weight';
  $('ownerWeightModal').classList.add('show');
}
$('ownerWeightForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const oldVal = f.querySelector('[data-wfield="old"]').value;
  const newVal = parseInt(f.querySelector('[data-wfield="value"]').value);
  if (!newVal || newVal <= 0) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (oldVal) { const idx = mixWeights.indexOf(parseInt(oldVal)); if (idx !== -1) mixWeights[idx] = newVal; else mixWeights.push(newVal); }
  else if (!mixWeights.includes(newVal)) mixWeights.push(newVal);
  saveAll(); renderMixWeights(); renderOwner(); closeOwnerModals();
  showToast('Weight saved', 'bx-check-circle');
});
$('ownerAddWeight').addEventListener('click', () => openOwnerWeightModal());

/* Packaging */
function openOwnerPackagingModal(id) {
  const f = $('ownerPackagingForm'); f.reset(); f.querySelector('[data-pfield="id"]').value = '';
  $('ownerPackagingModalTitle').textContent = id ? 'Edit Packaging' : 'Add Packaging';
  if (id) {
    const p = mixPackaging.find(x => x.id === id);
    if (p) ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'icon', 'extra', 'img'].forEach(field => {
      const el = f.querySelector(`[data-pfield="${field}"]`);
      if (el) el.value = p[field] !== undefined && p[field] !== null ? p[field] : '';
    });
  } else { f.querySelector('[data-pfield="icon"]').value = 'bx-box'; f.querySelector('[data-pfield="extra"]').value = 0; }
  $('ownerPackagingModal').classList.add('show');
}
$('ownerPackagingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target, id = f.querySelector('[data-pfield="id"]').value, data = {};
  f.querySelectorAll('[data-pfield]').forEach(el => {
    const fld = el.dataset.pfield; if (fld === 'id') return;
    if (el.type === 'number') data[fld] = parseFloat(el.value) || 0;
    else data[fld] = el.value.trim();
  });
  if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) { const idx = mixPackaging.findIndex(p => p.id === id); if (idx !== -1) mixPackaging[idx] = { ...mixPackaging[idx], ...data }; }
  else { data.id = 'pack-' + Date.now(); mixPackaging.push(data); }
  saveAll(); renderMixPackaging(); renderOwner(); closeOwnerModals();
  showToast('Packaging saved', 'bx-check-circle');
});
$('ownerAddPackaging').addEventListener('click', () => openOwnerPackagingModal());

/* Candy Type */
function openOwnerCandyTypeModal(id) {
  const f = $('ownerCandyTypeForm'); f.reset(); f.querySelector('[data-cfield="id"]').value = '';
  $('ownerCandyTypeModalTitle').textContent = id ? 'Edit Candy Type' : 'Add Candy Type';
  if (id) {
    const c = candyTypes.find(x => x.id === id);
    if (c) ['id', 'name', 'name_ar', 'price_per_kg', 'color', 'img'].forEach(field => {
      const el = f.querySelector(`[data-cfield="${field}"]`);
      if (el) el.value = c[field] !== undefined && c[field] !== null ? c[field] : '';
    });
  } else { f.querySelector('[data-cfield="color"]').value = '#e2015d'; f.querySelector('[data-cfield="price_per_kg"]').value = 12; }
  $('ownerCandyTypeModal').classList.add('show');
}
$('ownerCandyTypeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target, id = f.querySelector('[data-cfield="id"]').value, data = {};
  f.querySelectorAll('[data-cfield]').forEach(el => {
    const fld = el.dataset.cfield; if (fld === 'id') return;
    if (el.type === 'number') data[fld] = parseFloat(el.value) || 0;
    else data[fld] = el.value.trim();
  });
  if (!data.name || !data.name_ar || !data.price_per_kg || !data.img) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) { const idx = candyTypes.findIndex(c => c.id === id); if (idx !== -1) candyTypes[idx] = { ...candyTypes[idx], ...data }; }
  else { data.id = 'candy-' + Date.now(); candyTypes.push(data); }
  saveAll(); renderMixTypesGrid(); renderOwner();
  if (mixModal.classList.contains('show')) { renderMixSlots(); if (mixState.step === 4) renderMixReview(); }
  closeOwnerModals();
  showToast('Candy type saved', 'bx-check-circle');
});
$('ownerAddCandyType').addEventListener('click', () => openOwnerCandyTypeModal());

/* Zone */
function openOwnerZoneModal(id) {
  const f = $('ownerZoneForm'); f.reset(); f.querySelector('[data-zfield="id"]').value = '';
  $('ownerZoneModalTitle').textContent = id ? 'Edit Delivery Zone' : 'Add Delivery Zone';
  if (id) {
    const z = deliveryZones.find(x => x.id === id);
    if (z) {
      f.querySelector('[data-zfield="name"]').value = z.name || '';
      f.querySelector('[data-zfield="name_ar"]').value = z.name_ar || '';
      f.querySelector('[data-zfield="price"]').value = z.price || 0;
      f.querySelector('[data-zfield="active"]').checked = !!z.active;
    }
  } else { f.querySelector('[data-zfield="active"]').checked = true; f.querySelector('[data-zfield="price"]').value = 2; }
  $('ownerZoneModal').classList.add('show');
}
$('ownerZoneForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target, id = f.querySelector('[data-zfield="id"]').value;
  const data = {
    name: f.querySelector('[data-zfield="name"]').value.trim(),
    name_ar: f.querySelector('[data-zfield="name_ar"]').value.trim(),
    price: parseFloat(f.querySelector('[data-zfield="price"]').value) || 0,
    active: f.querySelector('[data-zfield="active"]').checked
  };
  if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
  if (id) { const idx = deliveryZones.findIndex(z => z.id === id); if (idx !== -1) deliveryZones[idx] = { ...deliveryZones[idx], ...data }; }
  else { data.id = 'zone-' + Date.now(); deliveryZones.push(data); }
  saveAll(); renderOwner(); renderCart(); closeOwnerModals();
  showToast('Zone saved', 'bx-check-circle');
});
$('ownerAddZone').addEventListener('click', () => openOwnerZoneModal());

/* Content Save */
$('ownerSaveContent').addEventListener('click', () => {
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.dataset.cms;
    const langAttr = el.closest('[data-cms-lang]')?.dataset.cmsLang || 'en';
    if (!contentOverrides[key]) contentOverrides[key] = {};
    contentOverrides[key][langAttr] = el.value;
    if (I18N[langAttr]) I18N[langAttr][key] = el.value;
  });
  const phEl = document.querySelector('[data-cms-contact="phone"]');
  const emEl = document.querySelector('[data-cms-contact="email"]');
  if (phEl) document.querySelector('[data-contact-phone]').textContent = phEl.value;
  if (emEl) document.querySelector('[data-contact-email]').textContent = emEl.value;
  saveAll(); applyLanguage(lang);
  showToast(t('toast.contentSaved'), 'bx-check-circle');
});
$('ownerResetContent').addEventListener('click', () => {
  try { localStorage.removeItem(LS_KEYS.content); } catch (e) {}
  location.reload();
});

/* Data */
$('ownerExportData').addEventListener('click', () => {
  const data = { products, offers, galleryImages, contentOverrides, mixWeights, mixPackaging, candyTypes, deliveryZones };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'hat-candy-backup.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('toast.dataExported'), 'bx-download');
});
$('ownerImportData').addEventListener('click', () => $('ownerImportFile').click());
$('ownerImportFile').addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
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
      if (data.contentOverrides && typeof data.contentOverrides === 'object') {
        contentOverrides = data.contentOverrides;
        Object.keys(contentOverrides).forEach(k => {
          const v = contentOverrides[k];
          if (I18N.en[k] !== undefined && v.en !== undefined) I18N.en[k] = v.en;
          if (I18N.ar[k] !== undefined && v.ar !== undefined) I18N.ar[k] = v.ar;
        });
      }
      saveAll(); renderOffers(); renderCandies(); renderGallery(); renderCart();
      renderMixWeights(); renderMixPackaging(); renderMixTypesGrid(); renderOwner(); applyLanguage(lang);
      showToast(t('toast.dataImported'), 'bx-check-circle');
    } catch (err) { showToast(t('toast.dataInvalid'), 'bx-error-circle'); }
  };
  reader.readAsText(file); e.target.value = '';
});
$('ownerResetAll').addEventListener('click', () => {
  if (!confirm('Reset all data to defaults? This cannot be undone.')) return;
  try { Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  location.reload();
});

$('ownerBack').addEventListener('click', closeOwnerPage);
$('ownerSignout').addEventListener('click', signOutUser);

/* ===== LANGUAGE ===== */
function applyLanguage(newLang) {
  lang = (newLang === 'ar') ? 'ar' : 'en';
  try { localStorage.setItem('hatcandy-lang', lang); } catch (e) {}
  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.title = t('title.page');
  langLabel.textContent = isAr ? 'EN' : 'AR';

  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });

  const backIcon = $('mixBackIcon');
  if (backIcon) backIcon.className = 'bx ' + (isAr ? 'bx-right-arrow-alt' : 'bx-left-arrow-alt');

  renderOffers(); renderCandies(); renderGallery(); renderCart();

  if (mixModal.classList.contains('show')) {
    renderMixWeights(); renderMixPackaging(); renderMixSlots(); renderMixTypesGrid();
    mixCountNumber.textContent = mixState.typesCount;
    if (mixState.step === 4) renderMixReview();
    updateMixStep();
  }
  if (loginPanel.classList.contains('show') && !loginSuccess.classList.contains('show')) {
    if (checkoutIntent) { loginTitle.textContent = t('login.almost'); loginSubtitle.textContent = t('login.almostSub'); }
  }
  if (accountPageEl.classList.contains('show')) renderAccountPage();
  if (adminPageEl.classList.contains('show')) renderAdmin();
  if (ownerPageEl.classList.contains('show')) renderOwner();

  updateSign(true);
  revealOnScroll();
}
langToggle.addEventListener('click', () => applyLanguage(lang === 'ar' ? 'en' : 'ar'));

/* ===== INIT ===== */
loadAll();
renderOffers();
renderCandies();
renderGallery();
renderCart();
applyLanguage(lang);
updateSign(false);
setInterval(() => updateSign(false), 10000);
revealOnScroll();