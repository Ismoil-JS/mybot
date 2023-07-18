import { join } from "path";

export default (bot, chatId, cource) => {
    bot.sendPhoto(chatId, join(process.cwd(), "src", "images", cource.image),
        {
            caption: `Title: <b>${cource.name}</b>
 <i>${cource.description}</i>
<span class="tg-spoiler">👨‍💻 ${cource.price}  000 so'm</span>`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "YouTube",
                            url: cource.youTubeLink,
                        },
                        {
                            text: "Kursga yozilish",
                            callback_data: `${cource.name}`
                        }
                    ]

                ],
            },
        });

}