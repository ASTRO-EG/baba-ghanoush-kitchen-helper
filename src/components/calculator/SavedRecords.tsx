
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { SavedRecord } from '@/types/ingredients';

interface SavedRecordsProps {
  savedRecords: SavedRecord[];
  onDeleteRecord: (id: string) => void;
}

const SavedRecords = ({ savedRecords, onDeleteRecord }: SavedRecordsProps) => {
  if (savedRecords.length === 0) {
    return null;
  }

  return (
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
                onClick={() => onDeleteRecord(record.id)}
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
  );
};

export default SavedRecords;
