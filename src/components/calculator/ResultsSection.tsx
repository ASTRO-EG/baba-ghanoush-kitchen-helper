
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Trash2 } from 'lucide-react';
import { Ingredients } from '@/types/ingredients';
import { formatAmount } from '@/utils/formatters';

interface ResultsSectionProps {
  results: { total: Ingredients; perPot: Ingredients } | null;
  amount: string;
}

const ResultsSection = ({ results, amount }: ResultsSectionProps) => {
  if (!results) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-8 text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">أدخل الكمية واضغط احسب المقادير لعرض النتائج هنا</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

export default ResultsSection;
