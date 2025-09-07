"use client"

import { Separator } from "@/components/ui/separator"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChefHat,
  Calendar,
  Package,
  Utensils,
  Truck,
  MapPin,
  User,
  Cookie,
  Beef,
  Zap,
  Check,
  Plus,
  Coffee,
  Salad,
  Pizza,
  Sandwich,
  Target,
  Heart,
  Flame,
  X,
  MessageCircle,
} from "lucide-react"

interface Meal {
  name: string
  category: string
  ingredients: string
  calories: number
  carbs: number
  protein: number
  fat: number
  fiber: number
  image: string
}

interface CustomerData {
  name: string
  package: string
  includeSnacks: boolean
  snackCount: number
  proteinWeight: number
  carbWeight: number
  deliveryMethod: string
}

interface MealSelection {
  meal: string
  carb: string
  notes: string
}

interface WeeklyMeals {
  [day: string]: {
    meals: MealSelection[]
    snacks: MealSelection[]
  }
}

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]

const CARB_OPTIONS = [
  "أرز أبيض",
  "أرز أسمر",
  "أرز برياني",
  "بطاطا ودجز",
  "بطاطا حلوة",
  "بطاطا مهروسة",
  "بطاطا مشوية بالفرن",
  "خضار",
  "بروكلي",
  "إيدامامي",
  "سبانخ",
]

const DAILY_SNACKS = {
  السبت: [
    "سلطة بروكلي",
    "تبولة",
    "شوكليت مافن",
    "تشيز كيك فراولة",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
  الأحد: [
    "سلطة القرع المشوي",
    "سلطة فراولة",
    "سلطة جرجير",
    "فانيلا مافن",
    "كوكيز الشوفان",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
  الاثنين: [
    "سلطة بي فيت",
    "سلطة يونانية",
    "سلطة البطيخ",
    "كاسترد فواكه",
    "مانجو مافن",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
  الثلاثاء: [
    "سلطة البقوليات",
    "سلطة بروكلي",
    "تبولة",
    "فانيلا مافن",
    "تشيز كيك فراولة",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
  الأربعاء: [
    "سلطة بي فيت",
    "سلطة فراولة",
    "سلطة يونانية",
    "سلطة جرجير",
    "كاسترد فواكه",
    "شوكليت مافن",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
  الخميس: [
    "سلطة البقوليات",
    "سلطة البطيخ مع الفيتا",
    "سلطة القرع المشوي",
    "كوكيز الشوفان",
    "مانجو مافن",
    "كرات بروتين VIP",
    "تشيز كيك مانجو VIP",
    "تشيز كيك بلو بيري VIP",
    "تشيز كيك روز بيري VIP",
    "وافل بروتين VIP",
  ],
}

export default function MealPlanningSystem() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    package: "",
    includeSnacks: false,
    snackCount: 1,
    proteinWeight: 100,
    carbWeight: 100,
    deliveryMethod: "",
  })
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>({})
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedMealType, setSelectedMealType] = useState<"meals" | "snacks">("meals")
  const [selectedMealIndex, setSelectedMealIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [mealDialogOpen, setMealDialogOpen] = useState(false)

  // Fetch meals data from CSV
  useEffect(() => {
    const realMealsData: Meal[] = [
      // الفطور (Breakfast)
      {
        name: "فليكس فيول صحن",
        category: "الفطور",
        ingredients: "بياض البيض , صوص , نقانق لايت , جبن شيدر قليلة الدسم",
        calories: 381,
        carbs: 47,
        protein: 31,
        fat: 8,
        fiber: 6,
        image: "https://i.postimg.cc/TwmDNZ1J/flex-fuel-2.jpg",
      },
      {
        name: "ذا ويسترن صحن",
        category: "الفطور",
        ingredients: "بياض البيض , بطاطا ويسترن , جبن شيدر قليل الدسم , صوص",
        calories: 163,
        carbs: 16,
        protein: 17,
        fat: 3,
        fiber: 1,
        image: "https://i.postimg.cc/prsXsZfB/the-westren.jpg",
      },
      {
        name: "ذا ويسترن راب",
        category: "الفطور",
        ingredients: "بياض البيض , بطاطا ويسترن , جبن شيدر قليل الدسم , صوص , راب هالبينو",
        calories: 163,
        carbs: 16,
        protein: 17,
        fat: 3,
        fiber: 1,
        image: "https://i.postimg.cc/6qpB4vk4/the-westren-w.jpg",
      },
      {
        name: "ذا فيلي صحن",
        category: "الفطور",
        ingredients: "بياض البيض , شريحة لحم , بصل , فلفل اخضر , جبنة موزاريلا قليلة الدسم",
        calories: 240,
        carbs: 21,
        protein: 27,
        fat: 5,
        fiber: 3,
        image: "https://i.postimg.cc/gJNWp0xz/the-phely.jpg",
      },
      {
        name: "ذا فيلي راب",
        category: "الفطور",
        ingredients: "بياض البيض , شريحة لحم , بصل , فلفل اخضر , جبنة موزاريلا قليلة الدسم , راب القمح الكامل",
        calories: 240,
        carbs: 21,
        protein: 27,
        fat: 5,
        fiber: 3,
        image: "https://i.postimg.cc/FHjwmK6M/the-philly.jpg",
      },
      {
        name: "ذا جاردن صحن",
        category: "الفطور",
        ingredients: "بياض البيض , خضروات , فطر , طماطم , فلفل , بصل , جبنة شيدر قليلة الدسم , صوص",
        calories: 137,
        carbs: 20,
        protein: 13,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/GpMRw28c/the-garden.jpg",
      },
      {
        name: "ذا جاردن راب",
        category: "الفطور",
        ingredients: "بياض البيض , خضروات , فطر , طماطم , فلفل , بصل , جبنة شيدر قليلة الدسم , صوص",
        calories: 137,
        carbs: 20,
        protein: 13,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/52xD4JMj/the-garden-W.jpg",
      },
      {
        name: "حلوم ساندوتش",
        category: "الفطور",
        ingredients: "جبن حلوم قليل الدسم , طماطم , زيتون مع خبز باجيت من القمح الكامل",
        calories: 223,
        carbs: 20,
        protein: 13,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/3NF9VyN1/Hallomi.jpg",
      },
      {
        name: "حلوم زعتر",
        category: "الفطور",
        ingredients: "جبن حلوم قليل الدسم , زعتر , زيتون اسود , طماطم , عجينة سمراء",
        calories: 363,
        carbs: 43,
        protein: 25,
        fat: 10,
        fiber: 5,
        image: "https://i.postimg.cc/j2cQvG3k/hallomi-pizza.jpg",
      },
      {
        name: "حلوم راب",
        category: "الفطور",
        ingredients: "جبنة حلوم , طماطم , زعتر , زيتون",
        calories: 236,
        carbs: 25,
        protein: 6,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/3NF9VyN1/Hallomi.jpg",
      },
      {
        name: "كلوب ساندوتش",
        category: "الفطور",
        ingredients: "بياض البيض , جبن شيدر قليل الدسم , خس, طماطم , مايونيز",
        calories: 230,
        carbs: 22,
        protein: 14,
        fat: 9,
        fiber: 6,
        image: "https://i.postimg.cc/qRdsrk95/clube-sandwech.jpg",
      },
      {
        name: "بيض شكشوكة",
        category: "الفطور",
        ingredients: "بيض مطبوخ , صلصة طماطم , بصل وثوم",
        calories: 387,
        carbs: 41,
        protein: 28,
        fat: 12,
        fiber: 6,
        image: "https://i.postimg.cc/Y2PSLXSp/shkshoka-pizza.jpg",
      },
      {
        name: "بيض سبانخ",
        category: "الفطور",
        ingredients: "صلصة السيزر , سبانخ وبيض مطبوخين , ثوم , سماق , عجينة سمراء",
        calories: 300,
        carbs: 41,
        protein: 21,
        fat: 5,
        fiber: 4,
        image: "https://i.postimg.cc/W4pDwdcj/spinach-egg-pizza.jpg",
      },
      {
        name: "شوفان",
        category: "الفطور",
        ingredients: "شوفان , حليب خالي الدسم , موز , فراولة , عسل",
        calories: 304,
        carbs: 15,
        protein: 16,
        fat: 1,
        fiber: 1,
        image: "https://i.postimg.cc/KYYzgCt8/oatmeal.jpg",
      },
      {
        name: "شوفان مع بروتين",
        category: "الفطور",
        ingredients: "شوفان , حليب خالي الدسم , فراولة , موز , سكوب بروتين ايسكريم فانيلا",
        calories: 304,
        carbs: 15,
        protein: 16,
        fat: 3,
        fiber: 1,
        image: "https://i.postimg.cc/KYYzgCt8/oatmeal.jpg",
      },
      {
        name: "بي جي جي شوفان",
        category: "الفطور",
        ingredients: "شوفان , زبدة الفول السوداني , شراب توت , حليب خالي الدسم , عسل , موز",
        calories: 304,
        carbs: 15,
        protein: 16,
        fat: 4,
        fiber: 1,
        image: "https://i.postimg.cc/gjKFs2WF/ppj-oat-mael.jpg",
      },

      // السلطات (Salads)
      {
        name: "لين اند مين تشيز برجر",
        category: "السلطات",
        ingredients: "لحم بقر مشوي, موزاريلا , طماطم , بصل اخضر , صوص باربكيو",
        calories: 207,
        carbs: 8,
        protein: 23,
        fat: 9,
        fiber: 5,
        image: "https://i.postimg.cc/0QGbjjkL/lean-mean-burger.jpg",
      },
      {
        name: "سلطة سمسم الزنجبيل",
        category: "السلطات",
        ingredients:
          "دجاج , طماطم , خيار , بصل احمر , بذور السمسم , افوكادو , صوص سمسم وزنجبيل , خس روماني , ملفوف احمر",
        calories: 283,
        carbs: 23,
        protein: 21,
        fat: 11,
        fiber: 8,
        image: "https://i.postimg.cc/0QCyx4Zv/asian-sesame-gengar.jpg",
      },
      {
        name: "سلطة دجاج سيزر",
        category: "السلطات",
        ingredients: "دجاج , جبنة بارميزان , صوص سيزر , خس روماني , ملفوف احمر",
        calories: 157,
        carbs: 5,
        protein: 21,
        fat: 5,
        fiber: 1,
        image: "https://i.postimg.cc/DyNy2LQS/chicken-caser-salad.jpg",
      },
      {
        name: "سلطة كينوا",
        category: "السلطات",
        ingredients: "دجاج , كينوا , فلفل احمر مشوي , افوكادو , صلصة سمسم زنجبيل , خس روماني , ملفوف احمر",
        calories: 247,
        carbs: 19,
        protein: 21,
        fat: 9,
        fiber: 3,
        image: "https://i.postimg.cc/qq50vH3P/qenua-salad.jpg",
      },
      {
        name: "سلطة ايطاليانو",
        category: "السلطات",
        ingredients: "دجاج , موزاريلا , سبانخ , فلفل احمر مشوي , صلصة بالسميك , خس روماني",
        calories: 173,
        carbs: 8,
        protein: 23,
        fat: 5,
        fiber: 7,
        image: "https://i.postimg.cc/fWrhXZVF/itlaliano-salad.jpg",
      },
      {
        name: "سلطة ماردي جراس",
        category: "السلطات",
        ingredients: "دجاج مشوي , طماطم , بصل , صوص كاجون , خس روماني , ملفوف احمر",
        calories: 180,
        carbs: 8,
        protein: 25,
        fat: 7,
        fiber: 3,
        image: "https://i.postimg.cc/mrwvrGxm/mardi-gras.jpg",
      },

      // الاطباق الرئيسية (Main Dishes)
      {
        name: "برياني روبيان",
        category: "الاطباق الرئيسية",
        ingredients: "خلطة البرياني محضرة مع الأرز والروبيان والزبدة والبصل والكزبرة والنعناع على طريقتنا بطعم لذيذ",
        calories: 303,
        carbs: 31,
        protein: 31,
        fat: 7,
        fiber: 5,
        image: "https://i.postimg.cc/jqZy43TB/Whats-App-Image-2025-09-07-at-15-17-58-13d21c8e.jpg",
      },
      {
        name: "برياني لحم",
        category: "الاطباق الرئيسية",
        ingredients: "أرز البرياني المميز بالبهارات الخاصة مع اللحم",
        calories: 323,
        carbs: 31,
        protein: 32,
        fat: 9,
        fiber: 5,
        image: "https://i.postimg.cc/SNnY7yDz/b.jpg",
      },
      {
        name: "برياني دجاج",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج مع أرز برياني",
        calories: 310,
        carbs: 32,
        protein: 32,
        fat: 7,
        fiber: 6,
        image: "https://i.postimg.cc/Pxd8mYRt/chicken-butter-2-Copy.jpg",
      },
      {
        name: "كباب لحم صحن",
        category: "الاطباق الرئيسية",
        ingredients: "لحم البقر المفروم , تتبيلتنا الخاصة , صوص البوجرت الخاص بنا",
        calories: 319,
        carbs: 29,
        protein: 27,
        fat: 11,
        fiber: 5,
        image: "https://i.postimg.cc/Xqpq88c0/beef-kabab.jpg",
      },
      {
        name: "جود فاذر",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , مشروم بورتابيلا , فلفل احمر مشوي , موزاريلا , خل خال من الغلوتين والدهون , بروكلي",
        calories: 240,
        carbs: 12,
        protein: 36,
        fat: 5,
        fiber: 7,
        image: "https://i.postimg.cc/1z38Xsnt/god-father.jpg",
      },
      {
        name: "جريلد تشيكن انتري",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , بروكلي , أرز بني",
        calories: 260,
        carbs: 25,
        protein: 31,
        fat: 4,
        fiber: 3,
        image: "https://i.postimg.cc/nz7pcPkr/chicken-antree.jpg",
      },
      {
        name: "جريلد سالمون انتري",
        category: "الاطباق الرئيسية",
        ingredients: "سمك السلمون , بروكلي , أرز بني",
        calories: 347,
        carbs: 25,
        protein: 27,
        fat: 15,
        fiber: 3,
        image: "https://i.postimg.cc/J75C6JYf/salmon-antree.jpg",
      },
      {
        name: "سالمون الصلصة البيضاء",
        category: "الاطباق الرئيسية",
        ingredients: "سلمون مشوي وصوص ابيض يقدم مع أرز",
        calories: 367,
        carbs: 28,
        protein: 29,
        fat: 16,
        fiber: 4,
        image: "https://i.postimg.cc/2y2JzQP3/salmon-whaite-sauce.jpg",
      },
      {
        name: "كباب دجاج صحن",
        category: "الاطباق الرئيسية",
        ingredients: "كباب دجاج , تتبيلتنا الخاصة , صوص البوجرت الخاص بنا",
        calories: 317,
        carbs: 29,
        protein: 30,
        fat: 9,
        fiber: 5,
        image: "https://i.postimg.cc/s27NBdtk/chicken-kabab.jpg",
      },
      {
        name: "تيرياكي ستير فراي",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , مشروم بورتابيلا , بصل , فلفل , جزر , بذور السمسم , صوص ترياكي , أرز بني",
        calories: 327,
        carbs: 31,
        protein: 26,
        fat: 11,
        fiber: 7,
        image: "https://i.postimg.cc/wBXwq5NH/tryaki-star-fry.jpg",
      },
      {
        name: "دجاج بصلصة الليمون",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج مشوي , وصوص أبيض خاص يقدم مع أرز",
        calories: 333,
        carbs: 33,
        protein: 33,
        fat: 8,
        fiber: 4,
        image: "https://i.postimg.cc/zXypbYhx/chicken-lemon.jpg",
      },
      {
        name: "سانتا أنا",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , جبنة شيدر قليلة الدسم , صوص , فاصوليا حمراء , أرز بني",
        calories: 340,
        carbs: 30,
        protein: 34,
        fat: 9,
        fiber: 6,
        image: "https://i.postimg.cc/zBdSvxGm/santa-ana.jpg",
      },
      {
        name: "اريزونا",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , طماطم , بصل اخضر , صوص , أرز بني",
        calories: 300,
        carbs: 27,
        protein: 32,
        fat: 7,
        fiber: 7,
        image: "https://i.postimg.cc/K8nPBG8D/arizona.jpg",
      },
      {
        name: "المكسيكان",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج , بصل , فلفل , جبنة شيدر قليلة الدسم , صوص , فاصوليا , أرز بني",
        calories: 307,
        carbs: 29,
        protein: 35,
        fat: 5,
        fiber: 5,
        image: "https://i.postimg.cc/cCgYHZzY/elmxicana.jpg",
      },
      {
        name: "دجاج بصلصة الزبدة",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج ماسلا مع أرز",
        calories: 327,
        carbs: 28,
        protein: 31,
        fat: 9,
        fiber: 7,
        image: "https://i.postimg.cc/Pxd8mYRt/chicken-butter-2-Copy.jpg",
      },
      {
        name: "دجاج مقرمش",
        category: "الاطباق الرئيسية",
        ingredients: "قطع الدجاج مقرمشة خالية من العظم",
        calories: 247,
        carbs: 13,
        protein: 33,
        fat: 7,
        fiber: 4,
        image: "https://i.postimg.cc/fLFt1pbb/ARF-9702.jpg",
      },
      {
        name: "دجاج مقرمش مع مكرونة",
        category: "الاطباق الرئيسية",
        ingredients: "دجاج كرسبي مع باستا بالطماطم",
        calories: 311,
        carbs: 28,
        protein: 33,
        fat: 7,
        fiber: 4,
        image: "https://i.postimg.cc/j59ZqRc0/crispy-chicken-pasta.jpg",
      },
      {
        name: "كبسة دجاج (متوفرة يوم الاحد فقط)",
        category: "الاطباق الرئيسية",
        ingredients: "كبسة الدجاج مطبوخة بخلطتنا الخاصة",
        calories: 310,
        carbs: 32,
        protein: 33,
        fat: 7,
        fiber: 6,
        image: "https://i.postimg.cc/1tZ3kFxL/ck-main.jpg",
      },
      {
        name: "بايتس باربكيو",
        category: "الاطباق الرئيسية",
        ingredients: "قطع صدور الدجاج بالبقسماط ,ودقيق القمح مخبوزة بالفرن ومطبوخة مع صلصة الباربكيو",
        calories: 253,
        carbs: 10,
        protein: 27,
        fat: 9,
        fiber: 3,
        image: "https://i.postimg.cc/ZntsFTdP/boneless-chicken-bbq.jpg",
      },
      {
        name: "بايتس بافلو",
        category: "الاطباق الرئيسية",
        ingredients: "قطع صدور الدجاج بالبقسماط ,ودقيق القمح مخبوزة بالفرن ومطبوخة مع صلصة البافلو",
        calories: 253,
        carbs: 10,
        protein: 27,
        fat: 9,
        fiber: 3,
        image: "https://i.postimg.cc/h4T547k2/boneless-chicken-bufflo.jpg",
      },
      {
        name: "بايتس تيرياكي",
        category: "الاطباق الرئيسية",
        ingredients: "قطع صدور الدجاج بالبقسماط ,ودقيق القمح مخبوزة بالفرن ومطبوخة مع صلصة الترياكي",
        calories: 253,
        carbs: 10,
        protein: 27,
        fat: 9,
        fiber: 3,
        image: "https://i.postimg.cc/9XdLHH9S/boneless-chicken-tryaki.jpg",
      },

      // البرجر الصحي (Healthy Burgers)
      {
        name: "برجر بريميم",
        category: "البرجر الصحي",
        ingredients:
          "خبز القمح الكامل , برجر لحم , جبنة شيدر قليلة الدسم , خس روماني , طماطم , بصل احمر , الصوص الخاص بنا",
        calories: 307,
        carbs: 21,
        protein: 27,
        fat: 7,
        fiber: 4,
        image: "https://i.postimg.cc/L6vvhkN3/prremium-burgr.jpg",
      },
      {
        name: "برجر خضروات",
        category: "البرجر الصحي",
        ingredients:
          "خلطتنا الخاصة مع الخضروات الطازجة , توابل , خس , طماطم , بصل , الصوص الخاص بنا , خبز القمح الكامل",
        calories: 200,
        carbs: 23,
        protein: 15,
        fat: 5,
        fiber: 3,
        image: "https://i.postimg.cc/GmwYL41x/vigi-burgr.jpg",
      },
      {
        name: "برجر هالبينو",
        category: "البرجر الصحي",
        ingredients:
          "شرائح هالبينو , خس , طماطم , بصل , جبنة موزاريلا منزوعة الدسم , مخلل , خلصطة كاجون , مايونيز قليل الدسم , خبز القمح الكامل",
        calories: 313,
        carbs: 23,
        protein: 28,
        fat: 12,
        fiber: 3,
        image: "https://i.postimg.cc/hPFbjyLm/jalapino-burger.jpg",
      },
      {
        name: "برجر ميني",
        category: "البرجر الصحي",
        ingredients: "شرايح برجر صغيرة , بخبز الميني برجر",
        calories: 367,
        carbs: 32,
        protein: 29,
        fat: 13,
        fiber: 7,
        image: "https://i.postimg.cc/J7jKbC4x/beef-slider-burger-Copy.jpg",
      },
      {
        name: "برجر مشروم سوبريم",
        category: "البرجر الصحي",
        ingredients: "مشروم وبصل سوتية , خس , جبنة موزاريلا منزوعة الدسم , مخلل , خبز القمح الكامل",
        calories: 347,
        carbs: 21,
        protein: 29,
        fat: 13,
        fiber: 5,
        image: "https://i.postimg.cc/L88TKqkQ/mushroom-burger.jpg",
      },
      {
        name: "برجر كاليفورنيا كلوب",
        category: "البرجر الصحي",
        ingredients: "افوكادو , خس , طماطم , بصل , مخلل , مايونيز قليل الدسم , خبز القمح الكامل",
        calories: 347,
        carbs: 24,
        protein: 27,
        fat: 15,
        fiber: 4,
        image: "https://i.postimg.cc/FK2gLDMw/claifornia-burger.jpg",
      },
      {
        name: "برجر دجاج",
        category: "البرجر الصحي",
        ingredients: "خبز القمح الكامل , دجاج , جبنة شيدر قليلة الدسم , خس روماني , طماطم , بصل احمر , الصوص الخاص بنا",
        calories: 287,
        carbs: 21,
        protein: 25,
        fat: 11,
        fiber: 5,
        image: "https://i.postimg.cc/Vs9BJ9DH/chicken-sandwech.jpg",
      },
      {
        name: "برجر ريكفري",
        category: "البرجر الصحي",
        ingredients: "بيض مقلي , جبنة شيدر منزوع الدسم , مخلل , خبز القمح الكامل",
        calories: 320,
        carbs: 21,
        protein: 29,
        fat: 15,
        fiber: 5,
        image: "https://i.postimg.cc/7hqz3cmt/recovry-burger.jpg",
      },

      // الراب الصحي (Healthy Wraps)
      {
        name: "كينوا راب",
        category: "الراب الصحي",
        ingredients: "دجاج , كينوا بيضاء , خس , سبانخ , فلفل أحمر مشوي , افوكادو ,زنجبيل",
        calories: 477,
        carbs: 51,
        protein: 27,
        fat: 18,
        fiber: 5,
        image: "https://i.postimg.cc/zB8v6hKV/all-break-fast-wrap.jpg",
      },
      {
        name: "الراب الخاص بنا",
        category: "الراب الصحي",
        ingredients:
          "تورتيلا الشيدر مع قطع الدجاج خلطة الطاقة بالخس والسبانخ , طماطم , بصل , جبنة شيدر قليلة الدسم , صلصة مصل ميكر",
        calories: 407,
        carbs: 45,
        protein: 37,
        fat: 14,
        fiber: 7,
        image: "https://i.postimg.cc/rpLwR4hQ/tex-mix-fajita.jpg",
      },
      {
        name: "اكس اكس ال راب",
        category: "الراب الصحي",
        ingredients: "تورتيلا القمح , دجاج , جبنة الشيدر قليلة الدسم والكريمة الخالية من الدسم مع صوص الباربكيو",
        calories: 413,
        carbs: 42,
        protein: 26,
        fat: 15,
        fiber: 5,
        image: "https://i.postimg.cc/q7XMs7S0/xxl-wrap.jpg",
      },
      {
        name: "يي ها راب",
        category: "الراب الصحي",
        ingredients: "تورتيلا الهالبينو مع قطع الدجاج والبطاطس الحارة , صلصة مصل ميكر",
        calories: 413,
        carbs: 42,
        protein: 26,
        fat: 15,
        fiber: 5,
        image: "https://i.postimg.cc/fLzWBNQd/yee-ha-wrap.jpg",
      },
      {
        name: "كباب لحم راب",
        category: "الراب الصحي",
        ingredients: "اللحمم المفروم الخالي من الدهون , طماطم , بصل , خس , صلصة الطحينة",
        calories: 420,
        carbs: 44,
        protein: 37,
        fat: 10,
        fiber: 3,
        image: "https://i.postimg.cc/LsHMM3QK/beef-kabbab-wrap.jpg",
      },
      {
        name: "كباب دجاج راب",
        category: "الراب الصحي",
        ingredients: "صدور دجاج , طماطم , بصل , خس , طحينة",
        calories: 400,
        carbs: 45,
        protein: 37,
        fat: 8,
        fiber: 7,
        image: "https://i.postimg.cc/4djfZhh6/chicken-kabab-wrap.jpg",
      },
      {
        name: "في جي راب",
        category: "الراب الصحي",
        ingredients: "راب فيجي بشكل اساسي من الخضار الشهية",
        calories: 280,
        carbs: 44,
        protein: 13,
        fat: 5,
        fiber: 7,
        image: "https://i.postimg.cc/XYnVVWXz/vigi-wrap.jpg",
      },
      {
        name: "تشيكن سيزر راب",
        category: "الراب الصحي",
        ingredients: "دجاج , خس روماني , سبانخ , كرنب , صلصة سيزر , جبنة بارميزان",
        calories: 457,
        carbs: 37,
        protein: 29,
        fat: 21,
        fiber: 2,
        image: "https://i.postimg.cc/XYnVVWXz/vigi-wrap.jpg",
      },
      {
        name: "سانتا في راب",
        category: "الراب الصحي",
        ingredients:
          "تورتيلا الشيدر مع قطع الدجاج , ارز اسمر مع فاصوليا الحمراء , جبنة شيدر قليلة الدسم , صلصة مصل ميكر",
        calories: 467,
        carbs: 51,
        protein: 33,
        fat: 15,
        fiber: 6,
        image: "/placeholder.svg?height=200&width=300&text=سانتا+في+راب",
      },
      {
        name: "روكي راب",
        category: "الراب الصحي",
        ingredients:
          "تورتيلا الثوم مع قطع الدجاج وكفتة الخاصة بنا وجبنة الموزريلا قليلة الدسم مع صلصة المارينارا خالية الدسم",
        calories: 431,
        carbs: 37,
        protein: 37,
        fat: 12,
        fiber: 3,
        image: "https://i.postimg.cc/YqbPWBbV/rocky-wrap.jpg",
      },
      {
        name: "تكس مكس فاهيتا راب",
        category: "الراب الصحي",
        ingredients: "تورتيلا الشيدر مع قطع الدجاج وخلطة البصل , فلفل اخضر , وشيدر قليلة الدسم كريمة خالية الدسم",
        calories: 413,
        carbs: 42,
        protein: 26,
        fat: 15,
        fiber: 5,
        image: "https://i.postimg.cc/rpLwR4hQ/tex-mix-fajita.jpg",
      },
      {
        name: "تشكن باربكيو راب",
        category: "الراب الصحي",
        ingredients: "تورتيلا القمح , صدر الدجاج المشوي , الرز البني , جبنة شيدر قليلة الدسم وصلصة الباربكيو",
        calories: 493,
        carbs: 46,
        protein: 45,
        fat: 14,
        fiber: 5,
        image: "https://i.postimg.cc/q7XMs7S0/xxl-wrap.jpg",
      },

      // اطباق البروتين (Protein Dishes)
      {
        name: "دجاج مشوي",
        category: "اطباق البروتين",
        ingredients: "صدور دجاج المتبلة والمشوية",
        calories: 136,
        carbs: 0,
        protein: 28,
        fat: 3,
        fiber: 0,
        image: "https://i.postimg.cc/YSmDZGMK/grilled-chicken.jpg",
      },
      {
        name: "ستيك لحم",
        category: "اطباق البروتين",
        ingredients: "ستيك لحم متبل ومحضر بالبهارات الخاصة",
        calories: 137,
        carbs: 0,
        protein: 22,
        fat: 56,
        fiber: 0,
        image: "https://i.postimg.cc/jqhgpr05/steak.jpg",
      },
      {
        name: "روبيان مشوي",
        category: "اطباق البروتين",
        ingredients: "روبيان متبل ومحضر بالبهارات الخاصة",
        calories: 100,
        carbs: 0,
        protein: 23,
        fat: 8,
        fiber: 0,
        image: "https://i.postimg.cc/DwRBrvsC/shrimp.jpg",
      },

      // الباستا (Pasta)
      {
        name: "سباجيتي بولونيز",
        category: "الباستا",
        ingredients: "لحم مفروم , صلصة البولونيز الخاصة بنا , جبنة بارميزان قليلة الدسم مع مكرونة اسباجيتي",
        calories: 333,
        carbs: 27,
        protein: 33,
        fat: 11,
        fiber: 9,
        image: "/placeholder.svg?height=200&width=300&text=سباجيتي+بولونيز",
      },
      {
        name: "بيستو دجاج",
        category: "الباستا",
        ingredients: "صلصة البيستو الخاصة بنا مكرونة القمح الكامل , جبن البارميزان",
        calories: 324,
        carbs: 25,
        protein: 35,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/cCJRq2wg/pesto-basta.jpg",
      },
      {
        name: "بيستو سباجيتي",
        category: "الباستا",
        ingredients: "قطع الدجاج , صلصة البيستو الخاصة بنا , مكرونة اسباجيتي , جبنة بارميزان",
        calories: 314,
        carbs: 25,
        protein: 37,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/RZtczc6R/73.jpg",
      },
      {
        name: "مكرونة البحر المتوسط",
        category: "الباستا",
        ingredients: "قطع الدجاج مع مكرونة بيني وصلصة البحر المتوسط الخاصة وقليل من جبنة البارميزان قليلة الدسم",
        calories: 327,
        carbs: 26,
        protein: 35,
        fat: 7,
        fiber: 4,
        image: "https://i.postimg.cc/MT3cBTfH/0-W3-A0013-copy.jpg",
      },
      {
        name: "كاجون بيني تشيكن",
        category: "الباستا",
        ingredients: "قطع الدجاج مع المكرونة بيني وصلصة الترياكي , طماطم وبصل اخضر مع قليل من بهارات الكاجون",
        calories: 390,
        carbs: 27,
        protein: 35,
        fat: 12,
        fiber: 3,
        image: "https://i.postimg.cc/Nj854b2W/cajun-pasta.jpg",
      },
      {
        name: "بيني مع دجاج",
        category: "الباستا",
        ingredients: "قطع الدجاج مع المكرونة بيني وصلصة مارينارا الخاصة والكريمة الخالية من الدسم مع جبنة البارميزان",
        calories: 317,
        carbs: 37,
        protein: 27,
        fat: 7,
        fiber: 4,
        image: "https://i.postimg.cc/mDkkTsps/penne-pasta.jpg",
      },
      {
        name: "مكرونة الدجاج بالصوص الابيض",
        category: "الباستا",
        ingredients: "صلصتنا البيضاء قليلة الدسم , مشروب , بروكلي , دجاج , جبنة البارميزان قليلة الدسم",
        calories: 367,
        carbs: 30,
        protein: 37,
        fat: 11,
        fiber: 9,
        image: "https://i.postimg.cc/ZRQRRMXy/whaite-pasta.jpg",
      },
      {
        name: "لازانيا(متوفرة يوم الخميس فقط)",
        category: "الباستا",
        ingredients: "لحم مفروم , صلصة الخاصة بنا , جبنة بارميزان قليلة الدسم مع وشرائح لازانيا",
        calories: 333,
        carbs: 27,
        protein: 33,
        fat: 11,
        fiber: 9,
        image: "https://i.postimg.cc/nrQLQ1tS/Las.jpg",
      },

      // البيتزا الصحية (Healthy Pizza)
      {
        name: "بيتزا مصل ميكر",
        category: "البيتزا الصحية",
        ingredients:
          "عجينة دقيق القمح الكامل , صلصة الطماطم الحمراء مع جبن الموزاريلا قليل الدسم وريحان وجبن الموزاريلا",
        calories: 360,
        carbs: 45,
        protein: 17,
        fat: 3,
        fiber: 1,
        image: "https://i.postimg.cc/WpDmnLNC/marghreta-pizza.jpg",
      },
      {
        name: "بيتزا بيبروني",
        category: "البيتزا الصحية",
        ingredients: "عجينة القمح الكامل , صلصة الطماطم , جبن الموزريلا قليل الدسم , بيبروني",
        calories: 383,
        carbs: 52,
        protein: 25,
        fat: 11,
        fiber: 6,
        image: "https://i.postimg.cc/tCWhK3Vz/peproni-pizza.jpg",
      },
      {
        name: "بيتزا خضروات",
        category: "البيتزا الصحية",
        ingredients: "عجينة دقيق القمح الكامل صلصة المشروم , مشروم , فلفل اخضر , بصل",
        calories: 287,
        carbs: 44,
        protein: 17,
        fat: 5,
        fiber: 4,
        image: "https://i.postimg.cc/6pKdt8rx/vigi-pizza.jpg",
      },
      {
        name: "بيتزا فليكس فيول",
        category: "البيتزا الصحية",
        ingredients: "عجينة دقيق القمح الكامل , بياض البيض , نقانق لايت , بطاطا حلوة , وصوص , جبن شيدر قليل الدسم",
        calories: 381,
        carbs: 47,
        protein: 31,
        fat: 8,
        fiber: 6,
        image: "https://i.postimg.cc/MHRQ8wXG/flex-fuel-pizza.jpg",
      },
      {
        name: "بيتزا دجاج باربكيو",
        category: "البيتزا الصحية",
        ingredients: "عجينة دقيق القمح الكامل , دجاج , صلصة باربكيو , جبنة شيدر قليلة الدسم , بصل",
        calories: 440,
        carbs: 47,
        protein: 33,
        fat: 12,
        fiber: 8,
        image: "https://i.postimg.cc/Kv0ZvVLc/bbq-pizza.jpg",
      },
      {
        name: "بيتزا بافلو دجاج",
        category: "البيتزا الصحية",
        ingredients: "عجينة دقيق القمح الكامل , صلصة البافلو",
        calories: 453,
        carbs: 51,
        protein: 35,
        fat: 12,
        fiber: 0,
        image: "https://i.postimg.cc/K8VxtMJd/bufflo-pizza-2.jpg",
      },
      {
        name: "بيتزا كلاسيك وايت",
        category: "البيتزا الصحية",
        ingredients: "عجينة دقيق القمح الكامل , صلصة السيزر , موزاريلا قليلة الدسم , بارميزان , ثوم",
        calories: 327,
        carbs: 44,
        protein: 20,
        fat: 9,
        fiber: 4,
        image: "https://i.postimg.cc/MTJwF8k5/clasic-whait-pizza.jpg",
      },
      {
        name: "بيتزا ذا ووركس",
        category: "البيتزا الصحية",
        ingredients:
          "عجينة دقيق القمح الكامل , كرات اللحم , موزاريلا قليلة الدسم , بصل , فلفل اخضر , مشروم , صلصة المارينارا",
        calories: 407,
        carbs: 45,
        protein: 29,
        fat: 12,
        fiber: 6,
        image: "https://i.postimg.cc/nLBb7wsD/the-works.jpg",
      },

      // السناك (Snacks) - keeping the existing snacks
      {
        name: "مكسرات مشكلة",
        category: "السناك",
        ingredients: "لوز , جوز , كاجو , فستق",
        image: "/placeholder.svg?height=200&width=300&text=مكسرات+مشكلة",
      },
      {
        name: "تفاح مع زبدة اللوز",
        category: "السناك",
        ingredients: "تفاح طازج , زبدة اللوز الطبيعية",
        image: "/placeholder.svg?height=200&width=300&text=تفاح+مع+زبدة+اللوز",
      },
      {
        name: "زبادي يوناني مع التوت",
        category: "السناك",
        ingredients: "زبادي يوناني قليل الدسم , توت أزرق , عسل طبيعي",
        image: "/placeholder.svg?height=200&width=300&text=زبادي+يوناني+مع+التوت",
      },
      {
        name: "حمص مع خضروات",
        category: "السناك",
        ingredients: "حمص طبيعي , جزر , خيار , فلفل ملون",
        image: "/placeholder.svg?height=200&width=300&text=حمص+مع+خضروات",
      },
      {
        name: "بروتين بار",
        category: "السناك",
        ingredients: "بروتين مصل اللبن , شوفان , عسل , مكسرات",
        image: "/placeholder.svg?height=200&width=300&text=بروتين+بار",
      },
      {
        name: "سموثي أخضر",
        category: "السناك",
        ingredients: "سبانخ , موز , تفاح أخضر , زنجبيل , ماء جوز الهند",
        image: "/placeholder.svg?height=200&width=300&text=سموثي+أخضر",
      },
    ]

    console.log("[v0] Loading complete meals dataset:", realMealsData.length, "meals")
    setMeals(realMealsData)

    // Extract unique categories from real data
    const uniqueCategories = Array.from(new Set(realMealsData.map((meal) => meal.category)))
    console.log("[v0] Categories from real data:", uniqueCategories)
    setCategories(uniqueCategories)
  }, [])

  // Initialize weekly meals structure
  useEffect(() => {
    if (customerData.package) {
      const mealCount = Number.parseInt(customerData.package)
      const initialWeeklyMeals: WeeklyMeals = {}

      DAYS.forEach((day) => {
        initialWeeklyMeals[day] = {
          meals: Array.from({ length: mealCount }, () => ({ meal: "", carb: "", notes: "" })),
          snacks: customerData.includeSnacks
            ? Array.from({ length: customerData.snackCount }, () => ({ meal: "", carb: "", notes: "" }))
            : [],
        }
      })

      setWeeklyMeals(initialWeeklyMeals)
    }
  }, [customerData.package, customerData.includeSnacks, customerData.snackCount])

  const calculateAdjustedNutrition = (meal: Meal) => {
    const proteinRatio = customerData.proteinWeight / 100
    const carbRatio = customerData.carbWeight / 100

    return {
      calories: Math.round(meal.calories * ((proteinRatio + carbRatio) / 2)),
      carbs: Math.round(meal.carbs * carbRatio),
      protein: Math.round(meal.protein * proteinRatio),
      fat: Math.round(meal.fat * ((proteinRatio + carbRatio) / 2)),
      fiber: Math.round(meal.fiber * ((proteinRatio + carbRatio) / 2)),
    }
  }

  const handleMealSelection = (mealName: string) => {
    if (selectedDay && selectedMealType !== null && selectedMealIndex !== null) {
      setWeeklyMeals((prev) => {
        const updated = { ...prev }
        if (selectedMealType === "meals") {
          updated[selectedDay].meals[selectedMealIndex] = {
            ...updated[selectedDay].meals[selectedMealIndex],
            meal: mealName,
          }
        } else {
          updated[selectedDay].snacks[selectedMealIndex] = {
            ...updated[selectedDay].snacks[selectedMealIndex],
            meal: mealName,
          }
        }
        return updated
      })
      setMealDialogOpen(false)
    }
  }

  const openMealDialog = (day: string, type: "meals" | "snacks", index: number) => {
    setSelectedDay(day)
    setSelectedMealType(type)
    setSelectedMealIndex(index)
    setSelectedCategory("all")
    setMealDialogOpen(true)
  }

  const handleCarbSelection = (day: string, type: "meals" | "snacks", index: number, carb: string) => {
    setWeeklyMeals((prev) => {
      const updated = { ...prev }
      if (type === "meals") {
        updated[day].meals[index] = {
          ...updated[day].meals[index],
          carb: carb,
        }
      } else {
        updated[day].snacks[index] = {
          ...updated[day].snacks[index],
          carb: carb,
        }
      }
      return updated
    })
  }

  const handleNotesChange = (day: string, type: "meals" | "snacks", index: number, notes: string) => {
    setWeeklyMeals((prev) => {
      const updated = { ...prev }
      if (type === "meals") {
        updated[day].meals[index] = {
          ...updated[day].meals[index],
          notes: notes,
        }
      } else {
        updated[day].snacks[index] = {
          ...updated[day].snacks[index],
          notes: notes,
        }
      }
      return updated
    })
  }

  const sendToWhatsApp = () => {
    let message = `🍽️ *طلب وجبات جديد*\n\n`
    message += `👤 *اسم العميل:* ${customerData.name}\n`
    message += `📦 *الباقة:* ${customerData.package} وجبات\n`
    message += `🍪 *السناك:* ${customerData.includeSnacks ? `نعم (${customerData.snackCount})` : "لا"}\n`
    message += `🥩 *وزن البروتين:* ${customerData.proteinWeight}جم\n`
    message += `🌾 *وزن الكارب:* ${customerData.carbWeight}جم\n`
    message += `🚚 *نوع الاستلام:* ${customerData.deliveryMethod === "pickup" ? "استلام من الفرع" : "توصيل"}\n\n`

    DAYS.forEach((day) => {
      if (weeklyMeals[day]) {
        message += `📅 *${day}:*\n`

        // Meals
        weeklyMeals[day].meals.forEach((mealSelection, index) => {
          if (mealSelection.meal) {
            message += `   🍽️ وجبة ${index + 1}: ${mealSelection.meal}\n`
            if (mealSelection.carb) message += `      🌾 الكارب: ${mealSelection.carb}\n`
            if (mealSelection.notes) message += `      📝 ملاحظات: ${mealSelection.notes}\n`
          }
        })

        // Snacks
        if (customerData.includeSnacks) {
          weeklyMeals[day].snacks.forEach((snackSelection, index) => {
            if (snackSelection.meal) {
              message += `   🍪 سناك ${index + 1}: ${snackSelection.meal}\n`
              if (snackSelection.notes) message += `      📝 ملاحظات: ${snackSelection.notes}\n`
            }
          })
        }
        message += `\n`
      }
    })

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/966508821819?text=${encodedMessage}`, "_blank")
  }

  const getAvailableOptions = () => {
    if (selectedMealType === "snacks" && selectedDay && DAILY_SNACKS[selectedDay as keyof typeof DAILY_SNACKS]) {
      return DAILY_SNACKS[selectedDay as keyof typeof DAILY_SNACKS].map((snack) => ({
        name: snack,
        category: "السناك",
        ingredients: "سناك صحي ولذيذ",
        calories: 150,
        carbs: 15,
        protein: 5,
        fat: 8,
        fiber: 3,
        image: "/placeholder.svg",
      }))
    }
    return selectedCategory === "all" ? meals : meals.filter((meal) => meal.category === selectedCategory)
  }

  const filteredOptions = getAvailableOptions()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "الفطور":
        return <Coffee className="h-4 w-4" />
      case "السلطات":
        return <Salad className="h-4 w-4" />
      case "الاطباق الرئيسية":
        return <Utensils className="h-4 w-4" />
      case "البرجر الصحي":
        return <Sandwich className="h-4 w-4" />
      case "الراب الصحي":
        return <Sandwich className="h-4 w-4" />
      case "اطباق البروتين":
        return <Beef className="h-4 w-4" />
      case "الباستا":
        return <Utensils className="h-4 w-4" />
      case "البيتزا الصحية":
        return <Pizza className="h-4 w-4" />
      case "السناك":
        return <Cookie className="h-4 w-4" />
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  const openSnackDialog = (day: string, index: number) => {
    setSelectedDay(day)
    setSelectedMealType("snacks")
    setSelectedMealIndex(index)
    setSelectedCategory("all")
    setMealDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary rounded-full shadow-lg">
              <ChefHat className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary text-balance">اختيار الوجبات الاسبوعية</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            خطط وجباتك الصحية بسهولة مع نظام متقدم يوفر لك خيارات متنوعة ومتوازنة غذائياً
          </p>
        </div>

        {/* Customer Information */}
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Package className="h-6 w-6" />
              البيانات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="customerName"
                  className="flex items-center gap-2 text-card-foreground font-semibold text-base"
                >
                  <User className="h-5 w-5 text-primary" />
                  اسم العميل
                </Label>
                <Input
                  id="customerName"
                  value={customerData.name}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم العميل"
                  className="border-border focus:border-primary focus:ring-primary h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-card-foreground font-semibold text-base">
                  <Package className="h-5 w-5 text-primary" />
                  اختيار الباقة
                </Label>
                <Select
                  value={customerData.package}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, package: value }))}
                >
                  <SelectTrigger className="border-border focus:border-primary h-12 text-base">
                    <SelectValue placeholder="اختر عدد الوجبات" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        وجبة واحدة
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        وجبتان
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        ثلاث وجبات
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        أربع وجبات
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-card-foreground font-semibold text-base">
                  <Cookie className="h-5 w-5 text-secondary" />
                  هل يتضمن سناك؟
                </Label>
                <RadioGroup
                  value={customerData.includeSnacks.toString()}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, includeSnacks: value === "true" }))}
                  className="flex gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="snacks-yes" className="border-primary text-primary w-5 h-5" />
                    <Label htmlFor="snacks-yes" className="flex items-center gap-2 text-primary font-medium text-base">
                      <Check className="h-4 w-4 text-primary" />
                      نعم
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="false"
                      id="snacks-no"
                      className="border-destructive text-destructive w-5 h-5"
                    />
                    <Label
                      htmlFor="snacks-no"
                      className="flex items-center gap-2 text-destructive font-medium text-base"
                    >
                      <X className="h-4 w-4 text-destructive" />
                      لا
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {customerData.includeSnacks && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-card-foreground font-semibold text-base">
                    <Cookie className="h-5 w-5 text-secondary" />
                    عدد السناك
                  </Label>
                  <Select
                    value={customerData.snackCount.toString()}
                    onValueChange={(value) =>
                      setCustomerData((prev) => ({ ...prev, snackCount: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="w-48 border-border focus:border-primary h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="1">
                        <div className="flex items-center gap-2">
                          <Cookie className="h-4 w-4 text-secondary" />
                          سناك واحد
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center gap-2">
                          <Cookie className="h-4 w-4 text-secondary" />2 سناك
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="proteinWeight"
                  className="flex items-center gap-2 text-card-foreground font-semibold text-base"
                >
                  <Beef className="h-5 w-5 text-destructive" />
                  وزن البروتين (جرام)
                </Label>
                <Select
                  value={customerData.proteinWeight.toString()}
                  onValueChange={(value) =>
                    setCustomerData((prev) => ({ ...prev, proteinWeight: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger className="border-border focus:border-primary h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="100">100 جرام</SelectItem>
                    <SelectItem value="150">150 جرام</SelectItem>
                    <SelectItem value="200">200 جرام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="carbWeight"
                  className="flex items-center gap-2 text-card-foreground font-semibold text-base"
                >
                  <Zap className="h-5 w-5 text-secondary" />
                  وزن الكارب (جرام)
                </Label>
                <Input
                  id="carbWeight"
                  type="number"
                  value={customerData.carbWeight}
                  onChange={(e) =>
                    setCustomerData((prev) => ({ ...prev, carbWeight: Number.parseInt(e.target.value) || 100 }))
                  }
                  placeholder="أدخل وزن الكارب"
                  className="border-border focus:border-primary focus:ring-primary h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-card-foreground font-semibold text-base">
                <Truck className="h-5 w-5 text-primary" />
                نوع الاستلام
              </Label>
              <RadioGroup
                value={customerData.deliveryMethod}
                onValueChange={(value) => setCustomerData((prev) => ({ ...prev, deliveryMethod: value }))}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" className="border-primary text-primary w-5 h-5" />
                  <Label htmlFor="pickup" className="flex items-center gap-2 text-primary font-medium text-base">
                    <MapPin className="h-4 w-4 text-primary" />
                    استلام من الفرع
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" className="border-primary text-primary w-5 h-5" />
                  <Label htmlFor="delivery" className="flex items-center gap-2 text-primary font-medium text-base">
                    <Truck className="h-4 w-4 text-primary" />
                    توصيل
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Meal Planning */}
        {customerData.package && (
          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="h-6 w-6" />
                جدول الوجبات الاسبوعي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6">
                {DAYS.map((day) => (
                  <div key={day} className="border border-border rounded-xl p-6 space-y-4 bg-muted/30">
                    <h3 className="font-bold text-xl text-primary flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      {day}
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Utensils className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-lg text-primary">الوجبات:</span>
                      </div>
                      <div className="space-y-4">
                        {weeklyMeals[day]?.meals.map((mealSelection, index) => (
                          <div
                            key={index}
                            className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="flex-1 justify-start bg-background border-border hover:bg-muted h-12 text-base"
                                onClick={() => openMealDialog(day, "meals", index)}
                              >
                                {mealSelection.meal ? (
                                  <Check className="h-5 w-5 text-primary ml-2" />
                                ) : (
                                  <Plus className="h-5 w-5 text-primary ml-2" />
                                )}
                                <span className="text-card-foreground font-medium">
                                  {mealSelection.meal || `وجبة ${index + 1}`}
                                </span>
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Select
                                value={mealSelection.carb}
                                onValueChange={(value) => handleCarbSelection(day, "meals", index, value)}
                              >
                                <SelectTrigger className="border-border h-11 text-base">
                                  <SelectValue placeholder="اختر نوع الكارب" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  {CARB_OPTIONS.map((carb) => (
                                    <SelectItem key={carb} value={carb}>
                                      {carb}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Input
                                placeholder="ملاحظات خاصة بالوجبة"
                                value={mealSelection.notes}
                                onChange={(e) => handleNotesChange(day, "meals", index, e.target.value)}
                                className="border-border focus:border-primary focus:ring-primary h-11 text-base"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {customerData.includeSnacks && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Cookie className="h-5 w-5 text-secondary" />
                            <span className="font-semibold text-lg text-secondary">السناك:</span>
                          </div>
                          <div className="space-y-4">
                            {weeklyMeals[day]?.snacks.map((snackSelection, index) => (
                              <div
                                key={index}
                                className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1 justify-start bg-background border-border hover:bg-muted h-12 text-base"
                                    onClick={() => openSnackDialog(day, index)}
                                  >
                                    {snackSelection.meal ? (
                                      <Check className="h-5 w-5 text-secondary ml-2" />
                                    ) : (
                                      <Plus className="h-5 w-5 text-secondary ml-2" />
                                    )}
                                    <span className="text-card-foreground font-medium">
                                      {snackSelection.meal || `سناك ${index + 1}`}
                                    </span>
                                  </Button>
                                </div>

                                <Input
                                  placeholder="ملاحظات خاصة بالسناك"
                                  value={snackSelection.notes}
                                  onChange={(e) => handleNotesChange(day, "snacks", index, e.target.value)}
                                  className="border-border focus:border-primary focus:ring-primary h-11 text-base"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Send Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={sendToWhatsApp}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <MessageCircle className="h-6 w-6 ml-2" />
                  إرسال الطلب عبر واتساب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meal Selection Dialog */}
        <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary text-right">اختيار الوجبة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-card-foreground">تصفية حسب الفئة:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64 border-border h-11 text-base">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-right">
                        <div className="flex items-center gap-2 flex-row-reverse">
                          <span>جميع الفئات</span>
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-right">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <span>{category}</span>
                            <div className="text-primary">{getCategoryIcon(category)}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOptions.map((option, index) => {
                    const adjustedNutrition = calculateAdjustedNutrition(option)
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-background border-border hover:border-primary hover:bg-muted/30 group"
                        onClick={() => handleMealSelection(option.name)}
                      >
                        <CardContent className="p-5">
                          <div className="space-y-4">
                            <img
                              src={option.image || "/placeholder.svg"}
                              alt={option.name}
                              className="w-full h-36 object-cover rounded-lg border border-border group-hover:border-primary transition-colors duration-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(option.name)}`
                              }}
                            />
                            <div>
                              <h4 className="font-bold text-lg text-primary group-hover:text-primary/80 transition-colors duration-200">
                                {option.name}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="mt-2 flex items-center gap-1 w-fit bg-muted text-card-foreground border-border"
                              >
                                {getCategoryIcon(option.category)}
                                {option.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{option.ingredients}</p>
                            <Separator className="bg-border" />
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-card-foreground">
                                <Flame className="h-4 w-4 text-destructive" />
                                <span className="font-medium">السعرات: {adjustedNutrition.calories}</span>
                              </div>
                              <div className="flex items-center gap-2 text-card-foreground">
                                <Beef className="h-4 w-4 text-destructive" />
                                <span className="font-medium">البروتين: {adjustedNutrition.protein}جم</span>
                              </div>
                              <div className="flex items-center gap-2 text-card-foreground">
                                <Zap className="h-4 w-4 text-secondary" />
                                <span className="font-medium">الكارب: {adjustedNutrition.carbs}جم</span>
                              </div>
                              <div className="flex items-center gap-2 text-card-foreground">
                                <Heart className="h-4 w-4 text-chart-1" />
                                <span className="font-medium">الدهون: {adjustedNutrition.fat}جم</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
