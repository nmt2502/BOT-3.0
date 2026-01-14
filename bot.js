const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const http = require("http");

// ================= TOKEN BOT =================
const TOKEN = "8595477726:AAFVWI0G1ytx56K5pJrUs801dex5_SOlYz8"; // <-- DÁN TOKEN BOT VÀO ĐÂY

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const USER_FILE = "./user.json";

// ================= KEEP ALIVE (RENDER) =================
http.createServer((req, res) => {
    res.writeHead(200);
    res.end("BOT VIP 3.0 IS RUNNING");
}).listen(PORT);

// ================= BOT =================
const bot = new TelegramBot(TOKEN, { polling: true });

// ================= USER FUNCTIONS =================
function loadUsers() {
    if (!fs.existsSync(USER_FILE)) {
        fs.writeFileSync(USER_FILE, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(USER_FILE, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}

function getTime() {
    return new Date().toLocaleString("vi-VN");
}

// ================= /START =================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || "Không Tên";

    let users = loadUsers();
    let user = users.find(u => u.ID_User === userId);

    if (!user) {
        user = {
            Ten_User: userName,
            ID_User: userId,
            So_Du: 0,
            Kich_Hoat: "Chưa Kích Hoạt",
            Thoi_Gian: getTime()
        };
        users.push(user);
        saveUsers(users);
    }

    const text = `
🎉 *CHÀO MỪNG ĐẾN VỚI BOT VIP 3.0* 🎉

📌 *THÔNG TIN CỦA BẠN*
👤 Tên: ${user.Ten_User}
🆔 ID: ${user.ID_User}
💰 Số Dư: ${user.So_Du}
🔐 Kích Hoạt: ${user.Kich_Hoat}

🍀 *CHÚC BẠN NHIỀU MAY MẮN* 🍀
`;

    bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: [
                ["🚀 Chạy Tool", "💰 Nạp Tiền"],
                ["🔑 Mua Key", "✅ Kích Hoạt"],
                ["📜 Lịch Sử", "📞 Liên Hệ Admin"]
            ],
            resize_keyboard: true
        }
    });
});

// ================= BUTTON EVENTS =================
bot.on("message", (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (!text) return;

    if (text === "🚀 Chạy Tool") {
        bot.sendMessage(chatId, "⚙️ Tool đang được phát triển...");
    }

    if (text === "💰 Nạp Tiền") {
        bot.sendMessage(chatId, "💳 Vui lòng liên hệ Admin để nạp tiền.");
    }

    if (text === "🔑 Mua Key") {
        bot.sendMessage(chatId, "🔐 Liên hệ Admin để mua key VIP.");
    }

    if (text === "✅ Kích Hoạt") {
        bot.sendMessage(chatId, "📥 Vui lòng gửi key để kích hoạt.");
    }

    if (text === "📜 Lịch Sử") {
        bot.sendMessage(chatId, "📜 Hiện chưa có lịch sử giao dịch.");
    }

    if (text === "📞 Liên Hệ Admin") {
        bot.sendMessage(chatId, "📞 Admin: @your_admin");
    }
});

console.log("🚀 BOT VIP 3.0 ĐÃ KHỞI ĐỘNG");
