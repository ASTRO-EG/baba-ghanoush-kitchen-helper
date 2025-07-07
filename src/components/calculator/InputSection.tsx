
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Save } from 'lucide-react';
import { Ingredients } from '@/types/ingredients';

interface InputSectionProps {
  amount: string;
  setAmount: (amount: string) => void;
  ingredients: Ingredients;
  onIngredientChange: (ingredient: string, value: string) => void;
  onCalculate: () => void;
  onSaveRecord: () => void;
  hasResults: boolean;
}

const InputSection = ({
  amount,
  setAmount,
  ingredients,
  onIngredientChange,
  onCalculate,
  onSaveRecord,
  hasResults
}: InputSectionProps) => {
  return (
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
                    onChange={(e) => onIngredientChange(ingredient, e.target.value)}
                    className="w-20 text-center text-sm h-8"
                  />
                  <span className="text-sm text-gray-600">كيلو</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-6">
            <Button 
              onClick={onCalculate} 
              className="w-full bg-purple-700 hover:bg-purple-800 text-white h-12 text-lg font-semibold"
            >
              <Calculator className="w-5 h-5 ml-2" />
              احسب المقادير
            </Button>
            
            {hasResults && (
              <Button 
                onClick={onSaveRecord} 
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
  );
};

export default InputSection;
