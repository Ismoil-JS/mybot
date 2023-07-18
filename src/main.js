import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import typeOfInterest from "./keyboards/typeOfInterest.keyboard.js";
import coursesKeyboard from "./keyboards/keyboards.courses.js";
import read from "./utils/read.js";
import write from "./utils/write.js";
import courceHandler from "./handlers/cource.handler.js"
import locationFinder from "./handlers/location.handler.js"

config();
const API_KEY = process.env.TG_API;
const bot = new TelegramBot(API_KEY, { polling: true });

bot.onText(/\/start/, (message) => {
    bot.sendMessage(message.chat.id, `Hello ${message.from.first_name}. What do you want to know about our course?`,
        typeOfInterest,
    );
});

bot.on("message", (message) => {
    const chatId = message.chat.id;

    if (message.text == "Back") {
        bot.sendMessage(chatId, `You can continue to ask me questions.`,
            typeOfInterest);
    }

    if (message.text == "Bizning kurslar") {
        bot.sendMessage(message.chat.id, `Which one do you want to see?`,
            {
                reply_markup: {
                    keyboard: coursesKeyboard.cources,
                    resize_keyboard: true,
                }
            },);
    }
});

bot.on("message", (message) => {
    const chatId = message.chat.id;

    const findCource = read("cources.json").find((cource) => cource.name == message.text);

    if (findCource) {
        courceHandler(bot, chatId, findCource)
    }

});

let data = {}

bot.on("callback_query", (message) => {
    const chatId = message.message.chat.id;
    if (message.data) {
        bot.sendMessage(chatId, "Kontaktingizni yuboring", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Kontaktni jo'natish",
                            request_contact: true,
                        },
                    ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
        });
        data.course = message.data
    }
});

bot.on("contact", message => {
    const chatId = message.chat.id

    if (message.contact) {
        bot.sendMessage(chatId, "Joylashuvingizni jo'nating", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Joylashuvni jo'natish",
                            request_location: true,
                        }
                    ]
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        }
        )
    }
    data.phone_number = message.contact.phone_number,
        data.name = message.chat.first_name
})



bot.on("location", async message => {
    const { latitude, longitude } = message.location
    const location = await locationFinder(latitude, longitude)
    data.location = location.results[0].formatted

    await bot.sendMessage(-837401857,
        `
    <b>Course-Type: ${data.course}</b>
    <b>Candidate: ${data.name}</b>
    <b>Phone-Number: ${data.phone_number}</b>
    <b>Location: ${data.location}</b>
    <b>Time: ${new Date().toLocaleTimeString()},  ${new Date().toLocaleDateString()}</b>
    `, {
        parse_mode: "HTML"
    })

    const allOrders = read("orders.json")
    allOrders.push({
        id: allOrders.at(-1)?.id + 1 || 1,
        ...data,
    })

    write("orders.json", allOrders)


    await bot.sendMessage(message.chat.id, `Congratulation, ${message.from.first_name}! Your request has been sent.`)

})

bot.on("new_chat_members", (message) => {
    bot.sendMessage(message.chat.id, `Welcome ${message.from.first_name}`);
});
