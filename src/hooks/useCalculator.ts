
import { useState, useEffect } from 'react';
import { Ingredients, SavedRecord, defaultIngredients } from '@/types/ingredients';
import { useToast } from '@/hooks/use-toast';

export const useCalculator = () => {
  const [amount, setAmount] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredients>(defaultIngredients);
  const [results, setResults] = useState<{ total: Ingredients; perPot: Ingredients } | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('babaGhanoujRecords');
    if (saved) {
      setSavedRecords(JSON.parse(saved));
    }
    
    const savedIngredients = localStorage.getItem('babaGhanoujIngredients');
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('babaGhanoujIngredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const calculateAmounts = (babaGhanoujAmount: number, currentIngredients: Ingredients) => {
    const ratio = babaGhanoujAmount / 10;
    const amounts: Ingredients = {};
    
    Object.entries(currentIngredients).forEach(([ingredient, quantity]) => {
      amounts[ingredient] = quantity * ratio;
    });

    // Fix yogurt calculation to match Python code
    const containerWeight = 0.6667;
    if ("زبادي" in amounts) {
      const yogurtKg = amounts["زبادي"];
      const containerCount = Math.round((yogurtKg / containerWeight) * 100) / 100;
      amounts["زبادي"] = containerCount;
    }

    return amounts;
  };

  const calculatePerPot = (totalAmounts: Ingredients) => {
    const perPotAmounts: Ingredients = {};
    
    Object.entries(totalAmounts).forEach(([ingredient, quantity]) => {
      if (ingredient === "زبادي") {
        perPotAmounts[ingredient] = Math.round((quantity / 3) * 100) / 100;
      } else {
        perPotAmounts[ingredient] = quantity / 3;
      }
    });

    return perPotAmounts;
  };

  const handleCalculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة للبابا غنوج",
        variant: "destructive"
      });
      return;
    }

    const totalAmounts = calculateAmounts(numAmount, ingredients);
    const perPotAmounts = calculatePerPot(totalAmounts);
    
    setResults({
      total: totalAmounts,
      perPot: perPotAmounts
    });

    toast({
      title: "تم الحساب بنجاح",
      description: `تم حساب المقادير لـ ${numAmount} كيلو بابا غنوج`
    });
  };

  const handleSaveRecord = () => {
    if (!results || !amount) {
      toast({
        title: "لا توجد نتائج للحفظ",
        description: "يرجى حساب المقادير أولاً",
        variant: "destructive"
      });
      return;
    }

    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG'),
      amount: parseFloat(amount),
      totalAmounts: results.total,
      perPotAmounts: results.perPot
    };

    const updatedRecords = [newRecord, ...savedRecords];
    setSavedRecords(updatedRecords);
    localStorage.setItem('babaGhanoujRecords', JSON.stringify(updatedRecords));

    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ التسجيل في السجلات"
    });
  };

  const handleDeleteRecord = (id: string) => {
    const updatedRecords = savedRecords.filter(record => record.id !== id);
    setSavedRecords(updatedRecords);
    localStorage.setItem('babaGhanoujRecords', JSON.stringify(updatedRecords));

    toast({
      title: "تم الحذف",
      description: "تم حذف التسجيل من السجلات"
    });
  };

  const handleIngredientChange = (ingredient: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setIngredients(prev => ({
        ...prev,
        [ingredient]: numValue
      }));
    }
  };

  const handleAddIngredient = (name: string, amount: number) => {
    if (name.trim() && amount >= 0 && !ingredients[name]) {
      setIngredients(prev => ({
        ...prev,
        [name]: amount
      }));
      
      toast({
        title: "تم إضافة المكون",
        description: `تم إضافة ${name} بنجاح`
      });
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(prev => {
      const newIngredients = { ...prev };
      delete newIngredients[ingredient];
      return newIngredients;
    });

    toast({
      title: "تم حذف المكون",
      description: `تم حذف ${ingredient} من القائمة`
    });
  };

  return {
    amount,
    setAmount,
    ingredients,
    results,
    savedRecords,
    handleCalculate,
    handleSaveRecord,
    handleDeleteRecord,
    handleIngredientChange,
    handleAddIngredient,
    handleRemoveIngredient
  };
};
