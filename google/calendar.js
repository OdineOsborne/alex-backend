const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

async function getTodayEvents(calendarId = 'primary') {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59);

  const res = await calendar.events.list({
    calendarId,
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });

  return res.data.items || [];
}

module.exports = { getTodayEvents };
