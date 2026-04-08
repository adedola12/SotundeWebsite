// ═══════════════════════════════════════════════════════
// PASTE THIS INTO YOUR GOOGLE APPS SCRIPT EDITOR
// Deploy > Manage deployments > Edit > Deploy
// ═══════════════════════════════════════════════════════

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = {};
    }

    // Columns: A=First Name | B=Email | C=Date | D=Type | E=Phone | F=Message
    sheet.appendRow([
      data.firstName || "",
      data.email || "",
      new Date().toISOString(),
      data.type || "SUBSCRIBER",
      data.phone || "",
      data.message || ""
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
