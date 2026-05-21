# Hướng dẫn kết nối Form lời chúc → Google Sheets

## Bước 1 — Mở Google Sheet của bạn
Link: https://docs.google.com/spreadsheets/d/1yM8c9jN-eopB_TJHR-0u3UPHf0fwv3aZfEbsUZV_0bY/edit

## Bước 2 — Tạo tiêu đề cột (dòng đầu tiên)
Trong Sheet, nhập vào 4 ô đầu tiên của dòng 1:
| A | B | C | D |
|---|---|---|---|
| Thời gian | Họ và tên | Mối quan hệ | Lời chúc |

## Bước 3 — Mở Apps Script
1. Trên thanh menu của Sheet, chọn **Extensions (Tiện ích mở rộng) → Apps Script**
2. Xóa toàn bộ nội dung mặc định trong hộp soạn thảo

## Bước 4 — Dán đoạn code sau vào Apps Script

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1yM8c9jN-eopB_TJHR-0u3UPHf0fwv3aZfEbsUZV_0bY')
                                 .getActiveSheet();
    const data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('vi-VN'),
      data.name     || '',
      data.relation || '',
      data.msg      || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Bước 5 — Deploy (Triển khai)
1. Nhấn nút **Deploy (Triển khai) → New deployment (Triển khai mới)**
2. Chọn loại: **Web app**
3. Thiết lập:
   - **Execute as:** Me (tài khoản của bạn)
   - **Who has access:** Anyone ← (Quan trọng! Phải chọn Anyone)
4. Nhấn **Deploy**
5. Google sẽ yêu cầu bạn cấp quyền — hãy **Authorize** (cho phép)
6. Sau khi deploy thành công, copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`)

## Bước 6 — Dán URL vào main.js
Mở file `src/main.js`, tìm dòng:
```javascript
const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
```
Thay bằng URL vừa copy ở Bước 5.

## Lưu ý
- Mỗi lần chỉnh sửa code Apps Script, bạn cần **Deploy mới** (New deployment) để cập nhật.
- Dữ liệu sẽ được ghi vào Sheet theo thứ tự: Thời gian | Họ tên | Quan hệ | Lời chúc.
