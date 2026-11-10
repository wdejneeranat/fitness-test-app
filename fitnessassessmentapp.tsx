import React, { useState } from 'react';
import { Activity, User, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Dumbbell } from 'lucide-react';

type TestKey = 'functionalReach' | 'deadhang' | 'sitToStand' | 'verticalJump';
type Level = 'red' | 'yellow' | 'green';
type ScoreValue = number | '';
type Gender = 'ชาย' | 'หญิง';

const TESTS: {
  key: TestKey;
  title: string;
  description: string;
  quality: string;
  lowResult: string;
  goal: string;
  unit: string;
  image: string;
}[] = [
  {
    key: 'functionalReach',
    title: '1. Forward Reach Test',
    description: 'วัดระยะเอื้อมไปข้างหน้าเป็นเซนติเมตร โดยยืนมั่นคงและไม่ก้าวเท้า',
    quality: 'Mobility และการทรงตัวขณะเคลื่อนไหว',
    lowResult: 'อาจสะท้อนการเคลื่อนไหวของข้อเท้า สะโพก ทรวงอก หรือไหล่ รวมถึงการถ่ายน้ำหนักและการควบคุมลำตัว',
    goal: 'เคลื่อนไหวได้ดีขึ้นและควบคุมลำตัวระหว่างเอื้อม',
    unit: 'ซม.',
    image: './assets/functional-reach.jpg',
  },
  {
    key: 'deadhang',
    title: '2. Dead Hang',
    description: 'บันทึกเวลาที่ห้อยตัวจากบาร์ได้เป็นวินาที โดยหยุดเมื่อปล่อยมือหรือเริ่มมีอาการไม่ปลอดภัย',
    quality: 'ความสามารถของร่างกายส่วนบน',
    lowResult: 'อาจสะท้อนความทนทานของแรงจับ การควบคุมสะบัก ความพร้อมของไหล่ หรือความแข็งแรงเมื่อเทียบกับน้ำหนักตัว',
    goal: 'สร้างแรงดึง–ดัน–จับ และความมั่นคงของไหล่',
    unit: 'วินาที',
    image: './assets/dead-hang.jpg',
  },
  {
    key: 'sitToStand',
    title: '3. 30-Second Sit-to-Stand',
    description: 'นับจำนวนครั้งที่ลุกขึ้นยืนและนั่งลงได้ภายใน 30 วินาที',
    quality: 'ความแข็งแรงและความทนทานของร่างกายส่วนล่าง',
    lowResult: 'อาจสะท้อนความแข็งแรงของขาและสะโพก การควบคุมท่าสควอต หรือความทนทานในการทำงาน',
    goal: 'ลุก นั่ง ย่อ และออกแรงผ่านขาได้ดีขึ้น',
    unit: 'ครั้ง',
    image: './assets/sit-to-stand.jpg',
  },
  {
    key: 'verticalJump',
    title: '4. Vertical Jump',
    description: 'วัดความสูงที่กระโดดขึ้นในแนวดิ่งเป็นเซนติเมตร ทำเฉพาะเมื่อผ่านการคัดกรองความพร้อม',
    quality: 'พลังของร่างกายส่วนล่าง',
    lowResult: 'อาจสะท้อนอัตราการออกแรง การถ่ายแรงผ่านขาและลำตัว การลงพื้น หรือแรงเมื่อเทียบกับน้ำหนักตัว',
    goal: 'สร้างความแข็งแรงก่อน แล้วพัฒนาแรงเร็วและคุณภาพการลงพื้น',
    unit: 'ซม.',
    image: './assets/vertical-jump.jpg',
  },
];

const LEVEL_LABELS: Record<Level, string> = {
  red: 'แดง · ควรเริ่มเสริม',
  yellow: 'เหลือง · พอใช้ / พัฒนาได้',
  green: 'เขียว · ดี',
};

const LEVEL_STYLES: Record<Level, string> = {
  red: 'border-red-200 bg-red-50 text-red-800',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  green: 'border-green-200 bg-green-50 text-green-800',
};

function getLevel(key: TestKey, value: number, age: number, gender: Gender): Level | null {
  if (key === 'functionalReach') {
    if (age < 18) return null;
    const redLimit = age < 55 ? (gender === 'ชาย' ? 30 : 25) : (gender === 'ชาย' ? 25 : 20);
    const greenLimit = age < 55 ? (gender === 'ชาย' ? 40 : 35) : (gender === 'ชาย' ? 30 : 25);
    if (value < redLimit) return 'red';
    if (value <= greenLimit) return 'yellow';
    return 'green';
  }

  if (key === 'deadhang') {
    if (age < 18) return null;
    const decadesOver50 = Math.floor(Math.max(0, age - 50) / 10);
    const reduction = decadesOver50 * 10;
    const redLimit = (gender === 'ชาย' ? 30 : 20) - reduction;
    const greenLimit = (gender === 'ชาย' ? 60 : 40) - reduction;
    if (value < redLimit) return 'red';
    if (value <= greenLimit) return 'yellow';
    return 'green';
  }

  if (key === 'sitToStand') {
    if (age >= 18 && age <= 54) {
      const redLimit = gender === 'ชาย' ? 20 : 18;
      const yellowLimit = gender === 'ชาย' ? 29 : 25;
      const greenLimit = gender === 'ชาย' ? 30 : 25;
      if (value < redLimit) return 'red';
      if (value <= yellowLimit) return 'yellow';
      if (value > greenLimit) return 'green';
      return null;
    }
    if (age >= 60) {
      const redLimit = gender === 'ชาย' ? 14 : 12;
      const yellowLimit = gender === 'ชาย' ? 20 : 17;
      const greenLimit = gender === 'ชาย' ? 20 : 17;
      if (value < redLimit) return 'red';
      if (value <= yellowLimit) return 'yellow';
      if (value > greenLimit) return 'green';
    }
    return null;
  }

  if (age < 15) return null;
  if (age < 45) {
    if (gender === 'ชาย') {
      if (value <= 30) return 'red';
      if (value >= 50 && value <= 60) return 'yellow';
      if (value > 60) return 'green';
      return null;
    }
    if (value <= 25) return 'red';
    if (value >= 40 && value <= 50) return 'yellow';
    if (value > 50) return 'green';
    return null;
  }
  if (gender === 'ชาย') {
    if (value <= 17) return 'red';
    if (value >= 18 && value <= 35) return 'yellow';
    if (value > 35) return 'green';
    return null;
  }
  if (value <= 15) return 'red';
  if (value > 15 && value <= 20) return 'yellow';
  if (value > 25) return 'green';
  return null;
}

function getCriteria(key: TestKey, age: number, gender: Gender): string | null {
  if (key === 'functionalReach') {
    if (age < 18) return null;
    if (age < 55) {
      return gender === 'ชาย'
        ? 'ชาย 18–54 ปี: แดง <30 ซม. · เหลือง 30–40 ซม. · เขียว >40 ซม.'
        : 'หญิง 18–54 ปี: แดง <25 ซม. · เหลือง 25–35 ซม. · เขียว >35 ซม.';
    }
    return gender === 'ชาย'
      ? 'ชาย 55+ ปี: แดง <25 ซม. · เหลือง 25–30 ซม. · เขียว >30 ซม.'
      : 'หญิง 55+ ปี: แดง <20 ซม. · เหลือง 20–25 ซม. · เขียว >25 ซม.';
  }

  if (key === 'deadhang') {
    if (age < 18) return null;
    const decadesOver50 = Math.floor(Math.max(0, age - 50) / 10);
    const reduction = decadesOver50 * 10;
    const redLimit = (gender === 'ชาย' ? 30 : 20) - reduction;
    const greenLimit = (gender === 'ชาย' ? 60 : 40) - reduction;
    return `เกณฑ์ ${gender} อายุไม่เกิน 50 ปี และลดลง 10 วินาทีต่อทุก 10 ปีหลังอายุ 50: แดง <${redLimit} วินาที · เหลือง ${redLimit}–${greenLimit} วินาที · เขียว >${greenLimit} วินาที`;
  }

  if (key === 'sitToStand') {
    if (age >= 18 && age <= 54) {
      return gender === 'ชาย'
        ? 'ชาย 18–54 ปี: แดง <20 ครั้ง · เหลือง 20–29 ครั้ง · เขียว >30 ครั้ง'
        : 'หญิง 18–54 ปี: แดง <18 ครั้ง · เหลือง 18–25 ครั้ง · เขียว >25 ครั้ง';
    }
    if (age >= 60) {
      return gender === 'ชาย'
        ? 'ชาย 60+ ปี: แดง <14 ครั้ง · เหลือง 14–20 ครั้ง · เขียว >20 ครั้ง'
        : 'หญิง 60+ ปี: แดง <12 ครั้ง · เหลือง 12–17 ครั้ง · เขียว >17 ครั้ง';
    }
    return null;
  }

  if (age < 15) return null;
  if (age < 45) {
    return gender === 'ชาย'
      ? 'ชาย 15–45 ปี: แดง ≤30 ซม. · เหลือง 50–60 ซม. · เขียว >60 ซม.'
      : 'หญิง 15–45 ปี: แดง ≤25 ซม. · เหลือง 40–50 ซม. · เขียว >50 ซม.';
  }
  return gender === 'ชาย'
    ? 'ชาย 45+ ปี: แดง ≤17 ซม. · เหลือง 18–35 ซม. · เขียว >35 ซม.'
    : 'หญิง 45+ ปี: แดง ≤15 ซม. · เหลือง 15–20 ซม. · เขียว >25 ซม.';
}

function getActionPlan(levels: (Level | null)[]): string {
  const redCount = levels.filter((level) => level === 'red').length;
  const yellowCount = levels.filter((level) => level === 'yellow').length;
  const greenCount = levels.filter((level) => level === 'green').length;

  if (redCount >= 2) {
    return 'พบผลสีแดงตั้งแต่ 2 ฐานขึ้นไป: แนะนำให้พบนักกายภาพบำบัดเพื่อคัดกรองข้อจำกัดเพิ่มเติม เริ่มจาก Stretching/Mobility และฝึกพื้นฐานการเคลื่อนไหว เช่น Squat, Hip hinge, Push หรือ Pull จำนวน 1–2 ท่า';
  }
  if (redCount === 1) {
    return 'พบผลสีแดง 1 ฐาน: สร้างกิจวัตรการเคลื่อนไหวสัปดาห์ละ 2–3 ครั้ง แล้วค่อยเพิ่มแรงต้านด้วยเวทหรือยางยืด 1–2 ท่า โดยเริ่มที่ความหนักประมาณ RPE 4–5/10 ตั้งเป้าการออกกำลังกายระดับปานกลางรวม 150 นาทีต่อสัปดาห์ และฝึกแรงต้าน 2 วันต่อสัปดาห์';
  }
  if (yellowCount >= 2) {
    return 'พบผลสีเหลืองตั้งแต่ 2 ฐานขึ้นไป: ตรวจทักษะพื้นฐาน เช่น Squat, Hip hinge, Push และ Pull แล้วต่อยอดการฝึกแรงต้านเพื่อเพิ่มมวลกล้ามเนื้อ ความแข็งแรง และความทนทาน เรียนรู้การใช้ RPE และเลือกเครื่องฝึกหรือน้ำหนักอิสระให้เหมาะกับเป้าหมาย';
  }
  if (greenCount >= 2) {
    return 'พบผลสีเขียวตั้งแต่ 2 ฐานขึ้นไป: รักษาความต่อเนื่องและเพิ่มความท้าทายเพื่อพัฒนาสมรรถนะ อาจต่อยอดการฝึกแบบใช้ความเร็วหรือควบคุมจังหวะ การฝึกความคล่องตัวและพลัยโอเมตริกพื้นฐาน แล้วเชื่อมไปสู่กิจกรรมหรือกีฬาที่สนใจ';
  }
  return 'รักษาการเคลื่อนไหวและการออกกำลังกายให้สม่ำเสมอ เลือกฝึกส่วนที่ต้องการพัฒนา และเพิ่มระดับอย่างค่อยเป็นค่อยไป';
}

export default function App() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    gender: 'ชาย' as Gender,
    age: '',
    weight: '',
    height: '',
  });
  const [scores, setScores] = useState<Record<TestKey, ScoreValue>>({
    functionalReach: '',
    deadhang: '',
    sitToStand: '',
    verticalJump: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setProfile((previous) => ({ ...previous, name: value }));
        break;
      case 'email':
        setProfile((previous) => ({ ...previous, email: value }));
        break;
      case 'gender':
        setProfile((previous) => ({ ...previous, gender: value === 'หญิง' ? 'หญิง' : 'ชาย' }));
        break;
      case 'age':
        setProfile((previous) => ({ ...previous, age: value }));
        break;
      case 'weight':
        setProfile((previous) => ({ ...previous, weight: value }));
        break;
      case 'height':
        setProfile((previous) => ({ ...previous, height: value }));
        break;
    }
  };

  const nextToAssessment = () => {
    const age = Number(profile.age);
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim());
    if (!profile.name.trim() || !validEmail || !Number.isInteger(age) || age < 1 || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(height) || height <= 0) {
      setErrorMsg('กรุณากรอกชื่อ อีเมล อายุ น้ำหนัก และส่วนสูงให้ถูกต้อง');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const finishAssessment = () => {
    if (TESTS.some((test) => scores[test.key] === '' || !Number.isFinite(scores[test.key]) || scores[test.key] < 0)) {
      setErrorMsg('กรุณากรอกผลการทดสอบให้ครบทั้ง 4 ฐาน');
      return;
    }
    setErrorMsg('');
    setStep(3);
    window.scrollTo(0, 0);
  };

  const calculateBMI = () => {
    const weight = Number(profile.weight);
    const height = Number(profile.height) / 100;
    return height > 0 ? (weight / (height * height)).toFixed(1) : '—';
  };

  const age = Number(profile.age);
  const results = TESTS.map((test) => ({
    ...test,
    value: scores[test.key] === '' ? 0 : scores[test.key],
    criteria: getCriteria(test.key, age, profile.gender),
    level: getLevel(test.key, scores[test.key] === '' ? 0 : scores[test.key], age, profile.gender),
  }));
  const actionPlan = getActionPlan(results.map((result) => result.level));
  const emailBody = [
    `ผลการประเมินสมรรถภาพอย่างง่ายของ ${profile.name}`,
    `อายุ ${profile.age} ปี · เพศ${profile.gender} · BMI ${calculateBMI()}`,
    '',
    ...results.map((result) => `${result.title}: ${result.value} ${result.unit} — ${result.level ? LEVEL_LABELS[result.level] : 'ไม่มีเกณฑ์แปลผลที่ระบุสำหรับค่านี้ในชีต'}`),
    '',
    `แนวทางการแปลผล: ${actionPlan}`,
    '',
    'หมายเหตุ: เป็นค่าที่สำหรับการทดสอบอย่างง่ายเท่านั้น ไม่ใช่ค่าในการวินิจฉัย',
  ].join('\n');

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 pb-10">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card { break-inside: avoid; box-shadow: none !important; }
          main { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      <header className="no-print sticky top-0 z-10 bg-blue-800 p-4 text-white shadow-md">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
          <Activity size={24} />
          <h1 className="text-xl font-bold">ประเมินสมรรถภาพอย่างง่าย</h1>
        </div>
      </header>

      <main className="mx-auto mt-3 max-w-2xl p-4">
        <div className="no-print mb-6 flex items-center justify-between px-3">
          {[1, 2, 3].map((number) => (
            <div key={number} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${step >= number ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {number}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="no-print mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 && (
          <section className="print-card rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-blue-800">
              <User size={21} />
              <h2 className="text-xl font-bold">ข้อมูลผู้เข้ารับการทดสอบ</h2>
            </div>
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
              เป็นค่าที่สำหรับการทดสอบอย่างง่ายเท่านั้น ไม่ใช่ค่าในการวินิจฉัย
            </p>

            <div className="space-y-4">
              <label className="block text-sm font-medium">
                ชื่อ-นามสกุล
                <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="กรอกชื่อ-นามสกุล" />
              </label>
              <label className="block text-sm font-medium">
                อีเมลผู้เข้ารับการทดสอบ
                <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="name@example.com" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium">
                  เพศ
                  <select name="gender" value={profile.gender} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  อายุ (ปี)
                  <input type="number" min="1" step="1" name="age" value={profile.age} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="เช่น 25" />
                </label>
                <label className="block text-sm font-medium">
                  น้ำหนัก (กก.)
                  <input type="number" min="1" step="0.1" name="weight" value={profile.weight} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="เช่น 65" />
                </label>
                <label className="block text-sm font-medium">
                  ส่วนสูง (ซม.)
                  <input type="number" min="1" step="0.1" name="height" value={profile.height} onChange={handleProfileChange} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="เช่น 170" />
                </label>
              </div>
              <button onClick={nextToAssessment} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-800">
                เริ่มประเมิน <ChevronRight size={20} />
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="no-print mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">ผลการทดสอบ</h2>
              <button onClick={() => { setStep(1); setErrorMsg(''); }} className="flex items-center text-sm text-slate-600 hover:text-blue-800">
                <ChevronLeft size={17} /> กลับ
              </button>
            </div>
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
              ผลเป็นค่าจากการทดสอบอย่างง่ายเท่านั้น ไม่ใช่ค่าในการวินิจฉัย หากรู้สึกเจ็บ เวียนศีรษะ หรือไม่ปลอดภัย ให้หยุดทดสอบ ภาพประกอบใช้แสดงท่าทางเท่านั้น การแปลผลยึดเกณฑ์ตามอายุและเพศที่ระบุในฟอร์ม
            </p>
            {age >= 45 && (
              <p className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm leading-relaxed text-orange-900">
                ชีตระบุช่วงอายุ Vertical Jump 15–45 ปีและ 45+ ปีซ้อนกัน จึงใช้เกณฑ์ 45+ ตั้งแต่อายุ 45 ปี สำหรับผู้สูงอายุ ชีตแนะนำให้พิจารณา Sit-to-Stand Power หรือ Step-up test แทนการใช้การกระโดดเป็นฐานหลัก และทดสอบ Vertical Jump เฉพาะผู้ที่ผ่านการคัดกรองความพร้อม
              </p>
            )}

            <div className="space-y-5">
              {TESTS.map((test) => {
                const criteria = getCriteria(test.key, age, profile.gender);
                return (
                  <article key={test.key} className="print-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img src={test.image} alt={`ภาพประกอบ ${test.title}`} className="h-56 w-full bg-blue-900 object-contain sm:h-72" />
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900">{test.title}</h3>
                      <p className="mb-4 mt-1 text-sm leading-relaxed text-slate-600">{test.description}</p>
                      <label className="block text-sm font-semibold">
                        ผลที่วัดได้ ({test.unit})
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={scores[test.key]}
                          onChange={(event) => {
                            const value = event.target.value;
                            setScores((previous) => ({ ...previous, [test.key]: value === '' ? '' : Number(value) }));
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          placeholder={`กรอกค่า ${test.unit}`}
                        />
                      </label>
                      <p className="mt-3 text-xs leading-relaxed text-slate-500">
                        {criteria ?? (test.key === 'sitToStand' && age >= 55 && age < 60
                          ? 'ชีตไม่มีค่า Cut-off สำหรับอายุ 55–59 ปี'
                          : 'ชีตไม่มีค่า Cut-off สำหรับกลุ่มอายุนี้')}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            <button onClick={finishAssessment} className="no-print mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-4 font-bold text-white shadow-sm transition hover:bg-blue-800">
              ดูผลการประเมิน <CheckCircle size={20} />
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="print-card mb-5 rounded-2xl border border-sky-100 bg-white p-5 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800">ผลการประเมิน</h2>
              <p className="mt-1 font-medium">{profile.name}</p>
              <p className="text-sm text-slate-600">{profile.email}</p>
              <p className="mt-2 text-sm text-slate-600">อายุ {profile.age} ปี · เพศ{profile.gender} · BMI {calculateBMI()}</p>
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                เป็นค่าที่สำหรับการทดสอบอย่างง่ายเท่านั้น ไม่ใช่ค่าในการวินิจฉัย
              </p>
            </div>

            <div className="space-y-4">
              {results.map((result) => (
                <article key={result.key} className="print-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img src={result.image} alt={`ภาพประกอบ ${result.title}`} className="h-48 w-full bg-blue-900 object-contain" />
                  <div className="p-5">
                    <h3 className="font-bold">{result.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">ค่าที่วัดได้: <strong>{result.value} {result.unit}</strong></p>
                    {result.level ? (
                      <p className={`mt-3 rounded-lg border p-2 text-sm font-semibold ${LEVEL_STYLES[result.level]}`}>{LEVEL_LABELS[result.level]}</p>
                    ) : (
                      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
                        ไม่มีเกณฑ์แปลผลที่ระบุสำหรับค่านี้ในชีต
                      </p>
                    )}
                    <p className="mt-3 text-sm"><strong>สมรรถภาพหลัก:</strong> {result.quality}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600"><strong>ผลต่ำอาจสะท้อน:</strong> {result.lowResult}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600"><strong>เป้าหมายการฝึก:</strong> {result.goal}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{result.criteria ?? 'ไม่มีค่า Cut-off ที่ระบุสำหรับกลุ่มอายุนี้'}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="print-card mt-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-blue-800">
                <Dumbbell size={21} />
                <h3 className="text-lg font-bold">แนวทางการแปลผลและการฝึก</h3>
              </div>
              <p className="leading-relaxed text-slate-700">{actionPlan}</p>
            </div>

            <div className="no-print mt-5 space-y-3">
              <button
                onClick={() => {
                  window.print();
                  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('ผลการประเมินสมรรถภาพอย่างง่าย')}&body=${encodeURIComponent(emailBody)}`;
                }}
                className="w-full rounded-xl bg-blue-700 px-4 py-4 font-bold text-white shadow-sm transition hover:bg-blue-800"
              >
                พิมพ์ผลประเมินและส่ง email ไปยัง email ผู้เข้ารับการทดสอบ
              </button>
              <p className="text-center text-xs leading-relaxed text-slate-500">
                ระบบจะเปิดหน้าพิมพ์และโปรแกรมอีเมลที่ตั้งค่าไว้ พร้อมกรอกผลให้ ผู้ใช้ต้องยืนยันการพิมพ์และกดส่งอีเมลในโปรแกรมนั้น
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setScores({ functionalReach: '', deadhang: '', sitToStand: '', verticalJump: '' });
                  setErrorMsg('');
                  window.scrollTo(0, 0);
                }}
                className="w-full rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                ประเมินใหม่อีกครั้ง
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
