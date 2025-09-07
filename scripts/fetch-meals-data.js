// Script to fetch and process the CSV meal data
const csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ca2-EfeQlnoCtIIGHwuiWmyic2NuNhUuDy.csv"

async function fetchMealsData() {
  try {
    console.log("[v0] Fetching meals data from CSV...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("[v0] Raw CSV data (first 500 chars):")
    console.log(csvText.substring(0, 500))

    // Parse CSV
    const lines = csvText.split("\n")
    console.log("[v0] Total lines in CSV:", lines.length)

    const headers = lines[0].split(",")
    console.log("[v0] Headers:", headers)

    const meals = []
    const categories = new Set()

    for (let i = 1; i < lines.length && i <= 10; i++) {
      // Show first 10 meals
      const values = lines[i].split(",")
      if (values.length >= 9) {
        const meal = {
          name: values[0]?.trim(),
          category: values[1]?.trim(),
          ingredients: values[2]?.trim(),
          calories: Number.parseFloat(values[3]) || 0,
          carbs: Number.parseFloat(values[4]) || 0,
          protein: Number.parseFloat(values[5]) || 0,
          fat: Number.parseFloat(values[6]) || 0,
          fiber: Number.parseFloat(values[7]) || 0,
          image: values[8]?.trim(),
        }
        meals.push(meal)
        categories.add(meal.category)
      }
    }

    console.log("[v0] Sample meals:", meals)
    console.log("[v0] Categories found:", Array.from(categories))

    return { meals, categories: Array.from(categories) }
  } catch (error) {
    console.error("[v0] Error fetching meals data:", error)
    return null
  }
}

// Execute the function
fetchMealsData()
