
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calculator, Edit, Save, History, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  "طحينة": 1.900,
  "ثوم": 0.075,
  "زبادي": 2.0,
  "عصير ليمون": 0.280,
  "ليمون قبل العصر": 0.700,
  "ملح": 0.140,
  "كمون": 0.075
};

const Index = () => {
  const [amount, setAmount] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredients>(defaultIngredients);
  const [results, setResults] = useState<{ total: Ingredients; perPot: Ingredients } | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  // Load saved records from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('babaGhanoujRecords');
    if (saved) {
      setSavedRecords(JSON.parse(saved));
    }
  }, []);

  const calculateAmounts = (babaGhanoujAmount: number, currentIngredients: Ingredients) => {
    const ratio = babaGhanoujAmount / 10;
    const amounts: Ingredients = {};
    
    Object.entries(currentIngredients).forEach(([ingredient, quantity]) => {
      amounts[ingredient] = quantity * ratio;
    });

    // Convert yogurt from kg to containers (1 container = 0.6667 kg)
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

  const resetToDefault = () => {
    setIngredients(defaultIngredients);
    toast({
      title: "تم الإعادة",
      description: "تم إعادة المقادير إلى القيم الافتراضية"
    });
  };

  const formatAmount = (ingredient: string, quantity: number) => {
    if (ingredient === "زبادي") {
      return `${quantity} علبة`;
    } else if (quantity < 1) {
      return `${(quantity * 1000).toFixed(2)} جرام`;
    } else {
      return `${quantity.toFixed(2)} كيلو`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">حاسبة مقادير البابا غنوج</h1>
          <p className="text-lg text-gray-600">احسب المقادير المطلوبة بدقة لأي كمية من البابا غنوج</p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              حاسبة المقادير
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              تعديل المقادير
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              السجلات المحفوظة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  حساب المقادير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="amount">كمية البابا غنوج (بالكيلو)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="أدخل الكمية..."
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleCalculate} size="lg" className="bg-green-600 hover:bg-green-700">
                    احسب المقادير
                  </Button>
                </div>

                {results && (
                  <div className="space-y-4">
                    <Separator />
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">النتائج</h3>
                      <Button onClick={handleSaveRecord} variant="outline" className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        حفظ التسجيل
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">المقادير الإجمالية لـ {amount} كيلو</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(results.total).map(([ingredient, quantity]) => (
                              <div key={ingredient} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="font-medium">{ingredient}:</span>
                                <Badge variant="secondary">{formatAmount(ingredient, quantity)}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">المقادير لكل حلة (ثلث الكمية)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(results.perPot).map(([ingredient, quantity]) => (
                              <div key={ingredient} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                <span className="font-medium">{ingredient}:</span>
                                <Badge variant="outline">{formatAmount(ingredient, quantity)}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    تعديل المقادير الافتراضية
                  </div>
                  <Button onClick={resetToDefault} variant="outline" size="sm">
                    إعادة للافتراضي
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    هذه المقادير محسوبة لـ 10 كيلو بابا غنوج. يمكنك تعديلها حسب احتياجاتك.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(ingredients).map(([ingredient, quantity]) => (
                    <div key={ingredient} className="space-y-2">
                      <Label htmlFor={ingredient}>{ingredient}</Label>
                      <Input
                        id={ingredient}
                        type="number"
                        step="0.001"
                        value={quantity}
                        onChange={(e) => handleIngredientChange(ingredient, e.target.value)}
                        className="text-right"
                      />
                      <p className="text-sm text-gray-500">
                        {ingredient === "زبادي" ? "كيلو" : quantity < 1 ? "كيلو" : "كيلو"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  السجلات المحفوظة ({savedRecords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد سجلات محفوظة بعد</p>
                    <p className="text-sm">احسب المقادير واحفظها لتظهر هنا</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedRecords.map((record) => (
                      <Card key={record.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{record.amount} كيلو بابا غنوج</h4>
                              <p className="text-sm text-gray-500">{record.date}</p>
                            </div>
                            <Button
                              onClick={() => handleDeleteRecord(record.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-green-700 mb-2">المقادير الإجمالية</h5>
                              <div className="space-y-1">
                                {Object.entries(record.totalAmounts).map(([ingredient, quantity]) => (
                                  <div key={ingredient} className="flex justify-between text-sm">
                                    <span>{ingredient}:</span>
                                    <span>{formatAmount(ingredient, quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-orange-700 mb-2">لكل حلة</h5>
                              <div className="space-y-1">
                                {Object.entries(record.perPotAmounts).map(([ingredient, quantity]) => (
                                  <div key={ingredient} className="flex justify-between text-sm">
                                    <span>{ingredient}:</span>
                                    <span>{formatAmount(ingredient, quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
