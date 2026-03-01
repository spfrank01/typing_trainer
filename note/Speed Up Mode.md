Speed Up Mode ต้องไม่ทำลายนิสัยที่สร้างไว้ใน Daily Routine
หลักคือ:

> เพิ่มความเร็ว แต่ไม่ลดมาตรฐานนิ้ว

---

# Speed Up Mode – Design Principles

1. ต้องผ่าน Daily Routine ก่อนถึง unlock
2. ยังบังคับนิ้วถูกต้อง
3. เริ่มจับเวลา
4. เพิ่มความต่อเนื่อง (flow)

---

# โครงสร้าง Speed Up Mode

## Phase 1 – Controlled Speed

* แสดงทั้งคำ ไม่ใช่ทีละตัว
* เริ่มจับเวลาเมื่อกดตัวแรก
* ห้ามหยุดเกิน 2 วินาที (pause penalty)
* กดผิด → ต้องแก้ก่อนถึงไปต่อ

เป้าหมาย:

* สร้าง rhythm
* ไม่รีบจนผิดนิ้ว

---

## Phase 2 – Flow Mode

* แสดงประโยคยาว
* ไม่ block ทันทีเมื่อผิด
* highlight ผิดแบบเบา ๆ
* แก้ตอนท้ายได้

Metrics:

* Gross WPM
* Net WPM
* Finger accuracy %
* Pause frequency

---

## Phase 3 – Target Speed Training

ผู้ใช้ตั้งเป้า เช่น:

* 30 WPM
* 40 WPM
* 50 WPM

ระบบ:

* แสดง pace bar
* ถ้าช้ากว่าเป้า → แถบแดง
* เร็วกว่า → แถบเขียว

---

# ความแตกต่างจาก Daily Mode

| Daily       | Speed Up            |
| ----------- | ------------------- |
| ช้า         | เร็ว                |
| ทีละตัว     | ทั้งคำ              |
| Block ทันที | บาง phase ไม่ block |
| ไม่โชว์ WPM | โชว์ WPM            |

---

# ต้องมี Guardrail

Speed Up จะเปิดได้เมื่อ:

* Finger accuracy > 95% ใน Daily
* ไม่มีนิ้วไหน error > 5%

ไม่งั้นจะ revert กลับไปนิ้วชี้อีก

---

# Algorithm สำหรับเพิ่มความเร็ว

เพิ่ม difficulty แบบนี้:

1. ลด pause allowance
2. เพิ่ม word length
3. เพิ่ม symbol
4. เพิ่ม bigram/trigram ที่พิมพ์ยาก เช่น:

   * th
   * ing
   * str
   * tion

---

# Session Structure (10 นาที)

1. Warm-up 1 นาที
2. Controlled speed 4 นาที
3. Flow mode 3 นาที
4. Target sprint 2 นาที

---

# สิ่งที่ไม่ควรทำ

* ไม่ควรให้แข่ง leaderboard ก่อนนิ้วแม่น
* ไม่ควรเปิด full random ตั้งแต่แรก
* ไม่ควรเน้น WPM มากกว่า finger accuracy

---

# เป้าหมายของ Speed Up Mode

ไม่ใช่ “เร็วที่สุด”

แต่คือ:

> เร็วโดยที่ร่างกายยังใช้ท่าถูกต้อง

---

ออกแบบ Speed Progression Model แบบเป็น step ladder (20 → 30 → 40 → 50 WPM) พร้อม logic unlock และ downgrade rule ได้ละเอียดเลย.
