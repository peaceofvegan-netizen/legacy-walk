import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "legacyWalkMealPlanner";

const DEFAULT_PROFILE = {
  dailyCalories: 2000,
  proteinGoal: 130,
  carbGoal: 220,
  fatGoal: 65,
  waterGoal: 100,
  preference: "Balanced",
};

const DEFAULT_MEALS = [
  {
    id: "breakfast",
    type: "Breakfast",
    icon: "weather-sunny",
    time: "8:00 AM",
    name: "Protein Oatmeal Bowl",
    description:
      "Oats, blueberries, banana, Greek yogurt, chia seeds, and cinnamon.",
    calories: 480,
    protein: 28,
    carbs: 68,
    fat: 12,
    completed: false,
  },
  {
    id: "lunch",
    type: "Lunch",
    icon: "food-apple",
    time: "12:30 PM",
    name: "Grilled Chicken Power Bowl",
    description:
      "Chicken breast, brown rice, spinach, avocado, tomato, and lemon dressing.",
    calories: 610,
    protein: 48,
    carbs: 62,
    fat: 20,
    completed: false,
  },
  {
    id: "snack",
    type: "Snack",
    icon: "food-apple-outline",
    time: "3:30 PM",
    name: "Recovery Snack",
    description: "Greek yogurt, strawberries, almonds, and a drizzle of honey.",
    calories: 280,
    protein: 21,
    carbs: 32,
    fat: 9,
    completed: false,
  },
  {
    id: "dinner",
    type: "Dinner",
    icon: "silverware-fork-knife",
    time: "7:00 PM",
    name: "Salmon Recovery Plate",
    description:
      "Baked salmon, roasted sweet potato, broccoli, and mixed greens.",
    calories: 630,
    protein: 45,
    carbs: 58,
    fat: 24,
    completed: false,
  },
];

const PREFERENCE_OPTIONS = [
  "Balanced",
  "High Protein",
  "Low Carb",
  "Vegetarian",
  "Mediterranean",
];

function clamp(value, minimum = 0, maximum = 100) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return minimum;
  }

  return Math.min(Math.max(number, minimum), maximum);
}

function ProgressBar({ value, color = "#42F58D" }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${clamp(value)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function MacroCard({ label, current, goal, unit = "g", color, icon }) {
  const progress = goal > 0 ? (current / goal) * 100 : 0;

  return (
    <View style={styles.macroCard}>
      <View style={styles.macroHeader}>
        <View style={[styles.macroIcon, { borderColor: color }]}>
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        </View>

        <Text style={styles.macroLabel}>{label}</Text>
      </View>

      <Text style={styles.macroValue}>
        {Math.round(current)}
        <Text style={styles.macroGoal}>
          {" "}
          / {goal}
          {unit}
        </Text>
      </Text>

      <ProgressBar value={progress} color={color} />
    </View>
  );
}

function MealCard({ meal, onToggle, onEdit }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.mealCard,
        meal.completed && styles.mealCardCompleted,
      ]}
      onPress={() => onToggle(meal.id)}
    >
      <View style={styles.mealTopRow}>
        <View style={styles.mealTitleRow}>
          <View style={styles.mealIcon}>
            <MaterialCommunityIcons
              name={meal.icon}
              size={24}
              color="#42F58D"
            />
          </View>

          <View style={styles.mealHeading}>
            <Text style={styles.mealType}>{meal.type}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            meal.completed && styles.completeButtonActive,
          ]}
          onPress={() => onToggle(meal.id)}
        >
          <Ionicons
            name={meal.completed ? "checkmark" : "ellipse-outline"}
            size={20}
            color={meal.completed ? "#02111F" : "#AFC1D9"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealDescription}>{meal.description}</Text>

      <View style={styles.nutritionRow}>
        <View style={styles.nutritionPill}>
          <Ionicons name="flame" size={15} color="#FFC94A" />
          <Text style={styles.nutritionText}>{meal.calories} cal</Text>
        </View>

        <View style={styles.nutritionPill}>
          <MaterialCommunityIcons
            name="food-drumstick"
            size={15}
            color="#FF6475"
          />
          <Text style={styles.nutritionText}>{meal.protein}g protein</Text>
        </View>

        <View style={styles.nutritionPill}>
          <MaterialCommunityIcons name="bread-slice" size={15} color="#52A8FF" />
          <Text style={styles.nutritionText}>{meal.carbs}g carbs</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editMealButton} onPress={() => onEdit(meal)}>
        <Ionicons name="create-outline" size={17} color="#9FCBFF" />
        <Text style={styles.editMealText}>Edit meal</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function MealPlannerScreen({
  language = "en",
  goBack,
  goToSubscription,
  userPlan = "free",
}) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const [water, setWater] = useState(0);
  const [showGoals, setShowGoals] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const totals = useMemo(() => {
    return meals.reduce(
      (result, meal) => {
        result.calories += Number(meal.calories || 0);
        result.protein += Number(meal.protein || 0);
        result.carbs += Number(meal.carbs || 0);
        result.fat += Number(meal.fat || 0);

        if (meal.completed) {
          result.completedCalories += Number(meal.calories || 0);
          result.completedProtein += Number(meal.protein || 0);
          result.completedCarbs += Number(meal.carbs || 0);
          result.completedFat += Number(meal.fat || 0);
        }

        return result;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        completedCalories: 0,
        completedProtein: 0,
        completedCarbs: 0,
        completedFat: 0,
      }
    );
  }, [meals]);

  const completedMeals = useMemo(
    () => meals.filter((meal) => meal.completed).length,
    [meals]
  );

  const planProgress =
    meals.length > 0 ? (completedMeals / meals.length) * 100 : 0;

  useEffect(() => {
    loadPlanner();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    savePlanner();
  }, [profile, meals, water, isLoaded]);

  const loadPlanner = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setProfile({
          ...DEFAULT_PROFILE,
          ...(parsed.profile || {}),
        });

        setMeals(
          Array.isArray(parsed.meals) && parsed.meals.length
            ? parsed.meals
            : DEFAULT_MEALS
        );

        setWater(Number(parsed.water || 0));
      }
    } catch (error) {
      console.log("Meal planner load error:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const savePlanner = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          meals,
          water,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.log("Meal planner save error:", error);
    }
  };

  const handleBack = () => {
    if (typeof goBack === "function") {
      goBack();
    }
  };

  const toggleMeal = (mealId) => {
    setMeals((currentMeals) =>
      currentMeals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              completed: !meal.completed,
            }
          : meal
      )
    );
  };

  const editMeal = (meal) => {
    Alert.alert(
      meal.name,
      "Meal editing can be connected to the AI meal builder next.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Replace meal",
          onPress: () => replaceMeal(meal.id),
        },
      ]
    );
  };

  const replaceMeal = (mealId) => {
    const replacements = {
      breakfast: {
        name: "Egg and Avocado Breakfast",
        description:
          "Two eggs, avocado toast, fresh berries, and Greek yogurt.",
        calories: 510,
        protein: 30,
        carbs: 47,
        fat: 23,
      },
      lunch: {
        name: "Turkey Quinoa Bowl",
        description:
          "Lean turkey, quinoa, roasted vegetables, spinach, and herb dressing.",
        calories: 590,
        protein: 46,
        carbs: 58,
        fat: 18,
      },
      snack: {
        name: "Protein Smoothie",
        description:
          "Protein, banana, berries, spinach, almond milk, and chia seeds.",
        calories: 310,
        protein: 27,
        carbs: 39,
        fat: 7,
      },
      dinner: {
        name: "Lean Beef Recovery Bowl",
        description:
          "Lean beef, roasted potatoes, green beans, and mixed vegetables.",
        calories: 650,
        protein: 47,
        carbs: 61,
        fat: 24,
      },
    };

    setMeals((currentMeals) =>
      currentMeals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              ...(replacements[mealId] || {}),
              completed: false,
            }
          : meal
      )
    );
  };

  const generateNewPlan = () => {
    if (userPlan === "free" && typeof goToSubscription === "function") {
      Alert.alert(
        "Premium Meal Planning",
        "Personalized AI meal plans are available with Premium and Elite.",
        [
          {
            text: "Not now",
            style: "cancel",
          },
          {
            text: "View plans",
            onPress: goToSubscription,
          },
        ]
      );

      return;
    }

    setMeals((currentMeals) =>
      currentMeals.map((meal) => ({
        ...meal,
        completed: false,
      }))
    );

    setWater(0);

    Alert.alert(
      "New plan created",
      `Your ${profile.preference.toLowerCase()} meal plan is ready.`
    );
  };

  const resetDay = () => {
    Alert.alert(
      "Reset today?",
      "This will clear completed meals and hydration for today.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setMeals((currentMeals) =>
              currentMeals.map((meal) => ({
                ...meal,
                completed: false,
              }))
            );
            setWater(0);
          },
        },
      ]
    );
  };

  const addWater = () => {
    setWater((current) =>
      Math.min(current + 8, Number(profile.waterGoal || 100))
    );
  };

  const removeWater = () => {
    setWater((current) => Math.max(current - 8, 0));
  };

  const updateGoal = (field, value) => {
    const numericValue = Number(String(value).replace(/[^0-9]/g, ""));

    setProfile((current) => ({
      ...current,
      [field]: Number.isFinite(numericValue) ? numericValue : 0,
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#020611", "#071A33", "#020611"]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={27} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.eyebrow}>LEGACY AI WELLNESS</Text>
              <Text style={styles.title}>Meal Planner</Text>
            </View>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowGoals((current) => !current)}
            >
              <Ionicons name="settings-outline" size={23} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#123E77", "#08284F", "#06172D"]}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>TODAY'S NUTRITION PLAN</Text>
                <Text style={styles.heroTitle}>{profile.preference}</Text>
              </View>

              <View style={styles.planBadge}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={18}
                  color="#FFC94A"
                />
                <Text style={styles.planBadgeText}>
                  {completedMeals}/{meals.length}
                </Text>
              </View>
            </View>

            <Text style={styles.heroDescription}>
              Fuel your walks, improve recovery, and stay consistent with a
              balanced daily nutrition plan.
            </Text>

            <View style={styles.dailyProgressRow}>
              <Text style={styles.dailyProgressLabel}>Daily progress</Text>
              <Text style={styles.dailyProgressValue}>
                {Math.round(planProgress)}%
              </Text>
            </View>

            <ProgressBar value={planProgress} color="#42F58D" />

            <View style={styles.calorieSummary}>
              <View>
                <Text style={styles.calorieNumber}>
                  {totals.completedCalories.toLocaleString()}
                </Text>
                <Text style={styles.calorieCaption}>Consumed</Text>
              </View>

              <View style={styles.calorieDivider} />

              <View>
                <Text style={styles.calorieNumber}>
                  {Number(profile.dailyCalories).toLocaleString()}
                </Text>
                <Text style={styles.calorieCaption}>Daily goal</Text>
              </View>

              <View style={styles.calorieDivider} />

              <View>
                <Text style={styles.calorieNumber}>
                  {Math.max(
                    Number(profile.dailyCalories) - totals.completedCalories,
                    0
                  ).toLocaleString()}
                </Text>
                <Text style={styles.calorieCaption}>Remaining</Text>
              </View>
            </View>
          </LinearGradient>

          {showGoals && (
            <View style={styles.goalEditor}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>PERSONALIZATION</Text>
                  <Text style={styles.sectionTitle}>Nutrition Goals</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowGoals(false)}
                >
                  <Ionicons name="close" size={21} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Meal preference</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.preferenceRow}
              >
                {PREFERENCE_OPTIONS.map((option) => {
                  const selected = profile.preference === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.preferenceButton,
                        selected && styles.preferenceButtonActive,
                      ]}
                      onPress={() =>
                        setProfile((current) => ({
                          ...current,
                          preference: option,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.preferenceText,
                          selected && styles.preferenceTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.goalInputGrid}>
                <GoalInput
                  label="Calories"
                  value={profile.dailyCalories}
                  onChangeText={(value) => updateGoal("dailyCalories", value)}
                />

                <GoalInput
                  label="Protein"
                  value={profile.proteinGoal}
                  onChangeText={(value) => updateGoal("proteinGoal", value)}
                />

                <GoalInput
                  label="Carbs"
                  value={profile.carbGoal}
                  onChangeText={(value) => updateGoal("carbGoal", value)}
                />

                <GoalInput
                  label="Water oz"
                  value={profile.waterGoal}
                  onChangeText={(value) => updateGoal("waterGoal", value)}
                />
              </View>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>DAILY TARGETS</Text>
              <Text style={styles.sectionTitle}>Nutrition Overview</Text>
            </View>
          </View>

          <View style={styles.macroGrid}>
            <MacroCard
              label="Calories"
              current={totals.completedCalories}
              goal={profile.dailyCalories}
              unit=""
              color="#FFC94A"
              icon="fire"
            />

            <MacroCard
              label="Protein"
              current={totals.completedProtein}
              goal={profile.proteinGoal}
              color="#FF6475"
              icon="food-drumstick"
            />

            <MacroCard
              label="Carbs"
              current={totals.completedCarbs}
              goal={profile.carbGoal}
              color="#52A8FF"
              icon="bread-slice"
            />

            <MacroCard
              label="Fat"
              current={totals.completedFat}
              goal={profile.fatGoal}
              color="#B77BFF"
              icon="peanut"
            />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>TODAY</Text>
              <Text style={styles.sectionTitle}>Your Meals</Text>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetDay}>
              <Ionicons name="refresh" size={17} color="#9FCBFF" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onToggle={toggleMeal}
              onEdit={editMeal}
            />
          ))}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>HYDRATION</Text>
              <Text style={styles.sectionTitle}>Water Goal</Text>
            </View>
          </View>

          <View style={styles.waterCard}>
            <View style={styles.waterLeft}>
              <View style={styles.waterIcon}>
                <Ionicons name="water" size={30} color="#38D6FF" />
              </View>

              <View>
                <Text style={styles.waterValue}>
                  {water} / {profile.waterGoal} oz
                </Text>
                <Text style={styles.waterCaption}>
                  {Math.round(water / 8)} glasses completed
                </Text>
              </View>
            </View>

            <View style={styles.waterControls}>
              <TouchableOpacity style={styles.waterButton} onPress={removeWater}>
                <Ionicons name="remove" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.waterButtonPrimary}
                onPress={addWater}
              >
                <Ionicons name="add" size={23} color="#02111F" />
              </TouchableOpacity>
            </View>

            <View style={styles.waterProgress}>
              <ProgressBar
                value={
                  profile.waterGoal > 0
                    ? (water / profile.waterGoal) * 100
                    : 0
                }
                color="#38D6FF"
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>LEGACY AI</Text>
              <Text style={styles.sectionTitle}>Coach Recommendation</Text>
            </View>
          </View>

          <LinearGradient
            colors={["#102B4E", "#071B32"]}
            style={styles.coachCard}
          >
            <View style={styles.coachIcon}>
              <MaterialCommunityIcons
                name="brain"
                size={30}
                color="#42F58D"
              />
            </View>

            <View style={styles.coachTextWrap}>
              <Text style={styles.coachTitle}>Recovery Nutrition</Text>
              <Text style={styles.coachText}>
                Complete your protein-rich meal after your walk and drink at
                least 16 ounces of water to support muscle recovery.
              </Text>
            </View>
          </LinearGradient>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.generateButton}
            onPress={generateNewPlan}
          >
            <LinearGradient
              colors={["#FFD34F", "#F4B92E"]}
              style={styles.generateGradient}
            >
              <MaterialCommunityIcons
                name="creation"
                size={24}
                color="#02111F"
              />
              <Text style={styles.generateText}>Generate New Meal Plan</Text>
              <Ionicons name="arrow-forward" size={23} color="#02111F" />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Meal suggestions are general wellness guidance and are not medical
            nutrition advice.
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function GoalInput({ label, value, onChangeText }) {
  return (
    <View style={styles.goalInputWrap}>
      <Text style={styles.goalInputLabel}>{label}</Text>

      <TextInput
        value={String(value)}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#687B96"
        style={styles.goalInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020611",
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A1D35",
    borderWidth: 1,
    borderColor: "#244768",
  },

  headerTitleWrap: {
    alignItems: "center",
    flex: 1,
  },

  eyebrow: {
    color: "#FFC94A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },

  heroCard: {
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#2A5685",
    marginBottom: 24,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  heroLabel: {
    color: "#9FCBFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 4,
  },

  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,201,74,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,201,74,0.45)",
  },

  planBadgeText: {
    color: "#FFC94A",
    fontWeight: "900",
  },

  heroDescription: {
    color: "#C1D3E8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },

  dailyProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 8,
  },

  dailyProgressLabel: {
    color: "#B8C9DD",
    fontSize: 13,
    fontWeight: "700",
  },

  dailyProgressValue: {
    color: "#42F58D",
    fontSize: 13,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#263B52",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  calorieSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(159,203,255,0.2)",
  },

  calorieNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  calorieCaption: {
    color: "#9CB0C8",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },

  calorieDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(159,203,255,0.22)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: "#52A8FF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },

  goalEditor: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#081D35",
    borderWidth: 1,
    borderColor: "#27496E",
    marginBottom: 24,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132C48",
  },

  fieldLabel: {
    color: "#B9CADF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  preferenceRow: {
    gap: 8,
    paddingBottom: 16,
  },

  preferenceButton: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#102A47",
    borderWidth: 1,
    borderColor: "#28496A",
  },

  preferenceButtonActive: {
    backgroundColor: "#FFC94A",
    borderColor: "#FFC94A",
  },

  preferenceText: {
    color: "#BFD0E4",
    fontSize: 12,
    fontWeight: "800",
  },

  preferenceTextActive: {
    color: "#02111F",
  },

  goalInputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  goalInputWrap: {
    width: "48%",
  },

  goalInputLabel: {
    color: "#9DB2CB",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
  },

  goalInput: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 13,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    backgroundColor: "#061426",
    borderWidth: 1,
    borderColor: "#294867",
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },

  macroCard: {
    width: "48%",
    minHeight: 130,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#244564",
  },

  macroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071426",
    borderWidth: 1,
  },

  macroLabel: {
    color: "#B9CBE0",
    fontWeight: "800",
  },

  macroValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 11,
  },

  macroGoal: {
    color: "#8299B3",
    fontSize: 12,
    fontWeight: "700",
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#0B233D",
    borderWidth: 1,
    borderColor: "#274C70",
  },

  resetText: {
    color: "#9FCBFF",
    fontSize: 12,
    fontWeight: "800",
  },

  mealCard: {
    borderRadius: 23,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#264866",
  },

  mealCardCompleted: {
    borderColor: "rgba(66,245,141,0.7)",
    backgroundColor: "#092637",
  },

  mealTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mealTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(66,245,141,0.1)",
  },

  mealHeading: {
    marginLeft: 12,
  },

  mealType: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  mealTime: {
    color: "#8399B2",
    fontSize: 12,
    marginTop: 2,
  },

  completeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102A46",
    borderWidth: 1,
    borderColor: "#31506D",
  },

  completeButtonActive: {
    backgroundColor: "#42F58D",
    borderColor: "#42F58D",
  },

  mealName: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 16,
  },

  mealDescription: {
    color: "#AFC1D6",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },

  nutritionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 15,
  },

  nutritionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: "#061426",
  },

  nutritionText: {
    color: "#C5D5E8",
    fontSize: 11,
    fontWeight: "700",
  },

  editMealButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 15,
  },

  editMealText: {
    color: "#9FCBFF",
    fontSize: 12,
    fontWeight: "800",
  },

  waterCard: {
    borderRadius: 23,
    padding: 18,
    marginBottom: 26,
    backgroundColor: "#081B31",
    borderWidth: 1,
    borderColor: "#26516F",
  },

  waterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  waterIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56,214,255,0.1)",
    marginRight: 13,
  },

  waterValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  waterCaption: {
    color: "#8FA6BF",
    fontSize: 12,
    marginTop: 3,
  },

  waterControls: {
    position: "absolute",
    right: 18,
    top: 20,
    flexDirection: "row",
    gap: 8,
  },

  waterButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132B46",
  },

  waterButtonPrimary: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38D6FF",
  },

  waterProgress: {
    marginTop: 17,
  },

  coachCard: {
    flexDirection: "row",
    borderRadius: 23,
    padding: 18,
    borderWidth: 1,
    borderColor: "#295075",
    marginBottom: 20,
  },

  coachIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(66,245,141,0.1)",
    marginRight: 13,
  },

  coachTextWrap: {
    flex: 1,
  },

  coachTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  coachText: {
    color: "#B7CAE0",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },

  generateButton: {
    borderRadius: 26,
    overflow: "hidden",
    marginTop: 4,
  },

  generateGradient: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
  },

  generateText: {
    color: "#02111F",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },

  disclaimer: {
    color: "#71869F",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
});