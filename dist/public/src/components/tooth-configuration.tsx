import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Trash2, Smile } from "lucide-react";
import { ToothConfiguration as ToothConfigType } from "@shared/schema";

interface ToothConfigurationProps {
  tooth: { number: string; name: string; id: string };
  configuration: Partial<ToothConfigType>;
  onConfigurationChange: (config: Partial<ToothConfigType>) => void;
  onRemove: () => void;
}

const COLORS = ["A1", "A2", "A3", "BL1", "BL2", "BL3", "BL4"];
const MATERIALS = [
  { value: "zirconia", label: "Zircônia" },
  { value: "pmma", label: "PMMA" },
  { value: "dissilicato", label: "Dissilicato" },
];

const WORK_CATEGORIES = [
  { value: "faceta", label: "Faceta" },
  { value: "onlay", label: "Onlay" },
  { value: "sob_implante", label: "Sob Implante" },
  { value: "sob_dente", label: "Sob dente" },
  { value: "placa_mio", label: "Placa mio" },
];

const IMPLANT_TYPES = [
  { value: "pilar_gt", label: "Pilar GT" },
  { value: "munhao_universal_33x6", label: "Munhão Universal 3.3x6" },
  { value: "munhao_universal_33x4", label: "Munhão Universal 3.3x4" },
  { value: "he_41", label: "HE 4.1" },
  { value: "mini_pilar_sirona", label: "Mini pilar Sirona" },
];

const FIXATION_TYPES = [
  { value: "unitaria", label: "Unitária" },
  { value: "protocolo", label: "Protocolo" },
];

const TOOTH_SHAPES = [
  { value: "redondo", label: "Redondo" },
  { value: "quadrado", label: "Quadrado" },
  { value: "pontudo", label: "Pontudo" },
];

export default function ToothConfiguration({ 
  tooth, 
  configuration, 
  onConfigurationChange, 
  onRemove 
}: ToothConfigurationProps) {
  const [localConfig, setLocalConfig] = useState<Partial<ToothConfigType>>(configuration);

  useEffect(() => {
    setLocalConfig(configuration);
  }, [configuration]);

  const updateConfig = (updates: Partial<ToothConfigType>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onConfigurationChange(newConfig);
  };

  const showImplantFields = localConfig.workCategory === "sob_implante";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <Settings className="text-burgundy-500" size={20} />
            Configuração - {tooth.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tipo de Trabalho (Provisório/Definitivo) */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Tipo de Trabalho</Label>
            <RadioGroup
              value={localConfig.workType || ""}
              onValueChange={(value) => updateConfig({ workType: value as "provisorio" | "definitivo" })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="provisorio" id="provisorio" className="text-burgundy-500" />
                <Label htmlFor="provisorio" className="text-sm">Provisório</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="definitivo" id="definitivo" className="text-burgundy-500" />
                <Label htmlFor="definitivo" className="text-sm">Definitivo</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Material */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Material</Label>
            <Select
              value={localConfig.material || ""}
              onValueChange={(value) => updateConfig({ material: value as any })}
            >
              <SelectTrigger className="focus:ring-burgundy-500 focus:border-burgundy-500">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {MATERIALS.map((material) => (
                  <SelectItem key={material.value} value={material.value}>
                    {material.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cor do Dente */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Cor do Dente</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <label
                  key={color}
                  className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    localConfig.color === color
                      ? "bg-burgundy-50 border-burgundy-500 text-burgundy-700"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`color_${tooth.id}`}
                    value={color}
                    checked={localConfig.color === color}
                    onChange={() => updateConfig({ color: color as any })}
                    className="sr-only"
                  />
                  <span className="text-xs font-medium">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo do Trabalho */}
          <div className="md:col-span-2 lg:col-span-3">
            <Label className="text-sm font-medium mb-3 block">Tipo do Trabalho</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {WORK_CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    localConfig.workCategory === category.value
                      ? "bg-burgundy-50 border-burgundy-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`workCategory_${tooth.id}`}
                    value={category.value}
                    checked={localConfig.workCategory === category.value}
                    onChange={() => updateConfig({ workCategory: category.value as any })}
                    className="text-burgundy-500 focus:ring-burgundy-500 mr-2"
                  />
                  <span className="text-sm">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Campos condicionais para Implante */}
          {showImplantFields && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Smile className="text-burgundy-500 mr-2" size={16} />
                  Configurações do Implante
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tipo de Implante</Label>
                    <Select
                      value={localConfig.implantType || ""}
                      onValueChange={(value) => updateConfig({ implantType: value as any })}
                    >
                      <SelectTrigger className="focus:ring-burgundy-500 focus:border-burgundy-500">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {IMPLANT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tipo de Fixação</Label>
                    <Select
                      value={localConfig.fixationType || ""}
                      onValueChange={(value) => updateConfig({ fixationType: value as any })}
                    >
                      <SelectTrigger className="focus:ring-burgundy-500 focus:border-burgundy-500">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FIXATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Outras configurações */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="space-y-4">
              {/* Fixa */}
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`isFixed_${tooth.id}`}
                    checked={localConfig.isFixed || false}
                    onCheckedChange={(checked) => updateConfig({ isFixed: checked as boolean })}
                    className="text-burgundy-500"
                  />
                  <Label htmlFor={`isFixed_${tooth.id}`} className="text-sm font-medium">
                    Fixa?
                  </Label>
                </div>
                {localConfig.isFixed && (
                  <div className="mt-2">
                    <Input
                      placeholder="Quais dentes estarão conectados?"
                      value={localConfig.connectedTeeth || ""}
                      onChange={(e) => updateConfig({ connectedTeeth: e.target.value })}
                      className="focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                    />
                  </div>
                )}
              </div>
              
              {/* Outras opções */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`mirrorTooth_${tooth.id}`}
                    checked={localConfig.mirrorTooth || false}
                    onCheckedChange={(checked) => updateConfig({ mirrorTooth: checked as boolean })}
                    className="text-burgundy-500"
                  />
                  <Label htmlFor={`mirrorTooth_${tooth.id}`} className="text-sm">
                    Espelhar dente
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`standardLibrary_${tooth.id}`}
                    checked={localConfig.standardLibrary || false}
                    onCheckedChange={(checked) => updateConfig({ standardLibrary: checked as boolean })}
                    className="text-burgundy-500"
                  />
                  <Label htmlFor={`standardLibrary_${tooth.id}`} className="text-sm">
                    Seguir dente de biblioteca padrão
                  </Label>
                </div>
              </div>
              
              {/* Formato do dente */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Formato do dente</Label>
                <RadioGroup
                  value={localConfig.toothShape || ""}
                  onValueChange={(value) => updateConfig({ toothShape: value as any })}
                  className="flex space-x-4"
                >
                  {TOOTH_SHAPES.map((shape) => (
                    <div key={shape.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={shape.value} id={shape.value} className="text-burgundy-500" />
                      <Label htmlFor={shape.value} className="text-sm">{shape.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Articulador */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Articulador</Label>
                <div className="flex items-center space-x-4">
                  <RadioGroup
                    value={localConfig.articulator ? "sim" : "nao"}
                    onValueChange={(value) => updateConfig({ articulator: value === "sim" })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="sim" className="text-burgundy-500" />
                      <Label htmlFor="sim" className="text-sm">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="nao" className="text-burgundy-500" />
                      <Label htmlFor="nao" className="text-sm">Não</Label>
                    </div>
                  </RadioGroup>
                  {localConfig.articulator && (
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        placeholder="mm"
                        value={localConfig.articulatorMM || ""}
                        onChange={(e) => updateConfig({ articulatorMM: Number(e.target.value) })}
                        className="w-20 text-sm focus:ring-burgundy-500 focus:border-burgundy-500"
                      />
                      <span className="text-sm text-gray-500">mm</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
