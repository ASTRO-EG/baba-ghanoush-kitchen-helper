
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ingredients {
  [key: string]: number;
}

interface SavedRecord {
  id: string;
  date: string;
  amount: number;
  totalAmounts: Ingredients;
  perPotAmounts: Ingredients;
}

const defaultIngredients: Ingredients = {
  "حمص": 1.000,
  "ثوم": 0.075,
  "زبادي": 4.000,
  "عصير ليمون": 0.280,
  "بيروكلينيت": 0.300,
  "ملح": 0.140,
  "كمون": 0.075
};

const Index = () => {
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

  // Save ingredients whenever they change
  useEffect(() => {
    localStorage.setItem('babaGhanoujIngredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const calculateAmounts = (babaGhanoujAmount: number, currentIngredients: Ingredients) => {
    const ratio = babaGhanoujAmount / 10;
    const amounts: Ingredients = {};
    
    Object.entries(currentIngredients).forEach(([ingredient, quantity]) => {
      amounts[ingredient] = quantity * ratio;
    });

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

  const formatAmount = (ingredient: string, quantity: number) => {
    if (ingredient === "زبادي") {
      return `${quantity.toFixed(2)} علبة`;
    } else if (quantity < 1) {
      return `${(quantity * 1000).toFixed(0)} جرام`;
    } else {
      return `${quantity.toFixed(3)} كيلو`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">حاسبة بابا غنوج</h1>
          <p className="text-gray-600">احسب المقادير المطلوبة بدقة لأي كمية</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Right side - Input section */}
          <Card className="order-2 lg:order-1">
            <CardHeader className="bg-purple-50 rounded-t-lg">
              <CardTitle className="text-lg text-center">أدخل الكمية</CardTitle>
              <p className="text-sm text-gray-600 text-center">كمية البابا غنوج بالكيلو جرام المطلوبة</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5"
                    className="text-center text-lg h-12 border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">تعديل المقادير الأساسية لكل 10 كيلو:</h3>
                  {Object.entries(ingredients).map(([ingredient, quantity]) => (
                    <div key={ingredient} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                      <span className="font-medium text-red-800">{ingredient}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.001"
                          value={quantity}
                          onChange={(e) => handleIngredientChange(ingredient, e.target.value)}
                          className="w-20 text-center text-sm h-8"
                        />
                        <span className="text-sm text-gray-600">كيلو</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mt-6">
                  <Button 
                    onClick={handleCalculate} 
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white h-12 text-lg font-semibold"
                  >
                    <Calculator className="w-5 h-5 ml-2" />
                    احسب المقادير
                  </Button>
                  
                  {results && (
                    <Button 
                      onClick={handleSaveRecord} 
                      variant="outline" 
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 h-10"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ النتيجة
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Left side - Results section */}
          <div className="order-1 lg:order-2 space-y-4">
            {results && (
              <>
                {/* Total amounts */}
                <Card>
                  <CardHeader className="bg-blue-50 rounded-t-lg">
                    <CardTitle className="text-lg text-center">المقادير الإجمالية</CardTitle>
                    <p className="text-sm text-gray-600 text-center">لجميع الكمية {amount} كيلو</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {Object.entries(results.total).map(([ingredient, quantity]) => (
                        <div key={ingredient} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium">{ingredient}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {formatAmount(ingredient, quantity)}
                            </Badge>
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Per pot amounts */}
                <Card>
                  <CardHeader className="bg-green-50 rounded-t-lg">
                    <CardTitle className="text-lg text-center">المقادير لكل حلة</CardTitle>
                    <p className="text-sm text-gray-600 text-center">مقسمة على ثلاث حلل</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {Object.entries(results.perPot).map(([ingredient, quantity]) => (
                        <div key={ingredient} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium">{ingredient}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {formatAmount(ingredient, quantity)}
                            </Badge>
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!results && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">أدخل الكمية واضغط احسب المقادير لعرض النتائج هنا</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Saved records */}
        {savedRecords.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">السجلات المحفوظة ({savedRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{record.amount} كيلو</span>
                      <span className="text-sm text-gray-500 mr-2">{record.date}</span>
                    </div>
                    <Button
                      onClick={() => handleDeleteRecord(record.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
