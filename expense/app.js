/* =========================================
   DAILY. — #235347 FOREST VAULT MULTI-WALLET APP
   Features: Dual-Theme Bubbles | Expense & Top-up Sounds | Locked Nav | 3 Languages
========================================= */

const STORAGE_KEY = "daily_forest_vault_v9";

/* ================= GUARANTEED WEB AUDIO SOUND ENGINE ================= */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

document.addEventListener("pointerdown", () => {
    getAudioContext();
}, { once: true });

/* 1. Add Money Sound: Royal Golden Coin Chime */
function playAddMoneySound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

        const now = ctx.currentTime;
        const notes = [587.33, 739.99, 880, 1174.66];

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = idx === 3 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.065);

            gain.gain.setValueAtTime(0.001, now + idx * 0.065);
            gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.065 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.42);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.065);
            osc.stop(now + idx * 0.065 + 0.45);
        });
    } catch (e) {}
}

/* 2. Add Expense Sound: Crisp Cash Register / Debit Drop + Clink */
function playExpenseSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(660, now);
        osc1.frequency.exponentialRampToValueAtTime(240, now + 0.18);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.exponentialRampToValueAtTime(0.35, now + 0.015);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.24);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(987.77, now + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.34);

        gain2.gain.setValueAtTime(0.001, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.28, now + 0.135);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.38);
    } catch (e) {}
}

/* 3. Transfer Sound: Dual-Wave Sync */
function playTransferSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

        const now = ctx.currentTime;
        [440, 659.25].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.09);
            gain.gain.setValueAtTime(0.001, now + i * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.22, now + i * 0.09 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.26);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.09);
            osc.stop(now + i * 0.09 + 0.28);
        });
    } catch (e) {}
}

/* ================= TRANSLATIONS (3 LANGUAGES) ================= */
const I18N = {
    en: {
        tagline: "Spend smart. Live royal.",
        subtitle: "FOREST VAULT",
        total_balance_label: "TOTAL BALANCE",
        across_all_wallets: "Across all wallets",
        new_wallet: "New Wallet",
        total_added: "Added",
        total_spent: "Spent",
        my_wallets: "My Wallets",
        transfer: "Transfer",
        todays_spending: "Today's Spending",
        transactions: "Transactions",
        shopping: "Shopping",
        this_month: "This Month",
        quick_actions: "Quick Actions",
        add_expense: "Add Expense",
        deduct_wallet: "Deduct from wallet",
        add_money: "Add Money",
        topup_wallet_sub: "Top-up any wallet",
        recent_expenses: "Recent Expenses",
        see_all: "See all",
        no_expenses_yet: "No expenses yet",
        start_tracking: "Start tracking your daily spending.",
        your_money: "YOUR MONEY",
        expenses: "Expenses",
        cat_all: "All",
        cat_food: "Food",
        cat_travel: "Travel",
        cat_shopping: "Shopping",
        cat_bills: "Bills",
        cat_other: "Other",
        cat_food_icon: "🍴 Food",
        cat_travel_icon: "🚗 Travel",
        cat_shopping_icon: "🛍 Shopping",
        cat_bills_icon: "◈ Bills",
        cat_other_icon: "• Other",
        no_expenses_found: "No expenses found",
        expenses_appear: "Your expenses will appear here.",
        to_buy: "TO BUY",
        remaining: "Remaining",
        completed: "Completed",
        estimated: "Estimated",
        add_item_placeholder: "Add an item...",
        list_empty: "Your list is empty",
        add_to_buy: "Add something you need to buy.",
        overview: "OVERVIEW",
        insights: "Insights",
        month_spending_title: "This Month's Spending",
        based_on_records: "Based on your recorded expenses",
        by_category: "By Category",
        nav_home: "Home",
        nav_expenses: "Expenses",
        nav_shopping: "Shopping",
        nav_insights: "Insights",
        new_entry: "NEW ENTRY",
        select_wallet_deduct: "Which wallet to deduct money from?",
        amount: "Amount",
        what_spent: "What did you spend on?",
        spent_placeholder: "e.g. Lunch, Petrol",
        category: "Category",
        date: "Date",
        save_expense: "Save Expense",
        topup_wallet: "TOP-UP WALLET",
        select_wallet_add: "Select Wallet to Add Money",
        note: "Note (Optional)",
        note_placeholder: "e.g. Salary, Bonus, Cash",
        add_money_btn: "Add Money to Wallet",
        luxury_vault: "FOREST VAULT",
        create_new_wallet: "Create New Wallet",
        manage_wallet: "MANAGE WALLET",
        edit_wallet: "Edit Wallet",
        current_balance_edit: "Current Balance (₹)",
        save_changes: "Save Changes",
        wallet_name: "Wallet Name",
        wallet_name_placeholder: "e.g. Cash, HDFC Bank, GPay",
        wallet_theme: "Wallet Forest Finish",
        initial_balance: "Initial Balance (₹)",
        create_wallet_btn: "Create Wallet",
        internal_move: "INTERNAL MOVE",
        transfer_money: "Transfer Money",
        from_wallet: "From Wallet",
        to_wallet: "To Wallet",
        transfer_btn: "Transfer Now",
        new_item: "NEW ITEM",
        add_shopping_item: "Add Shopping Item",
        item_name: "Item",
        item_placeholder: "e.g. Milk",
        estimated_price: "Estimated Price",
        add_to_list: "Add to List",
        wallet_balance_label: "Wallet Balance",
        topup_btn: "+ Add",
        spend_btn: "− Expense",
        toast_invalid_amount: "Enter a valid amount",
        toast_enter_title: "Enter what you spent on",
        toast_insufficient: "Insufficient balance in selected wallet!",
        toast_expense_saved: "Expense saved & deducted!",
        toast_money_added: "Money added to wallet!",
        toast_wallet_created: "New wallet created!",
        toast_wallet_updated: "Wallet updated!",
        toast_wallet_deleted: "Wallet deleted!",
        toast_same_wallet: "Select two different wallets!",
        toast_transfer_done: "Money transferred successfully!",
        toast_min_one_wallet: "At least one wallet is required",
        confirm_delete_expense: "Delete this expense? Money will be refunded to the wallet.",
        confirm_delete_wallet: "Are you sure you want to delete this wallet?"
    },
    gu: {
        tagline: "સમજદારીથી વાપરો, રોયલ જીવો.",
        subtitle: "ફોરેસ્ટ વોલ્ટ",
        total_balance_label: "કુલ બેલેન્સ",
        across_all_wallets: "બધા વોલેટનું કુલ બેલેન્સ",
        new_wallet: "નવું વોલેટ",
        total_added: "કુલ જમા",
        total_spent: "કુલ ખર્ચ",
        my_wallets: "મારા વોલેટ્સ",
        transfer: "ટ્રાન્સફર",
        todays_spending: "આજનો ખર્ચ",
        transactions: "વ્યવહારો",
        shopping: "શોપિંગ",
        this_month: "આ મહિને",
        quick_actions: "ઝડપી કામગીરી",
        add_expense: "ખર્ચ ઉમેરો",
        deduct_wallet: "વોલેટમાંથી પૈસા કાપો",
        add_money: "પૈસા ઉમેરો",
        topup_wallet_sub: "કોઈપણ વોલેટમાં પૈસા નાખો",
        recent_expenses: "તાજેતરના ખર્ચા",
        see_all: "બધા જુઓ",
        no_expenses_yet: "હજુ કોઈ ખર્ચ નથી",
        start_tracking: "તમારા રોજિંદા ખર્ચનો હિસાબ શરૂ કરો.",
        your_money: "તમારા પૈસા",
        expenses: "ખર્ચાઓ",
        cat_all: "બધા",
        cat_food: "ખાવાનું",
        cat_travel: "મુસાફરી",
        cat_shopping: "ખરીદી",
        cat_bills: "બિલ",
        cat_other: "અન્ય",
        cat_food_icon: "🍴 ખાવાનું",
        cat_travel_icon: "🚗 મુસાફરી",
        cat_shopping_icon: "🛍 ખરીદી",
        cat_bills_icon: "◈ બિલ",
        cat_other_icon: "• અન્ય",
        no_expenses_found: "કોઈ ખર્ચ મળ્યો નથી",
        expenses_appear: "તમારા ખર્ચા અહીં દેખાશે.",
        to_buy: "ખરીદવાનું છે",
        remaining: "બાકી",
        completed: "પૂર્ણ",
        estimated: "અંદાજિત",
        add_item_placeholder: "વસ્તુનું નામ લખો...",
        list_empty: "તમારું લિસ્ટ ખાલી છે",
        add_to_buy: "જે ખરીદવાનું હોય તે અહીં ઉમેરો.",
        overview: "ઝલક",
        insights: "વિશ્લેષણ",
        month_spending_title: "આ મહિનાનો કુલ ખર્ચ",
        based_on_records: "તમારા નોંધાયેલા ખર્ચ મુજબ",
        by_category: "કેટેગરી મુજબ",
        nav_home: "હોમ",
        nav_expenses: "ખર્ચ",
        nav_shopping: "શોપિંગ",
        nav_insights: "હિસાબ",
        new_entry: "નવી એન્ટ્રી",
        select_wallet_deduct: "કયા વોલેટમાંથી પૈસા કાપવા છે?",
        amount: "રકમ",
        what_spent: "શેના પર ખર્ચ કર્યો?",
        spent_placeholder: "દા.ત. નાસ્તો, પેટ્રોલ",
        category: "કેટેગરી",
        date: "તારીખ",
        save_expense: "ખર્ચ સેવ કરો",
        topup_wallet: "વોલેટ ટોપ-અપ",
        select_wallet_add: "પૈસા ઉમેરવા માટે વોલેટ પસંદ કરો",
        note: "નોંધ (મરજિયાત)",
        note_placeholder: "દા.ત. પગાર, રોકડ, બચત",
        add_money_btn: "વોલેટમાં પૈસા ઉમેરો",
        luxury_vault: "ફોરેસ્ટ વોલ્ટ",
        create_new_wallet: "નવું વોલેટ બનાવો",
        manage_wallet: "વોલેટ સેટિંગ્સ",
        edit_wallet: "વોલેટ એડિટ કરો",
        current_balance_edit: "હાલનું બેલેન્સ (₹)",
        save_changes: "ફેરફાર સેવ કરો",
        wallet_name: "વોલેટનું નામ",
        wallet_name_placeholder: "દા.ત. રોકડ, HDFC બેંક, GPay",
        wallet_theme: "વોલેટની ફોરેસ્ટ ડિઝાઇન",
        initial_balance: "શરૂઆતનું બેલેન્સ (₹)",
        create_wallet_btn: "વોલેટ બનાવો",
        internal_move: "વોલેટ ટ્રાન્સફર",
        transfer_money: "પૈસા ટ્રાન્સફર કરો",
        from_wallet: "કયા વોલેટમાંથી",
        to_wallet: "કયા વોલેટમાં",
        transfer_btn: "ટ્રાન્સફર કરો",
        new_item: "નવી વસ્તુ",
        add_shopping_item: "શોપિંગ વસ્તુ ઉમેરો",
        item_name: "વસ્તુ",
        item_placeholder: "દા.ત. દૂધ, શાકભાજી",
        estimated_price: "અંદાજિત કિંમત",
        add_to_list: "લિસ્ટમાં ઉમેરો",
        wallet_balance_label: "વોલેટ બેલેન્સ",
        topup_btn: "+ ઉમેરો",
        spend_btn: "− ખર્ચ",
        toast_invalid_amount: "સાચી રકમ દાખલ કરો",
        toast_enter_title: "ખર્ચની વિગત લખો",
        toast_insufficient: "આ વોલેટમાં પૂરતું બેલેન્સ નથી!",
        toast_expense_saved: "ખર્ચ સેવ થયો અને પૈસા કપાઈ ગયા!",
        toast_money_added: "વોલેટમાં પૈસા ઉમેરાઈ ગયા!",
        toast_wallet_created: "નવું વોલેટ બની ગયું!",
        toast_wallet_updated: "વોલેટ અપડેટ થઈ ગયું!",
        toast_wallet_deleted: "વોલેટ ડિલીટ થઈ ગયું!",
        toast_same_wallet: "બે અલગ-અલગ વોલેટ પસંદ કરો!",
        toast_transfer_done: "પૈસા સફળતાપૂર્વક ટ્રાન્સફર થઈ ગયા!",
        toast_min_one_wallet: "ઓછામાં ઓછું એક વોલેટ જરૂરી છે",
        confirm_delete_expense: "આ ખર્ચ ડિલીટ કરવો છે? પૈસા વોલેટમાં પાછા જમા થશે.",
        confirm_delete_wallet: "શું તમે ખરેખર આ વોલેટ ડિલીટ કરવા માંગો છો?"
    },
    hi: {
        tagline: "समझदारी से खर्च करें, रॉयल जिएं।",
        subtitle: "फ़ॉरेस्ट वॉल्ट",
        total_balance_label: "कुल बैलेंस",
        across_all_wallets: "सभी वॉलेट का कुल बैलेंस",
        new_wallet: "नया वॉलेट",
        total_added: "कुल जमा",
        total_spent: "कुल खर्च",
        my_wallets: "मेरे वॉलेट्स",
        transfer: "ट्रांसफर",
        todays_spending: "आज का खर्च",
        transactions: "लेन-देन",
        shopping: "शॉपिंग",
        this_month: "इस महीने",
        quick_actions: "त्वरित कार्य",
        add_expense: "खर्च जोड़ें",
        deduct_wallet: "वॉलेट से पैसे काटें",
        add_money: "पैसे जोड़ें",
        topup_wallet_sub: "किसी भी वॉलेट में पैसे डालें",
        recent_expenses: "हाल के खर्च",
        see_all: "सभी देखें",
        no_expenses_yet: "अभी कोई खर्च नहीं है",
        start_tracking: "अपने दैनिक खर्चों का हिसाब शुरू करें।",
        your_money: "आपका पैसा",
        expenses: "खर्चे",
        cat_all: "सभी",
        cat_food: "खाना",
        cat_travel: "यात्रा",
        cat_shopping: "शॉपिंग",
        cat_bills: "बिल",
        cat_other: "अन्य",
        cat_food_icon: "🍴 खाना",
        cat_travel_icon: "🚗 यात्रा",
        cat_shopping_icon: "🛍 शॉपिंग",
        cat_bills_icon: "◈ बिल",
        cat_other_icon: "• अन्य",
        no_expenses_found: "कोई खर्च नहीं मिला",
        expenses_appear: "आपके खर्चे यहाँ दिखाई देंगे।",
        to_buy: "खरीदना है",
        remaining: "बाकी",
        completed: "पूरा हुआ",
        estimated: "अनुमानित",
        add_item_placeholder: "सामान जोड़ें...",
        list_empty: "आपकी लिस्ट खाली है",
        add_to_buy: "जो खरीदना है उसे यहाँ जोड़ें।",
        overview: "सारांश",
        insights: "विश्लेषण",
        month_spending_title: "इस महीने का कुल खर्च",
        based_on_records: "आपके दर्ज खर्चों के आधार पर",
        by_category: "श्रेणी के अनुसार",
        nav_home: "होम",
        nav_expenses: "खर्च",
        nav_shopping: "शॉपिंग",
        nav_insights: "हिसाब",
        new_entry: "नई एंट्री",
        select_wallet_deduct: "किस वॉलेट से पैसे काटने हैं?",
        amount: "राशि",
        what_spent: "किस चीज़ पर खर्च किया?",
        spent_placeholder: "जैसे: लंच, पेट्रोल",
        category: "श्रेणी",
        date: "तारीख",
        save_expense: "खर्च सेव करें",
        topup_wallet: "वॉलेट टॉप-अप",
        select_wallet_add: "पैसे जोड़ने के लिए वॉलेट चुनें",
        note: "नोट (वैकल्पिक)",
        note_placeholder: "जैसे: सैलरी, कैश, बचत",
        add_money_btn: "वॉलेट में पैसे जोड़ें",
        luxury_vault: "फ़ॉरेस्ट वॉल्ट",
        create_new_wallet: "नया वॉलेट बनाएं",
        manage_wallet: "वॉलेट सेटिंग्स",
        edit_wallet: "वॉलेट एडिट करें",
        current_balance_edit: "वर्तमान बैलेंस (₹)",
        save_changes: "बदलाव सेव करें",
        wallet_name: "वॉलेट का नाम",
        wallet_name_placeholder: "जैसे: कैश, HDFC बैंक, GPay",
        wallet_theme: "वॉलेट फ़ॉरेस्ट स्टाइल",
        initial_balance: "शुरुआती बैलेंस (₹)",
        create_wallet_btn: "वॉलेट बनाएं",
        internal_move: "वॉलेट ट्रांसफर",
        transfer_money: "पैसे ट्रांसफर करें",
        from_wallet: "किस वॉलेट से",
        to_wallet: "किस वॉलेट में",
        transfer_btn: "ट्रांसफर करें",
        new_item: "नया सामान",
        add_shopping_item: "शॉपिंग आइटम जोड़ें",
        item_name: "सामान",
        item_placeholder: "जैसे: दूध, फल",
        estimated_price: "अनुमानित कीमत",
        add_to_list: "लिस्ट में जोड़ें",
        wallet_balance_label: "वॉलेट बैलेंस",
        topup_btn: "+ जोड़ें",
        spend_btn: "− खर्च",
        toast_invalid_amount: "सही राशि दर्ज करें",
        toast_enter_title: "खर्च का विवरण लिखें",
        toast_insufficient: "इस वॉलेट में पर्याप्त बैलेंस नहीं है!",
        toast_expense_saved: "खर्च सेव हुआ और पैसे कट गए!",
        toast_money_added: "वॉलेट में पैसे जुड़ गए!",
        toast_wallet_created: "नया वॉलेट बन गया!",
        toast_wallet_updated: "वॉलेट अपडेट हो गया!",
        toast_wallet_deleted: "वॉलेट डिलीट हो गया!",
        toast_same_wallet: "दो अलग-अलग वॉलेट चुनें!",
        toast_transfer_done: "पैसे सफलतापूर्वक ट्रांसफर हो गए!",
        toast_min_one_wallet: "कम से कम एक वॉलेट ज़रूरी है",
        confirm_delete_expense: "क्या यह खर्च हटाना है? पैसे वॉलेट में वापस जुड़ जाएंगे।",
        confirm_delete_wallet: "क्या आप वाकई यह वॉलेट डिलीट करना चाहते हैं?"
    }
};

/* ================= STATE ================= */
let state = {
    theme: "light",
    lang: "en",
    wallets: [],
    expenses: [],
    shopping: [],
    moneyAdded: []
};

let currentFilter = "all";
let selectedCategory = "Food";
let selectedExpenseWalletId = null;
let selectedTopupWalletId = null;
let selectedFromWalletId = null;
let selectedToWalletId = null;
let selectedNewWalletTheme = "forest";
let editingWalletId = null;
let editingWalletTheme = "forest";
let lastAnimatedTotal = 0;

/* ================= DUAL-THEME VISIBLE BUBBLES GENERATOR ================= */
function initContinuousParticles() {
    const field = document.getElementById("particlesField");
    if (!field) return;
    field.innerHTML = "";

    const count = 22;
    for (let i = 0; i < count; i++) {
        const bubble = document.createElement("span");
        bubble.className = "gold-particle";
        const size = Math.random() * 11 + 8;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 96}%`;
        bubble.style.animationDuration = `${Math.random() * 7 + 6}s`;
        bubble.style.animationDelay = `-${Math.random() * 10}s`;
        field.appendChild(bubble);
    }
}

/* ================= STORAGE & MIGRATION ================= */
function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.theme = parsed.theme || "light";
            state.lang = parsed.lang || "en";
            state.wallets = Array.isArray(parsed.wallets) ? parsed.wallets : [];
            state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
            state.shopping = Array.isArray(parsed.shopping) ? parsed.shopping : [];
            state.moneyAdded = Array.isArray(parsed.moneyAdded) ? parsed.moneyAdded : [];
        } else {
            const legacyKeys = ["daily_neofintech_v8", "daily_wealth_studio_v7", "daily_multi_wallet_v6", "daily_luxury_vault_v5", "daily_expense_app_v4"];
            for (const key of legacyKeys) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    const old = JSON.parse(raw);
                    if (Array.isArray(old.wallets) && old.wallets.length > 0) {
                        state.wallets = old.wallets.map((w, i) => ({
                            ...w,
                            theme: ["forest", "jade", "goldforest", "pine"][i % 4]
                        }));
                        state.expenses = old.expenses || [];
                        state.shopping = old.shopping || [];
                        state.moneyAdded = old.moneyAdded || [];
                        state.lang = old.lang || "en";
                    } else {
                        const oldAdded = Array.isArray(old.moneyAdded) ? old.moneyAdded : [];
                        const oldExpenses = Array.isArray(old.expenses) ? old.expenses : [];
                        const totalIn = oldAdded.reduce((s, i) => s + Number(i.amount || 0), 0);
                        const totalOut = oldExpenses.reduce((s, i) => s + Number(i.amount || 0), 0);
                        const defaultId = createId();

                        state.wallets = [
                            { id: defaultId, name: "Cash Wallet", theme: "forest", balance: Math.max(0, totalIn - totalOut) },
                            { id: createId(), name: "Bank / UPI", theme: "goldforest", balance: 0 }
                        ];
                        state.expenses = oldExpenses.map(e => ({ ...e, walletId: defaultId }));
                        state.shopping = Array.isArray(old.shopping) ? old.shopping : [];
                        state.moneyAdded = oldAdded;
                    }
                    saveData();
                    break;
                }
            }
        }

        if (state.wallets.length === 0) {
            state.wallets = [
                { id: createId(), name: "Cash Wallet", theme: "forest", balance: 0 },
                { id: createId(), name: "Bank / UPI", theme: "goldforest", balance: 0 }
            ];
            saveData();
        }
    } catch (err) {
        console.error("Storage load error:", err);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ================= THEME (LIGHT & DARK MODE) ================= */
function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#091512" : "#235347");
    saveData();
}

/* ================= HELPERS & ANIMATED COUNTER ================= */
function createId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const p = dateStr.split("-");
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
}

function formatMoney(amount) {
    return "₹" + (Number(amount) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function animateBalanceValue(el, start, end, duration = 550) {
    if (start === end) {
        el.textContent = formatMoney(end);
        return;
    }
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;
        el.textContent = formatMoney(Math.round(current));
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = formatMoney(end);
        }
    }
    requestAnimationFrame(step);
}

function escapeHTML(val) {
    return String(val)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
}

function getCategoryIcon(cat) {
    const map = { Food: "🍴", Travel: "🚗", Shopping: "🛍", Bills: "◈", Other: "•" };
    return map[cat] || "•";
}

function isSameMonth(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr + "T00:00:00");
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}

/* ================= 3D TILT PHYSICS ================= */
function attach3DTilt(card) {
    const glare = card.querySelector(".wallet-glare");

    const handleMove = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -7;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 9;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,243,209,0.32), transparent 65%)`;
        }
    };

    const resetTilt = () => { card.style.transform = ""; };

    card.addEventListener("mousemove", e => handleMove(e.clientX, e.clientY));
    card.addEventListener("mouseleave", resetTilt);
    card.addEventListener("touchmove", e => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    card.addEventListener("touchend", resetTilt);
}

/* ================= COMPACT LANGUAGE DROPDOWN ENGINE ================= */
function applyLanguage(lang) {
    state.lang = lang;
    saveData();

    const codeMap = { en: "EN", gu: "ગુ", hi: "हि" };
    const currentCodeEl = document.getElementById("currentLangCode");
    if (currentCodeEl) {
        currentCodeEl.textContent = codeMap[lang] || "EN";
    }

    document.querySelectorAll(".lang-option").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (t(key)) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t(key)) el.placeholder = t(key);
    });

    renderAll();
}

/* ================= NAVIGATION & MODALS ================= */
function openPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const target = document.getElementById(pageId);
    if (target) target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle("active", item.dataset.page === pageId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
    document.getElementById(id).classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeAllModals() {
    document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
    document.body.style.overflow = "";
}

/* ================= MULTIPLE WALLETS RENDERING ================= */
function renderWalletsCarousel() {
    const container = document.getElementById("walletsCarousel");
    container.innerHTML = "";

    state.wallets.forEach((wallet, index) => {
        const card = document.createElement("div");
        card.className = `lux-wallet theme-${wallet.theme || "forest"}`;
        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <div class="wallet-glare"></div>
            <div class="lux-wallet-top">
                <div class="lux-wallet-title">
                    <div class="wallet-badge-icon">👛</div>
                    <span class="lux-wallet-name">${escapeHTML(wallet.name)}</span>
                </div>
                <div class="wallet-icon-actions">
                    <button type="button" class="wallet-mini-btn edit-wallet-btn" data-id="${wallet.id}" title="Edit Wallet">✎</button>
                    ${state.wallets.length > 1 ? `<button type="button" class="wallet-mini-btn delete-wallet-btn" data-id="${wallet.id}" title="Delete Wallet">🗑</button>` : ""}
                </div>
            </div>

            <div class="lux-wallet-balance">
                <small>${t("wallet_balance_label")}</small>
                <h3>${formatMoney(wallet.balance)}</h3>
            </div>

            <div class="lux-wallet-footer">
                <button type="button" class="wallet-action-pill add-btn quick-topup-wallet" data-id="${wallet.id}">
                    ${t("topup_btn")}
                </button>
                <button type="button" class="wallet-action-pill spend-btn quick-spend-wallet" data-id="${wallet.id}">
                    ${t("spend_btn")}
                </button>
            </div>
        `;
        attach3DTilt(card);
        container.appendChild(card);
    });

    const totalBalance = state.wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
    const totalAdded = state.moneyAdded.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const totalSpent = state.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const balanceEl = document.getElementById("totalNetBalance");
    animateBalanceValue(balanceEl, lastAnimatedTotal, totalBalance);
    lastAnimatedTotal = totalBalance;

    document.getElementById("totalAdded").textContent = formatMoney(totalAdded);
    document.getElementById("totalSpent").textContent = formatMoney(totalSpent);
}

function renderWalletSelector(containerId, activeId, onSelect) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    state.wallets.forEach(wallet => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "wallet-choice-chip" + (wallet.id === activeId ? " active" : "");
        btn.innerHTML = `
            <strong>👛 ${escapeHTML(wallet.name)}</strong>
            <span>${formatMoney(wallet.balance)}</span>
        `;
        btn.addEventListener("click", () => {
            onSelect(wallet.id);
            renderWalletSelector(containerId, wallet.id, onSelect);
        });
        container.appendChild(btn);
    });
}

/* ================= CREATE, EDIT & DELETE WALLET ================= */
function openNewWalletModal() {
    document.getElementById("newWalletForm").reset();
    selectedNewWalletTheme = "forest";
    document.querySelectorAll("#walletThemePicker .theme-chip").forEach(c => {
        c.classList.toggle("active", c.dataset.theme === "forest");
    });
    openModal("newWalletModal");
}

function createNewWallet(event) {
    event.preventDefault();
    const name = document.getElementById("newWalletName").value.trim();
    const initial = Number(document.getElementById("newWalletBalance").value) || 0;
    if (!name) return;

    const newWallet = {
        id: createId(),
        name: name,
        theme: selectedNewWalletTheme,
        balance: initial
    };

    state.wallets.push(newWallet);

    if (initial > 0) {
        state.moneyAdded.push({
            id: createId(),
            walletId: newWallet.id,
            amount: initial,
            note: "Initial Balance",
            date: getToday(),
            createdAt: Date.now()
        });
        playAddMoneySound();
    }

    saveData();
    closeAllModals();
    renderAll();
    showToast(t("toast_wallet_created"));
}

function openEditWalletModal(id) {
    const wallet = state.wallets.find(w => w.id === id);
    if (!wallet) return;

    editingWalletId = wallet.id;
    editingWalletTheme = wallet.theme || "forest";

    document.getElementById("editWalletName").value = wallet.name;
    document.getElementById("editWalletBalance").value = wallet.balance;

    document.querySelectorAll("#editWalletThemePicker .theme-chip").forEach(c => {
        c.classList.toggle("active", c.dataset.theme === editingWalletTheme);
    });

    openModal("editWalletModal");
}

function saveEditedWallet(event) {
    event.preventDefault();
    const wallet = state.wallets.find(w => w.id === editingWalletId);
    if (!wallet) return;

    const newName = document.getElementById("editWalletName").value.trim();
    const newBalance = Number(document.getElementById("editWalletBalance").value);

    if (!newName) return;

    wallet.name = newName;
    wallet.theme = editingWalletTheme;
    if (!isNaN(newBalance) && newBalance >= 0) {
        wallet.balance = newBalance;
    }

    saveData();
    closeAllModals();
    renderAll();
    showToast(t("toast_wallet_updated"));
}

function deleteWallet(id) {
    if (state.wallets.length <= 1) {
        showToast(t("toast_min_one_wallet"));
        return;
    }
    if (!window.confirm(t("confirm_delete_wallet"))) return;

    state.wallets = state.wallets.filter(w => w.id !== id);
    saveData();
    renderAll();
    showToast(t("toast_wallet_deleted"));
}

/* ================= WALLET TO WALLET TRANSFER ================= */
function openTransferModal() {
    if (state.wallets.length < 2) {
        openNewWalletModal();
        return;
    }
    document.getElementById("transferForm").reset();
    selectedFromWalletId = state.wallets[0].id;
    selectedToWalletId = state.wallets[1].id;

    renderWalletSelector("fromWalletSelector", selectedFromWalletId, id => {
        selectedFromWalletId = id;
    });
    renderWalletSelector("toWalletSelector", selectedToWalletId, id => {
        selectedToWalletId = id;
    });

    openModal("transferModal");
}

function handleTransfer(event) {
    event.preventDefault();
    const amount = Number(document.getElementById("transferAmount").value);
    if (!amount || amount <= 0) {
        showToast(t("toast_invalid_amount"));
        return;
    }
    if (selectedFromWalletId === selectedToWalletId) {
        showToast(t("toast_same_wallet"));
        return;
    }

    const fromWallet = state.wallets.find(w => w.id === selectedFromWalletId);
    const toWallet = state.wallets.find(w => w.id === selectedToWalletId);
    if (!fromWallet || !toWallet) return;

    if (amount > Number(fromWallet.balance || 0)) {
        showToast(t("toast_insufficient"));
        return;
    }

    fromWallet.balance = Number(fromWallet.balance) - amount;
    toWallet.balance = Number(toWallet.balance) + amount;

    playTransferSound();
    saveData();
    closeAllModals();
    renderAll();
    showToast(t("toast_transfer_done"));
}

/* ================= TOP-UP MONEY TO WALLET ================= */
function openMoneyModal(preselectedWalletId = null) {
    getAudioContext();
    document.getElementById("moneyForm").reset();
    selectedTopupWalletId = preselectedWalletId || (state.wallets[0] && state.wallets[0].id);

    renderWalletSelector("topupWalletSelector", selectedTopupWalletId, id => {
        selectedTopupWalletId = id;
    });

    openModal("moneyModal");
    setTimeout(() => document.getElementById("moneyAmount").focus(), 250);
}

function addMoney(event) {
    event.preventDefault();
    const amount = Number(document.getElementById("moneyAmount").value);
    const note = document.getElementById("moneyNote").value.trim();

    if (!amount || amount <= 0) {
        showToast(t("toast_invalid_amount"));
        return;
    }

    const wallet = state.wallets.find(w => w.id === selectedTopupWalletId) || state.wallets[0];
    wallet.balance = Number(wallet.balance || 0) + amount;

    state.moneyAdded.push({
        id: createId(),
        walletId: wallet.id,
        amount: amount,
        note: note || wallet.name,
        date: getToday(),
        createdAt: Date.now()
    });

    playAddMoneySound();
    saveData();
    closeAllModals();
    renderAll();
    showToast(t("toast_money_added"));
}

/* ================= ADD EXPENSE WITH WALLET DEDUCTION ================= */
function openExpenseModal(preselectedWalletId = null) {
    getAudioContext();
    document.getElementById("expenseForm").reset();
    document.getElementById("expenseDate").value = getToday();
    selectedCategory = "Food";

    if (preselectedWalletId && state.wallets.some(w => w.id === preselectedWalletId)) {
        selectedExpenseWalletId = preselectedWalletId;
    } else {
        const withBalance = state.wallets.find(w => Number(w.balance) > 0);
        selectedExpenseWalletId = (withBalance || state.wallets[0]).id;
    }

    renderWalletSelector("expenseWalletSelector", selectedExpenseWalletId, id => {
        selectedExpenseWalletId = id;
    });

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === selectedCategory);
    });

    openModal("expenseModal");
    setTimeout(() => document.getElementById("expenseAmount").focus(), 250);
}

function addExpense(event) {
    event.preventDefault();
    const amount = Number(document.getElementById("expenseAmount").value);
    const title = document.getElementById("expenseTitle").value.trim();
    const date = document.getElementById("expenseDate").value;

    if (!amount || amount <= 0) {
        showToast(t("toast_invalid_amount"));
        return;
    }
    if (!title) {
        showToast(t("toast_enter_title"));
        return;
    }

    const wallet = state.wallets.find(w => w.id === selectedExpenseWalletId) || state.wallets[0];

    if (amount > Number(wallet.balance || 0)) {
        showToast(t("toast_insufficient"));
        return;
    }

    wallet.balance = Number(wallet.balance) - amount;

    state.expenses.unshift({
        id: createId(),
        walletId: wallet.id,
        walletName: wallet.name,
        amount: amount,
        title: title,
        category: selectedCategory,
        date: date || getToday(),
        createdAt: Date.now()
    });

    playExpenseSound();
    saveData();
    closeAllModals();
    renderAll();
    showToast(t("toast_expense_saved"));
}

function deleteExpense(id) {
    const exp = state.expenses.find(e => e.id === id);
    if (!exp) return;
    if (!window.confirm(t("confirm_delete_expense"))) return;

    const wallet = state.wallets.find(w => w.id === exp.walletId);
    if (wallet) {
        wallet.balance = Number(wallet.balance || 0) + Number(exp.amount || 0);
    }

    state.expenses = state.expenses.filter(e => e.id !== id);
    saveData();
    renderAll();
}

/* ================= RENDER EXPENSES ================= */
function createExpenseElement(expense, idx = 0) {
    const wallet = state.wallets.find(w => w.id === expense.walletId);
    const walletLabel = wallet ? wallet.name : (expense.walletName || "Wallet");

    const item = document.createElement("div");
    item.className = "expense-item";
    item.style.animationDelay = `${idx * 0.05}s`;
    item.innerHTML = `
        <div class="expense-icon">${getCategoryIcon(expense.category)}</div>
        <div class="expense-info">
            <strong>${escapeHTML(expense.title)}</strong>
            <div class="expense-meta">
                <span class="wallet-badge">👛 ${escapeHTML(walletLabel)}</span>
                <small>${escapeHTML(expense.category)} • ${formatDate(expense.date)}</small>
            </div>
        </div>
        <div class="expense-right">
            <span class="expense-amount">-${formatMoney(expense.amount)}</span>
            <button class="delete-btn delete-expense" data-id="${expense.id}">×</button>
        </div>
    `;
    return item;
}

function renderRecentExpenses() {
    const container = document.getElementById("recentExpenses");
    container.innerHTML = "";
    const recent = [...state.expenses]
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 5);
    recent.forEach((exp, idx) => container.appendChild(createExpenseElement(exp, idx)));
}

function renderExpenses() {
    const container = document.getElementById("expensesList");
    container.innerHTML = "";

    let list = [...state.expenses].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (currentFilter !== "all") {
        list = list.filter(e => e.category === currentFilter);
    }

    const empty = document.getElementById("expensesEmpty");
    empty.classList.toggle("hidden", list.length > 0);
    list.forEach((exp, idx) => container.appendChild(createExpenseElement(exp, idx)));
}

/* ================= SHOPPING ================= */
function openShoppingModal() {
    document.getElementById("shoppingForm").reset();
    openModal("shoppingModal");
    setTimeout(() => document.getElementById("shoppingName").focus(), 250);
}

function addShopping(name, price = 0) {
    name = String(name || "").trim();
    if (!name) return false;

    state.shopping.push({
        id: createId(),
        name: name,
        price: Number(price) || 0,
        completed: false,
        createdAt: Date.now()
    });
    saveData();
    renderAll();
    return true;
}

function renderShopping() {
    const container = document.getElementById("shoppingList");
    container.innerHTML = "";

    const sorted = [...state.shopping].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    document.getElementById("shoppingEmpty").classList.toggle("hidden", sorted.length > 0);

    sorted.forEach((item, idx) => {
        const el = document.createElement("div");
        el.className = "shopping-item" + (item.completed ? " completed" : "");
        el.style.animationDelay = `${idx * 0.04}s`;
        el.innerHTML = `
            <button class="shopping-check" data-id="${item.id}">${item.completed ? "✓" : ""}</button>
            <span class="shopping-name">${escapeHTML(item.name)}</span>
            ${Number(item.price) > 0 ? `<span class="shopping-price">${formatMoney(item.price)}</span>` : ""}
            <button class="delete-btn delete-shopping" data-id="${item.id}">×</button>
        `;
        container.appendChild(el);
    });

    document.getElementById("shoppingRemaining").textContent = state.shopping.filter(i => !i.completed).length;
    document.getElementById("shoppingCompleted").textContent = state.shopping.filter(i => i.completed).length;
    const est = state.shopping.reduce((s, i) => s + Number(i.price || 0), 0);
    document.getElementById("shoppingTotal").textContent = formatMoney(est);
}

/* ================= DASHBOARD & INSIGHTS ================= */
function updateDashboard() {
    const today = getToday();
    const todayExps = state.expenses.filter(e => e.date === today);
    const todaySum = todayExps.reduce((s, e) => s + Number(e.amount), 0);
    const monthSum = state.expenses.filter(e => isSameMonth(e.date)).reduce((s, e) => s + Number(e.amount), 0);

    document.getElementById("todayTotal").textContent = formatMoney(todaySum);
    document.getElementById("todayTransactions").textContent = todayExps.length;
    document.getElementById("todayShopping").textContent = state.shopping.filter(i => !i.completed).length;
    document.getElementById("monthTotal").textContent = formatMoney(monthSum);
    document.getElementById("homeEmpty").classList.toggle("hidden", state.expenses.length > 0);
}

function renderInsights() {
    const monthExps = state.expenses.filter(e => isSameMonth(e.date));
    const total = monthExps.reduce((s, e) => s + Number(e.amount), 0);
    document.getElementById("insightMonthTotal").textContent = formatMoney(total);

    const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];
    const container = document.getElementById("categoryStats");
    container.innerHTML = "";

    categories.forEach(cat => {
        const catTotal = monthExps.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0);
        const pct = total > 0 ? Math.min(100, (catTotal / total) * 100) : 0;

        const row = document.createElement("div");
        row.className = "category-row";
        row.innerHTML = `
            <div class="category-top">
                <span class="category-name">${getCategoryIcon(cat)} ${t("cat_" + cat.toLowerCase())}</span>
                <span class="category-value">${formatMoney(catTotal)}</span>
            </div>
            <div class="progress"><div style="width:${pct}%"></div></div>
        `;
        container.appendChild(row);
    });
}

function renderAll() {
    renderWalletsCarousel();
    renderRecentExpenses();
    renderExpenses();
    renderShopping();
    updateDashboard();
    renderInsights();
}

/* ================= BUTTON RIPPLE EFFECT ================= */
document.addEventListener("pointerdown", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const wave = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${e.clientX - rect.left - size / 2}px`;
    wave.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
});

/* ================= INITIALIZATION ================= */
document.addEventListener("DOMContentLoaded", () => {
    initContinuousParticles();
    loadData();
    applyTheme(state.theme);
    applyLanguage(state.lang);

    // Split-Curtain & Vault Ring Reveal
    const entry = document.getElementById("entryScreen");
    const app = document.getElementById("mainApp");
    setTimeout(() => {
        app.classList.remove("hidden");
        entry.classList.add("open");
        setTimeout(() => {
            entry.style.display = "none";
        }, 700);
    }, 1250);

    document.getElementById("themeToggleBtn").addEventListener("click", () => {
        applyTheme(state.theme === "light" ? "dark" : "light");
    });

    // Compact Language Dropdown Toggle
    const langWrap = document.getElementById("langDropdownWrap");
    const langTrigger = document.getElementById("langTriggerBtn");

    langTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        langWrap.classList.toggle("open");
    });

    document.querySelectorAll(".lang-option").forEach(btn => {
        btn.addEventListener("click", () => {
            applyLanguage(btn.dataset.lang);
            langWrap.classList.remove("open");
        });
    });

    document.addEventListener("click", (e) => {
        if (!langWrap.contains(e.target)) {
            langWrap.classList.remove("open");
        }
    });

    document.querySelectorAll("[data-page]").forEach(btn => {
        btn.addEventListener("click", () => openPage(btn.dataset.page));
    });

    document.querySelectorAll(".expense-action").forEach(b => b.addEventListener("click", () => openExpenseModal()));
    document.querySelectorAll(".topup-action").forEach(b => b.addEventListener("click", () => openMoneyModal()));
    document.querySelectorAll(".shopping-action").forEach(b => b.addEventListener("click", openShoppingModal));
    document.getElementById("openNewWalletBtn").addEventListener("click", openNewWalletModal);
    document.getElementById("openTransferBtn").addEventListener("click", openTransferModal);

    document.getElementById("expenseForm").addEventListener("submit", addExpense);
    document.getElementById("moneyForm").addEventListener("submit", addMoney);
    document.getElementById("newWalletForm").addEventListener("submit", createNewWallet);
    document.getElementById("editWalletForm").addEventListener("submit", saveEditedWallet);
    document.getElementById("transferForm").addEventListener("submit", handleTransfer);
    document.getElementById("shoppingForm").addEventListener("submit", e => {
        e.preventDefault();
        if (addShopping(document.getElementById("shoppingName").value, document.getElementById("shoppingPrice").value)) {
            closeAllModals();
        }
    });

    document.getElementById("quickShoppingBtn").addEventListener("click", () => {
        const inp = document.getElementById("quickShoppingInput");
        if (addShopping(inp.value, 0)) inp.value = "";
    });
    document.getElementById("quickShoppingInput").addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (addShopping(e.target.value, 0)) e.target.value = "";
        }
    });

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedCategory = btn.dataset.category;
            document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b === btn));
        });
    });

    document.querySelectorAll("#walletThemePicker .theme-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            selectedNewWalletTheme = chip.dataset.theme;
            document.querySelectorAll("#walletThemePicker .theme-chip").forEach(c => c.classList.toggle("active", c === chip));
        });
    });

    document.querySelectorAll("#editWalletThemePicker .theme-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            editingWalletTheme = chip.dataset.theme;
            document.querySelectorAll("#editWalletThemePicker .theme-chip").forEach(c => c.classList.toggle("active", c === chip));
        });
    });

    document.querySelectorAll(".filter").forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn));
            renderExpenses();
        });
    });

    document.querySelectorAll(".close-modal, .modal-backdrop").forEach(el => {
        el.addEventListener("click", closeAllModals);
    });

    document.addEventListener("click", e => {
        const topupBtn = e.target.closest(".quick-topup-wallet");
        if (topupBtn) {
            openMoneyModal(topupBtn.dataset.id);
            return;
        }

        const spendBtn = e.target.closest(".quick-spend-wallet");
        if (spendBtn) {
            openExpenseModal(spendBtn.dataset.id);
            return;
        }

        const editWalletBtn = e.target.closest(".edit-wallet-btn");
        if (editWalletBtn) {
            openEditWalletModal(editWalletBtn.dataset.id);
            return;
        }

        const delWalletBtn = e.target.closest(".delete-wallet-btn");
        if (delWalletBtn) {
            deleteWallet(delWalletBtn.dataset.id);
            return;
        }

        const delExp = e.target.closest(".delete-expense");
        if (delExp) {
            deleteExpense(delExp.dataset.id);
            return;
        }

        const delShop = e.target.closest(".delete-shopping");
        if (delShop) {
            state.shopping = state.shopping.filter(i => i.id !== delShop.dataset.id);
            saveData();
            renderAll();
            return;
        }

        const checkShop = e.target.closest(".shopping-check");
        if (checkShop) {
            const item = state.shopping.find(i => i.id === checkShop.dataset.id);
            if (item) {
                item.completed = !item.completed;
                saveData();
                renderAll();
            }
        }
    });

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
});