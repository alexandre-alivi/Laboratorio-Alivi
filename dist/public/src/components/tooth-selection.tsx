import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Utensils, Plus, X } from "lucide-react";
import ToothIcon from "@/components/tooth-icon";
import { useToast } from "@/hooks/use-toast";

interface ToothSelectionProps {
  selectedTeeth: Array<{ number: string; name: string; id: string }>;
  onTeethChange: (teeth: Array<{ number: string; name: string; id: string }>) => void;
  onRemoveTooth: (toothId: string) => void;
}

const PERMANENT_TEETH = [
  // Quadrante Superior Direito
  { value: "11", label: "11 - Incisivo Central", group: "Quadrante Superior Direito" },
  { value: "12", label: "12 - Incisivo Lateral", group: "Quadrante Superior Direito" },
  { value: "13", label: "13 - Canino", group: "Quadrante Superior Direito" },
  { value: "14", label: "14 - 1º Pré-Molar", group: "Quadrante Superior Direito" },
  { value: "15", label: "15 - 2º Pré-Molar", group: "Quadrante Superior Direito" },
  { value: "16", label: "16 - 1º Molar", group: "Quadrante Superior Direito" },
  { value: "17", label: "17 - 2º Molar", group: "Quadrante Superior Direito" },
  { value: "18", label: "18 - 3º Molar (Siso)", group: "Quadrante Superior Direito" },
  
  // Quadrante Superior Esquerdo
  { value: "21", label: "21 - Incisivo Central", group: "Quadrante Superior Esquerdo" },
  { value: "22", label: "22 - Incisivo Lateral", group: "Quadrante Superior Esquerdo" },
  { value: "23", label: "23 - Canino", group: "Quadrante Superior Esquerdo" },
  { value: "24", label: "24 - 1º Pré-Molar", group: "Quadrante Superior Esquerdo" },
  { value: "25", label: "25 - 2º Pré-Molar", group: "Quadrante Superior Esquerdo" },
  { value: "26", label: "26 - 1º Molar", group: "Quadrante Superior Esquerdo" },
  { value: "27", label: "27 - 2º Molar", group: "Quadrante Superior Esquerdo" },
  { value: "28", label: "28 - 3º Molar (Siso)", group: "Quadrante Superior Esquerdo" },
  
  // Quadrante Inferior Esquerdo
  { value: "31", label: "31 - Incisivo Central", group: "Quadrante Inferior Esquerdo" },
  { value: "32", label: "32 - Incisivo Lateral", group: "Quadrante Inferior Esquerdo" },
  { value: "33", label: "33 - Canino", group: "Quadrante Inferior Esquerdo" },
  { value: "34", label: "34 - 1º Pré-Molar", group: "Quadrante Inferior Esquerdo" },
  { value: "35", label: "35 - 2º Pré-Molar", group: "Quadrante Inferior Esquerdo" },
  { value: "36", label: "36 - 1º Molar", group: "Quadrante Inferior Esquerdo" },
  { value: "37", label: "37 - 2º Molar", group: "Quadrante Inferior Esquerdo" },
  { value: "38", label: "38 - 3º Molar (Siso)", group: "Quadrante Inferior Esquerdo" },
  
  // Quadrante Inferior Direito
  { value: "41", label: "41 - Incisivo Central", group: "Quadrante Inferior Direito" },
  { value: "42", label: "42 - Incisivo Lateral", group: "Quadrante Inferior Direito" },
  { value: "43", label: "43 - Canino", group: "Quadrante Inferior Direito" },
  { value: "44", label: "44 - 1º Pré-Molar", group: "Quadrante Inferior Direito" },
  { value: "45", label: "45 - 2º Pré-Molar", group: "Quadrante Inferior Direito" },
  { value: "46", label: "46 - 1º Molar", group: "Quadrante Inferior Direito" },
  { value: "47", label: "47 - 2º Molar", group: "Quadrante Inferior Direito" },
  { value: "48", label: "48 - 3º Molar (Siso)", group: "Quadrante Inferior Direito" },
];

export default function ToothSelection({ selectedTeeth, onTeethChange, onRemoveTooth }: ToothSelectionProps) {
  const [selectedToothValue, setSelectedToothValue] = useState<string>("");
  const { toast } = useToast();

  const addTooth = () => {
    if (!selectedToothValue) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um dente",
        variant: "destructive",
      });
      return;
    }

    if (selectedTeeth.find(tooth => tooth.number === selectedToothValue)) {
      toast({
        title: "Erro",
        description: "Este dente já foi selecionado",
        variant: "destructive",
      });
      return;
    }

    const toothInfo = PERMANENT_TEETH.find(tooth => tooth.value === selectedToothValue);
    if (!toothInfo) return;

    const newTooth = {
      number: selectedToothValue,
      name: toothInfo.label,
      id: `tooth_${selectedToothValue}_${Date.now()}`,
    };

    onTeethChange([...selectedTeeth, newTooth]);
    setSelectedToothValue("");
  };

  const groupedTeeth = PERMANENT_TEETH.reduce((acc, tooth) => {
    if (!acc[tooth.group]) {
      acc[tooth.group] = [];
    }
    acc[tooth.group].push(tooth);
    return acc;
  }, {} as Record<string, typeof PERMANENT_TEETH>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <img src="/tooth-selection-icon.png" alt="Logo" className="w-5 h-5" />
            Seleção de Dentes
          </CardTitle>
          <span className="text-sm text-gray-500">Dentes permanentes (11-48)</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Dente
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedToothValue} onValueChange={setSelectedToothValue}>
              <SelectTrigger className="flex-1 focus:ring-burgundy-500 focus:border-burgundy-500">
                <SelectValue placeholder="Escolha um dente..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedTeeth).map(([group, teeth]) => (
                  <div key={group}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-50">
                      {group}
                    </div>
                    {teeth.map((tooth) => (
                      <SelectItem key={tooth.value} value={tooth.value}>
                        {tooth.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button"
              onClick={addTooth}
              className="bg-burgundy-500 hover:bg-burgundy-600 text-white"
            >
              <Plus className="mr-2" size={16} />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Selected Utensils Display */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Dentes Selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTeeth.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum dente selecionado</p>
            ) : (
              selectedTeeth.map((tooth) => (
                <Badge
                  key={tooth.id}
                  variant="secondary"
                  className="bg-burgundy-50 text-burgundy-700 border-burgundy-200 hover:bg-burgundy-100 flex items-center gap-2 px-3 py-1"
                >
                  <img src="/favicon.ico" alt="Dente" className="w-3.5 h-3.5" />
                  {tooth.name}
                  <button
                    type="button"
                    onClick={() => onRemoveTooth(tooth.id)}
                    className="ml-1 text-burgundy-500 hover:text-burgundy-700"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
