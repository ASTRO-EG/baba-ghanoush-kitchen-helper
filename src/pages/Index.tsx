
import React from 'react';
import InputSection from '@/components/calculator/InputSection';
import ResultsSection from '@/components/calculator/ResultsSection';
import SavedRecords from '@/components/calculator/SavedRecords';
import { useCalculator } from '@/hooks/useCalculator';

const Index = () => {
  const {
    amount,
    setAmount,
    ingredients,
    results,
    savedRecords,
    handleCalculate,
    handleSaveRecord,
    handleDeleteRecord,
    handleIngredientChange
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">حاسبة بابا غنوج</h1>
          <p className="text-gray-600">احسب المقادير المطلوبة بدقة لأي كمية</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <InputSection
            amount={amount}
            setAmount={setAmount}
            ingredients={ingredients}
            onIngredientChange={handleIngredientChange}
            onCalculate={handleCalculate}
            onSaveRecord={handleSaveRecord}
            hasResults={!!results}
          />

          <div className="order-1 lg:order-2 space-y-4">
            <ResultsSection results={results} amount={amount} />
          </div>
        </div>

        <SavedRecords savedRecords={savedRecords} onDeleteRecord={handleDeleteRecord} />
      </div>
    </div>
  );
};

export default Index;
