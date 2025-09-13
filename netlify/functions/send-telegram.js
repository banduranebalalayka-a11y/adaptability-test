exports.handler = async function (event) {
  // ----> ДОДАЙТЕ ЦЕЙ РЯДОК <----
  console.log("Function started. Is token loaded?", !!process.env.TELEGRAM_BOT_TOKEN);

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

  // ... решта коду функції залишається без змін
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      body: event.body,
      headers: event.headers,
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
