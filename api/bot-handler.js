/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * Copyright (c) 2026 Shinei Nouzen
 *
 * Released under the MIT License.
 * You Are Free To Use, Modify, And Distribute This Software In Accordance With The Terms Of The License.
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { startMessage, donateMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

/**
 * Handle incoming Telegram Update
 * https://core.telegram.org/bots/api#update
 *
 * @param {Object} data - Telegram update object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {Array} Reactions - Array of emoji reactions
 * @param {Array} RestrictedChats - Array of restricted chat IDs
 * @param {string} botUsername - Bot username
 * @param {number} RandomLevel - Random level for group reactions (0-10)
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        if (data.message && (text === '/start' || text === '/start@' + botUsername)) {
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.chat.type === "private" ? content.from.first_name : content.chat.title), [
                [
                    { "text": "✚ Aᴅᴅ Tᴏ Cʜᴀɴɴᴇʟ ✚", "url": `https://t.me/${botUsername}?startchannel=botstart` },
                    { "text": "✚ Aᴅᴅ Tᴏ Gʀᴏᴜᴘ ✚", "url": `https://t.me/${botUsername}?startgroup=botstart` },
                ],
                [
                    { "text": "☁️ Sᴏᴜʀᴄᴇ Cᴏᴅᴇ ✨", "url": "https://t.me/Shineii86" },
                ],
                [
                    { "text": "🎁 Sᴜᴘᴘᴏʀᴛ Us - Dᴏɴᴀᴛᴇ 🤝", "url": "https://t.me/AlisaReactionBot?start=donate" }
                ]
            ]);
        } else if (data.message && text === '/reactions') {
            const reactions = Reactions.join(", ");
            await botApi.sendMessage(chatId, "🚀 Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs: \n\n" + reactions);
        } else if (data.message && (text === '/donate' || text === '/start donate')) {
            await botApi.sendInvoice(
                chatId,
                "🎁 𝗗𝗼𝗻𝗮𝘁𝗲 𝘁𝗼 𝗔𝗹𝗶𝘀𝗮 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝗕𝗼𝘁 ✨",
                donateMessage,
                '{}',
                '',
                'donate',
                'XTR',
                [{ label: 'Pay ⭐️10', amount: 10}],
            )
        } else {
            // Calculate the threshold: higher RandomLevel, lower threshold
            let threshold = 1 - (RandomLevel / 10);
            if (!RestrictedChats.includes(chatId)) {
                // Check if chat is a group or supergroup to determine if reactions should be random
                if (["group", "supergroup"].includes(content.chat.type)) {
                    // Run Function Randomly - According to the RANDOM_LEVEL
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    // For non-group chats, set the reaction directly
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
        await botApi.sendMessage(data.pre_checkout_query.from.id, "Thank you for your donation! 💝");
    }
}
