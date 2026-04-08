# Google Sheets Integration Setup

This guide connects the SignUp form to a Google Sheet so all subscriber data is stored automatically.

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Sotunde Website Subscribers"**
4. In Row 1, add these headers:
   - A1: `First Name`
   - B1: `Email`
   - C1: `Date Subscribed`

## Step 2: Create the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append a new row with the subscriber data
    sheet.appendRow([
      data.firstName || "",
      data.email || "",
      data.date || new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (name the project "Sotunde Subscribers")

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - **Description**: Sotunde Subscriber Webhook
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the app when prompted (click through the "unsafe" warning)
6. Copy the **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 4: Add the URL to Your Server

1. Open `server/.env`
2. Paste the URL:
   ```
   GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/s/AKfycbx.../exec
   ```
3. Restart your server

## That's it!

Now when someone submits the SignUp form (or the footer form), their First Name and Email will be:
1. Saved to MongoDB (your database)
2. Pushed to Google Sheets (your spreadsheet)

The Google Sheet updates in real-time. You can share the sheet with team members for easy access.
