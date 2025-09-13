const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function (event) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

  try {
    // Отримуємо дані, які надіслав сайт у форматі JSON
    const { file_data, file_name, caption, chat_id } = JSON.parse(event.body);

    // Перетворюємо текстові дані (Base64) назад у файл (Buffer)
    const fileBuffer = Buffer.from(file_data, 'base64');

    // Створюємо нову форму для відправки в Telegram
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('caption', caption);
    formData.append('document', fileBuffer, file_name);
    formData.append('disable_notification', true);
    
    // Відправляємо запит до Telegram
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Telegram API error: ${errorData.description}` }),
      };
    }

    const responseData = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error: ' + error.message }),
    };
  }
};
