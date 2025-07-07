
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Save } from 'lucide-react';
import { Ingredients } from '@/types/ingredients';
import IngredientsManager from './IngredientsManager';

interface InputSectionProps {
  amount: string;
  setAmount: (amount: string) => void;
  ingredients: Ingredients;
  onIngredientChange: (ingredient: string, value: string) => void;
  onAddIngredient: (name: string, amount: number) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onCalculate: () => void;
  onSaveRecord: () => void;
  hasResults: boolean;
}

const InputSection = ({
  amount,
  setAmount,
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
  onCalculate,
  onSaveRecord,
  hasResults
}: InputSectionProps) => {
  return (
    <div className="space-y-4">
      <Card>
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

            <div className="space-y-2">
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

      <IngredientsManager
        ingredients={ingredients}
        onIngredientChange={onIngredientChange}
        onAddIngredient={onAddIngredient}
        onRemoveIngredient={onRemoveIngredient}
      />
    </div>
  );
};

export default InputSection;
