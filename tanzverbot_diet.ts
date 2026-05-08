export enum Sex {
  Male = "m",
  Female = "f",
}

type Food = { name: string; calories: number; servings: number };

const foods: Food[] = [
  { name: "Kellogg's Tresor",                 calories: 137,  servings: 4 },
  { name: "Weihenstephan Haltbare Milch",     calories: 64,   servings: 8 },
  { name: "Mühle Frikadellen",                calories: 271,  servings: 4 },
  { name: "Volvic Tee",                       calories: 40,   servings: 12 },
  { name: "Neuburger lockerer Sahnepudding",  calories: 297,  servings: 1 },
  { name: "Lagnese Viennetta",                calories: 125,  servings: 6 },
  { name: "Schöller 10ForTwo",                calories: 482,  servings: 2 },
  { name: "Ristorante Pizza Salame",          calories: 835,  servings: 2 },
  { name: "Schweppes Ginger Ale",             calories: 37,   servings: 25 },
  { name: "Mini Babybel",                     calories: 59,   servings: 20 },
];

// Harris-Benedict Formula constants
const HARRIS_BENEDICT_MALE_BASE = 66.47;
const HARRIS_BENEDICT_MALE_WEIGHT = 13.7;
const HARRIS_BENEDICT_MALE_HEIGHT = 5.003;
const HARRIS_BENEDICT_MALE_AGE = 6.75;

const HARRIS_BENEDICT_FEMALE_BASE = 655.1;
const HARRIS_BENEDICT_FEMALE_WEIGHT = 9.563;
const HARRIS_BENEDICT_FEMALE_HEIGHT = 1.85;
const HARRIS_BENEDICT_FEMALE_AGE = 4.676;

// Conversion constants
const KCAL_PER_KG_BODY_FAT = 9000;
const HEIGHT_CM_FACTOR = 100.0;

function validateDietInput(
  currentWeightKg: number,
  targetWeightKg: number,
  heightM: number,
  ageY: number,
): void {
  if (targetWeightKg - currentWeightKg < 0) {
    throw new Error(`This diet is for gaining weight, not loosing it!`);
  }
  if (ageY < 16 || heightM < 1.5) {
    throw new Error(`You do not qualify for this kind of diet.`);
  }
}

function calculateMaleBMR(
  weightKg: number,
  heightM: number,
  ageY: number,
): number {
  return Math.ceil(
    HARRIS_BENEDICT_MALE_BASE +
      HARRIS_BENEDICT_MALE_WEIGHT * weightKg +
      HARRIS_BENEDICT_MALE_HEIGHT * heightM * HEIGHT_CM_FACTOR -
      HARRIS_BENEDICT_MALE_AGE * ageY,
  );
}

function calculateFemaleBMR(
  weightKg: number,
  heightM: number,
  ageY: number,
): number {
  return Math.ceil(
    HARRIS_BENEDICT_FEMALE_BASE +
      HARRIS_BENEDICT_FEMALE_WEIGHT * weightKg +
      HARRIS_BENEDICT_FEMALE_HEIGHT * heightM * HEIGHT_CM_FACTOR -
      HARRIS_BENEDICT_FEMALE_AGE * ageY,
  );
}

function calculateDaysOnDiet(
  dailyCaloriesOnDiet: number,
  dailyCaloriesBasicMetabolicRate: number,
  weightGainKg: number,
): number {
  const dailyExcessCalories =
    dailyCaloriesOnDiet - dailyCaloriesBasicMetabolicRate;
  if (dailyExcessCalories <= 0) {
    throw new Error("This diet is not sufficient for you to gain weight.");
  }
  return Math.ceil(
    (KCAL_PER_KG_BODY_FAT * weightGainKg) / dailyExcessCalories,
  );
}

export function calcDateOnDiet(
  currentWeightKg: number,
  targetWeightKg: number,
  heightM: number,
  ageY: number,
  sex: Sex,
): number {
  const weightGainKg = targetWeightKg - currentWeightKg;
  validateDietInput(currentWeightKg, targetWeightKg, heightM, ageY);

  const dailyCaloriesOnDiet = foods.reduce(
    (sum, food) => sum + food.calories * food.servings,
    0,
  );

  const dailyCaloriesBasicMetabolicRate =
    sex === Sex.Male
      ? calculateMaleBMR(currentWeightKg, heightM, ageY)
      : calculateFemaleBMR(currentWeightKg, heightM, ageY);

  return calculateDaysOnDiet(
    dailyCaloriesOnDiet,
    dailyCaloriesBasicMetabolicRate,
    weightGainKg,
  );
}
