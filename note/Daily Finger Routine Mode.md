เข้าใจเป้าหมาย:
ไม่ใช่ “เรียนจบเป็นด่าน” แต่เป็น **ฝึกซ้ำทุกวันเหมือนออกกำลังกายท่าเดิม** เพื่อให้ร่างกายจำอัตโนมัติ

ต่อไปนี้คือโครงแบบ **Daily Finger Routine Mode**

---

# Daily Finger Routine (Core Mode)

## หลักการ

* ฝึกชุดเดิมทุกวัน
* ลำดับเหมือนเดิม
* ไม่สุ่มมาก
* เน้น repetition
* ใช้เวลา 10–15 นาที

---

# โครงสร้าง 1 Session (ประมาณ 12 นาที)

## 1️⃣ Warm-up (Home Row) – 2 นาที

```text
asdf jkl;
sdfj ;lkj
fjfj djdj
```

เป้าหมาย:

* ตั้งตำแหน่งมือ
* เริ่ม activate นิ้วกลาง/นิ้วนาง

---

## 2️⃣ Top Row Drill – 2 นาที

```text
qwer uiop
qq ww ee rr
```

Pattern ซ้ำ ๆ
ไม่เน้นความเร็ว

---

## 3️⃣ Bottom Row Drill – 2 นาที

```text
zxcv nm
zx zx zx
cv cv cv
```

นิ้วนาง + ก้อย จะได้ทำงาน

---

## 4️⃣ Full Alphabet Flow – 2 นาที

```text
the quick brown fox jumps
```

หรือ fixed sentence เดิมทุกวัน

---

## 5️⃣ Numbers + Shift – 2 นาที

```text
12345 67890
!@#$% ^&*()
```

ฝึกนิ้วก้อยจริงจัง

---

## 6️⃣ Focus Weak Finger – 2–3 นาที

ระบบดูว่า:

* นิ้วไหน error เยอะสุดเมื่อวาน
* เพิ่ม drill ของนิ้วนั้น

ตัวอย่าง:
ถ้า Right Pinky อ่อน

```text
; ; ; ; ;
- = - =
```

---

# กฎของ Daily Mode

* ไม่มี WPM โชว์ระหว่างฝึก
* ต้องกดถูกก่อนถึงไปต่อ
* ไม่มี skip
* เวลา session คงที่ทุกวัน

---

# ทำไมต้อง “เหมือนเดิม”

Muscle memory ต้องการ:

* repetition
* pattern stability
* minimal randomness

ถ้าเปลี่ยน pattern ทุกวัน → สมองจำ logic
ถ้า pattern เหมือนเดิม → ร่างกายจำตำแหน่ง

---

# โครงสร้าง Requirement แบบสั้น

## Functional

1. Daily routine sequence คงที่
2. Session length 10–15 นาที
3. Progress save per day
4. Weak finger reinforcement จาก session ก่อนหน้า
5. Block เมื่อกดผิด

---

## UI

* Progress bar
* Current drill label (Warm-up / Numbers / etc.)
* Hand diagram highlight
* Minimal stats

---

# เพิ่ม Motivation แบบไม่กดดัน

* “Day streak”
* “Consistency score”
* ไม่ต้อง ranking

---

# สรุปแนวคิดหลัก

ไม่ต้องมี 7 level
ไม่ต้อง gamify เยอะ
ทำให้เหมือน:

> ท่า push-up เดิมทุกวัน
> จนร่างกายจำเอง

---

ออกแบบ “Daily Routine Engine Logic” ด้วย (state machine + drill scheduler + repetition algorithm).
