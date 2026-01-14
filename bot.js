
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const http = require("http");

// ================= TOKEN =================
const TOKEN = "8595477726:AAFVWI0G1ytx56K5pJrUs801dex5_SOlYz8";

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const USER_FILE = "./user.json";

// ================= KEEP ALIVE =================
http.createServer((req, res) => {
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

function getUser(userId) {
    return loadUsers().find(u => u.ID_User === userId);
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

    bot.sendMessage(chatId, `
🎉 *CHÀO MỪNG ĐẾN VỚI BOT VIP 3.0*

👤 Tên: ${user.Ten_User}
🆔 ID: ${user.ID_User}
💰 Số Dư: ${user.So_Du}
🔐 Kích Hoạt: ${user.Kich_Hoat}

🍀 *Chúc bạn nhiều may mắn*
`, {
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

// ================= MESSAGE HANDLER =================
bot.on("message", (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const user = getUser(userId);
    if (!text || !user) return;

    // ===== CHẠY TOOL =====
    if (text === "🚀 Chạy Tool") {
        if (user.Kich_Hoat !== "VIP") {
            return bot.sendMessage(chatId, `
🔐 *TÀI KHOẢN CHƯA CÓ KEY VIP*

Vui lòng mua key hoặc nhập key để tiếp tục.
`, { parse_mode: "Markdown" });
        }

        return bot.sendMessage(chatId, "🎮 *CHỌN TOOL*", {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["🎰 Baccarat", "☀️ Sunwin"],
                    ["🎲 Lc97", "🔥 Hitclub"],
                    ["🎯 B52", "🎮 789Club"],
                    ["⬅️ Quay Lại"]
                ],
                resize_keyboard: true
            }
        });
    }

    // ===== BACCARAT =====
    if (text === "🎰 Baccarat") {
        let rows = [];
        for (let i = 1; i <= 16; i += 4) {
            rows.push([
                `C${i.toString().padStart(2, "0")}`,
                `C${(i+1).toString().padStart(2, "0")}`,
                `C${(i+2).toString().padStart(2, "0")}`,
                `C${(i+3).toString().padStart(2, "0")}`
            ]);
        }
        rows.push(["⬅️ Quay Lại"]);

        return bot.sendMessage(chatId, "🎰 *BACCARAT*", {
            parse_mode: "Markdown",
            reply_markup: { keyboard: rows, resize_keyboard: true }
        });
    }

    // ===== SUNWIN =====
    if (text === "☀️ Sunwin") {
        return bot.sendMessage(chatId, "☀️ *SUNWIN*", {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["Tài Xỉu", "Sicbo"],
                    ["Volta"],
                    ["⬅️ Quay Lại"]
                ],
                resize_keyboard: true
            }
        });
    }

    // ===== LC97 =====
    if (text === "🎲 Lc97") {
        return bot.sendMessage(chatId, "🎲 *LC97*", {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["Tài Xỉu MD5"],
                    ["⬅️ Quay Lại"]
                ],
                resize_keyboard: true
            }
        });
    }

    // ===== QUAY LẠI =====
    if (text === "⬅️ Quay Lại") {
        return bot.sendMessage(chatId, "🏠 *MENU CHÍNH*", {
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
    }
});

console.log("🚀 BOT VIP 3.0 ĐÃ CHẠY");console.log("🚀 BOT VIP 3.0 ĐÃ KHỞI ĐỘNG");
