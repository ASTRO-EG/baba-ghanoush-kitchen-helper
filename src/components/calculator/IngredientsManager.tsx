
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Ingredients } from '@/types/ingredients';

interface IngredientsManagerProps {
  ingredients: Ingredients;
  onIngredientChange: (ingredient: string, value: string) => void;
  onAddIngredient: (name: string, amount: number) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

const IngredientsManager = ({ 
  ingredients, 
  onIngredientChange, 
  onAddIngredient, 
  onRemoveIngredient 
}: IngredientsManagerProps) => {
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientAmount, setNewIngredientAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddNew = () => {
    const amount = parseFloat(newIngredientAmount);
    if (newIngredientName.trim() && !isNaN(amount) && amount >= 0) {
      onAddIngredient(newIngredientName.trim(), amount);
      setNewIngredientName('');
      setNewIngredientAmount('');
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-orange-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">إدارة المكونات</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 ml-1" />
                مكون جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة مكون جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المكون</label>
                  <Input
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    placeholder="اسم المكون"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الكمية (كيلو)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={newIngredientAmount}
                    onChange={(e) => setNewIngredientAmount(e.target.value)}
                    placeholder="0.000"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddNew} className="flex-1">
                    إضافة
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-gray-600">المقادير الأساسية لكل 10 كيلو بابا غنوج</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {Object.entries(ingredients).map(([ingredient, quantity]) => (
            <div key={ingredient} className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
              <span className="font-medium text-orange-800">{ingredient}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.001"
                  value={quantity}
                  onChange={(e) => onIngredientChange(ingredient, e.target.value)}
                  className="w-20 text-center text-sm h-8"
                />
                <span className="text-sm text-gray-600">كيلو</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveIngredient(ingredient)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientsManager;
