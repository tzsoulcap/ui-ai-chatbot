# Knowledge Management Page

หน้า Knowledge Management สำหรับจัดการ Knowledge ใน RAG (Retrieval-Augmented Generation) โดยเฉพาะสำหรับ Notion

## คุณสมบัติ

### 1. เพิ่ม Knowledge
- เพิ่ม Knowledge ใหม่โดยใส่ Notion page ID
- ตรวจสอบความถูกต้องของ Notion page ID format
- ใส่ชื่อและคำอธิบาย (optional)
- แสดงสถานะการประมวลผล

### 2. แสดง Knowledge
- แสดงรายการ Knowledge ทั้งหมด
- แสดงสถานะ (Active, Processing, Inactive)
- แสดงจำนวนเอกสารและคำ
- แสดงวันที่สร้างและอัปเดตล่าสุด
- ค้นหา Knowledge ตามชื่อ, page ID, หรือคำอธิบาย

### 3. ลบ Knowledge
- ลบ Knowledge ที่มีอยู่
- ยืนยันการลบก่อนดำเนินการ

### 4. คุณสมบัติเพิ่มเติม
- Refresh ข้อมูล
- เปิดดู Notion page ในแท็บใหม่
- แสดงสถานะการประมวลผลแบบ real-time
- Responsive design สำหรับมือถือและเดสก์ท็อป

## การใช้งาน

### การเข้าถึง
```
/knowledge-management
```

### การเพิ่ม Knowledge
1. ใส่ Notion page ID ในช่อง "Notion Page ID"
2. ใส่ชื่อในช่อง "Title"
3. ใส่คำอธิบาย (optional) ในช่อง "Description"
4. กดปุ่ม "Add Knowledge"

### การค้นหา
- ใช้ช่องค้นหาด้านบนเพื่อค้นหา Knowledge ตามชื่อ, page ID, หรือคำอธิบาย

### การลบ Knowledge
1. กดปุ่ม "Delete" ที่ Knowledge ที่ต้องการลบ
2. ยืนยันการลบใน dialog ที่ปรากฏ

## API Endpoints

### GET /api/knowledge
ดึงรายการ Knowledge ทั้งหมด

### POST /api/knowledge
เพิ่ม Knowledge ใหม่
```json
{
  "pageId": "notion-page-id",
  "title": "Knowledge Title",
  "description": "Optional description",
  "status": "processing"
}
```

### DELETE /api/knowledge/:id
ลบ Knowledge ตาม ID

## โครงสร้างข้อมูล

```typescript
interface KnowledgeItem {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'processing';
  createdAt: Date;
  updatedAt: Date;
  documentCount?: number;
  wordCount?: number;
}
```

## การตรวจสอบ Notion Page ID

ระบบจะตรวจสอบ format ของ Notion page ID โดยใช้ regex pattern:
```
/^[a-zA-Z0-9-]{20,}$/
```

## สถานะ Knowledge

- **Active**: Knowledge พร้อมใช้งาน
- **Processing**: กำลังประมวลผลข้อมูล
- **Inactive**: ไม่พร้อมใช้งาน

## การพัฒนา

### การเพิ่ม API จริง
แทนที่ฟังก์ชันใน `src/utils/knowledgeApi.ts` ด้วยการเรียก API จริง

### การปรับแต่ง UI
แก้ไขไฟล์ `src/pages/KnowledgeManagement.tsx` เพื่อปรับแต่ง UI ตามต้องการ

### การเพิ่มฟีเจอร์ใหม่
สามารถเพิ่มฟีเจอร์ใหม่เช่น:
- การแก้ไข Knowledge
- การ export/import ข้อมูล
- การจัดการ tags หรือ categories
- การตั้งค่าการ sync กับ Notion 