'use client';

import { useState, useEffect, useRef } from 'react';
import { NumberInput, Select, Text, Group, Box, Title, Divider, Switch } from '@mantine/core';
import dayjs from 'dayjs';

const safeNumber = (val: string | number | null) => (typeof val === 'number' ? val : 0);

function HomePage() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('sedentary');
  const [height, setHeight] = useState(175);
  const [currentWeight, setCurrentWeight] = useState(80);
  const [targetWeight, setTargetWeight] = useState(75);
  const [deficit, setDeficit] = useState(0);
  const [stepsPerDay, setStepsPerDay] = useState(10000);
  const [expectedDays, setExpectedDays] = useState(0);
  const [requiredCalories, setRequiredCalories] = useState(0);

  const CALORIES_PER_KG = 7700;
  const CALORIES_PER_STEP = 0.04;

  const isDeficitManual = useRef(true);
  const isStepsManual = useRef(true);

  const displayTargetDate = () => expectedDays > 0 ? dayjs().add(expectedDays, 'day').format('MMM D, YYYY') : '-';

  useEffect(() => {
    const weight = currentWeight;
    const h = height;
    const a = age;
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * weight + 6.25 * h - 5 * a - 161;
    }

    const activityFactor = activity === 'sedentary' ? 1.2 : activity === 'moderate' ? 1.55 : 1.9;
    const maintenanceCalories = Math.round(bmr * activityFactor);
    setRequiredCalories(maintenanceCalories);
  }, [age, gender, activity, height, currentWeight]);

  useEffect(() => {
    if (!isDeficitManual.current) return;
    const totalCalories = (currentWeight - targetWeight) * CALORIES_PER_KG;
    const caloriesFromDeficit = deficit > 0 ? deficit : 0;
    const caloriesPerDayFromSteps = stepsPerDay * CALORIES_PER_STEP;
    const totalCaloriesPerDay = caloriesFromDeficit + caloriesPerDayFromSteps;
    const estimatedDays = totalCaloriesPerDay > 0 ? totalCalories / totalCaloriesPerDay : 0;

    isStepsManual.current = false;
    setExpectedDays(Math.round(estimatedDays));
  }, [deficit, currentWeight, targetWeight, stepsPerDay]);

  useEffect(() => {
    if (!isStepsManual.current) {
      isStepsManual.current = true;
      return;
    }
    const totalCalories = (currentWeight - targetWeight) * CALORIES_PER_KG;
    const caloriesPerDayFromSteps = stepsPerDay * CALORIES_PER_STEP;
    const estimatedDays = caloriesPerDayFromSteps > 0 ? totalCalories / caloriesPerDayFromSteps : 0;
    setExpectedDays(Math.round(estimatedDays));
    const calculatedDeficit = Math.max(0, totalCalories / estimatedDays - caloriesPerDayFromSteps);
    if (!isNaN(calculatedDeficit)) {
      isDeficitManual.current = false;
      setDeficit(Math.round(calculatedDeficit));
    }
  }, [stepsPerDay, currentWeight, targetWeight]);

  return (
    <Box p="md">
      <Title order={2}>Weight Loss Step Calculator - Mifflin-St Jeor equation</Title>
      <Divider my="sm" />
      <Box>
  <Group>
    <Text w={140}>Age:</Text>
    <NumberInput value={age} onChange={(val) => setAge(safeNumber(val))} />
  </Group>

  <Group mt="sm">
    <Text w={140}>Gender:</Text>
    <Select value={gender} onChange={(val) => setGender(val || 'male')} data={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
  </Group>

  <Group mt="sm">
    <Text w={140}>Activity Level:</Text>
    <Select value={activity} onChange={(val) => setActivity(val || 'sedentary')} data={[{ value: 'sedentary', label: 'Sedentary' }, { value: 'moderate', label: 'Moderate' }, { value: 'heavy', label: 'Heavy' }]} />
  </Group>
</Box>
      <Group grow mt="md">
        <NumberInput label={`Height (CM)`} value={height} onChange={(val) => setHeight(safeNumber(val))} />
        <NumberInput label={`Current Weight (KG)`} value={currentWeight} onChange={(val) => setCurrentWeight(safeNumber(val))} />
        <NumberInput label={`Target Weight (KG)`} value={targetWeight} onChange={(val) => setTargetWeight(safeNumber(val))} />
      </Group>
      <Divider my="sm" />
      <Text>Required Calories per Day: <strong>{requiredCalories}</strong> kcal</Text>
      <NumberInput
        mt="sm"
        label="Calorie Deficit per Day"
        value={deficit}
        onChange={(val) => {
          isDeficitManual.current = true;
          setDeficit(safeNumber(val));
        }}
      />
      <Text mt="sm">Total Calories to Burn: <strong>{(currentWeight - targetWeight) * CALORIES_PER_KG}</strong> kcal - 7700 Cal per KG</Text>
      <NumberInput
        mt="sm"
        label="Steps Per Day - 0.4 cal per step"
        value={stepsPerDay}
        onChange={(val) => {
          isStepsManual.current = true;
          setStepsPerDay(safeNumber(val));
        }}
      />
      <Text mt="sm">Expected Days to Reach Target: <strong>{expectedDays}</strong> days</Text>
      <Text mt="xs">Target Date: <strong>{displayTargetDate()}</strong></Text>
    </Box>
  );
}

export default HomePage;
