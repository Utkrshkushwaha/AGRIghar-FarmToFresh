import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home", browse: "Browse Products", login: "Login", register: "Register",
      logout: "Logout", dashboard: "Dashboard", cart: "Cart", orders: "My Orders",
      addProduct: "Add Product", farmerDashboard: "Farmer Dashboard",
      welcome: "Fresh from the Farm, Direct to You",
      subtitle: "Buy fresh vegetables, fruits & grains directly from local farmers. No middlemen, fair prices.",
      shopNow: "Shop Now", sellNow: "Start Selling",
      nearbyFarmers: "Nearby Farmers", featuredProducts: "Featured Products",
      addToCart: "Add to Cart", buyNow: "Buy Now", outOfStock: "Out of Stock",
      price: "Price", quantity: "Quantity", category: "Category",
      search: "Search products...", filter: "Filter", sortBy: "Sort By",
      placeOrder: "Place Order", orderPlaced: "Order Placed!", trackOrder: "Track Order",
      orderStatus: "Order Status", totalAmount: "Total Amount",
      name: "Name", email: "Email", password: "Password", phone: "Phone",
      address: "Address", submit: "Submit", cancel: "Cancel", save: "Save",
      farmer: "Farmer", consumer: "Consumer", vendor: "Vendor",
      rating: "Rating", review: "Write a Review", reviews: "Reviews",
      myListings: "My Listings", earnings: "Earnings", totalOrders: "Total Orders",
      language: "Language", settings: "Settings",
      productName: "Product Name", description: "Description", unit: "Unit",
      kg: "Kg", piece: "Piece", dozen: "Dozen", liter: "Liter",
      vegetables: "Vegetables", fruits: "Fruits", grains: "Grains",
      dairy: "Dairy", spices: "Spices", other: "Other",
      pending: "Pending", confirmed: "Confirmed", dispatched: "Dispatched", delivered: "Delivered",
      noProducts: "No products found", noOrders: "No orders yet",
      profileUpdated: "Profile updated!", loginSuccess: "Welcome back!",
      registerSuccess: "Account created!", orderSuccess: "Order placed successfully!",
      removeFromCart: "Remove", emptyCart: "Your cart is empty",
      checkout: "Checkout", continueShopping: "Continue Shopping",
      deliveryAddress: "Delivery Address", paymentMethod: "Payment Method",
      cod: "Cash on Delivery", online: "Online Payment",
      yourLocation: "Your Location", distance: "Distance",
    }
  },
  hi: {
    translation: {
      home: "होम", browse: "उत्पाद देखें", login: "लॉगिन", register: "रजिस्टर",
      logout: "लॉगआउट", dashboard: "डैशबोर्ड", cart: "कार्ट", orders: "मेरे ऑर्डर",
      addProduct: "उत्पाद जोड़ें", farmerDashboard: "किसान डैशबोर्ड",
      welcome: "खेत से सीधे आपके घर तक",
      subtitle: "स्थानीय किसानों से सीधे ताज़ी सब्जियां, फल और अनाज खरीदें। कोई बिचौलिया नहीं, उचित मूल्य।",
      shopNow: "अभी खरीदें", sellNow: "बेचना शुरू करें",
      nearbyFarmers: "नजदीकी किसान", featuredProducts: "विशेष उत्पाद",
      addToCart: "कार्ट में जोड़ें", buyNow: "अभी खरीदें", outOfStock: "स्टॉक में नहीं",
      price: "मूल्य", quantity: "मात्रा", category: "श्रेणी",
      search: "उत्पाद खोजें...", filter: "फ़िल्टर", sortBy: "क्रमबद्ध करें",
      placeOrder: "ऑर्डर दें", orderPlaced: "ऑर्डर दिया गया!", trackOrder: "ऑर्डर ट्रैक करें",
      orderStatus: "ऑर्डर स्थिति", totalAmount: "कुल राशि",
      name: "नाम", email: "ईमेल", password: "पासवर्ड", phone: "फोन",
      address: "पता", submit: "जमा करें", cancel: "रद्द करें", save: "सहेजें",
      farmer: "किसान", consumer: "उपभोक्ता", vendor: "विक्रेता",
      rating: "रेटिंग", review: "समीक्षा लिखें", reviews: "समीक्षाएं",
      myListings: "मेरी लिस्टिंग", earnings: "कमाई", totalOrders: "कुल ऑर्डर",
      language: "भाषा", settings: "सेटिंग्स",
      productName: "उत्पाद का नाम", description: "विवरण", unit: "इकाई",
      kg: "किलो", piece: "टुकड़ा", dozen: "दर्जन", liter: "लीटर",
      vegetables: "सब्जियां", fruits: "फल", grains: "अनाज",
      dairy: "डेयरी", spices: "मसाले", other: "अन्य",
      pending: "लंबित", confirmed: "पुष्टि", dispatched: "भेजा गया", delivered: "डिलीवर",
      noProducts: "कोई उत्पाद नहीं मिला", noOrders: "अभी तक कोई ऑर्डर नहीं",
      profileUpdated: "प्रोफ़ाइल अपडेट हुई!", loginSuccess: "वापस स्वागत है!",
      registerSuccess: "खाता बनाया गया!", orderSuccess: "ऑर्डर सफलतापूर्वक दिया गया!",
      removeFromCart: "हटाएं", emptyCart: "आपका कार्ट खाली है",
      checkout: "चेकआउट", continueShopping: "खरीदारी जारी रखें",
      deliveryAddress: "डिलीवरी पता", paymentMethod: "भुगतान विधि",
      cod: "कैश ऑन डिलीवरी", online: "ऑनलाइन भुगतान",
      yourLocation: "आपका स्थान", distance: "दूरी",
    }
  },
  mr: {
    translation: {
      home: "मुख्यपृष्ठ", browse: "उत्पादने पहा", login: "लॉगिन", register: "नोंदणी",
      logout: "लॉगआउट", dashboard: "डॅशबोर्ड", cart: "कार्ट", orders: "माझे ऑर्डर",
      addProduct: "उत्पाद जोडा", farmerDashboard: "शेतकरी डॅशबोर्ड",
      welcome: "शेतातून थेट तुमच्या घरी",
      subtitle: "स्थानिक शेतकऱ्यांकडून थेट ताज्या भाज्या, फळे आणि धान्य खरेदी करा.",
      shopNow: "आता खरेदी करा", sellNow: "विक्री सुरू करा",
      nearbyFarmers: "जवळचे शेतकरी", featuredProducts: "विशेष उत्पादने",
      addToCart: "कार्टमध्ये जोडा", buyNow: "आता खरेदी करा", outOfStock: "स्टॉक नाही",
      price: "किंमत", quantity: "प्रमाण", category: "श्रेणी",
      search: "उत्पादने शोधा...", filter: "फिल्टर", sortBy: "क्रमवारी",
      placeOrder: "ऑर्डर द्या", orderPlaced: "ऑर्डर दिला!", trackOrder: "ऑर्डर ट्रॅक करा",
      farmer: "शेतकरी", consumer: "ग्राहक", vendor: "विक्रेता",
      vegetables: "भाज्या", fruits: "फळे", grains: "धान्य",
      dairy: "दुग्धजन्य", spices: "मसाले", other: "इतर",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
