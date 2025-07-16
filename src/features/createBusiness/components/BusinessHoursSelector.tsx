import { Button } from "@/shared/components/shadcn/button";
import { Label } from "@/shared/components/shadcn/label";
import { Switch } from "@/shared/components/shadcn/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/shadcn/select";
import type { BusinessHours } from "../types/business.types";

interface BusinessHoursSelectorProps {
  businessHours: BusinessHours;
  onChange: (businessHours: BusinessHours) => void;
}

const daysOfWeek = [
  { key: "monday" as const, label: "Lunes" },
  { key: "tuesday" as const, label: "Martes" },
  { key: "wednesday" as const, label: "Miércoles" },
  { key: "thursday" as const, label: "Jueves" },
  { key: "friday" as const, label: "Viernes" },
  { key: "saturday" as const, label: "Sábado" },
  { key: "sunday" as const, label: "Domingo" },
];

// Generar opciones de tiempo en intervalos de 30 minutos
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      const ampm = hour < 12 ? "AM" : "PM";
      const displayTime = `${displayHour}:${displayMinute} ${ampm}`;

      times.push({
        value: timeString,
        label: displayTime,
      });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export default function BusinessHoursSelector({ businessHours, onChange }: BusinessHoursSelectorProps) {
  const handleDayToggle = (day: keyof BusinessHours, isClosed: boolean) => {
    const newBusinessHours = { ...businessHours };

    if (isClosed) {
      newBusinessHours[day] = { closed: true };
    } else {
      newBusinessHours[day] = {
        open: "09:00",
        close: "18:00",
      };
    }

    onChange(newBusinessHours);
  };

  const handleTimeChange = (day: keyof BusinessHours, timeType: "open" | "close", value: string) => {
    const newBusinessHours = { ...businessHours };

    if (!newBusinessHours[day].closed) {
      newBusinessHours[day] = {
        ...newBusinessHours[day],
        [timeType]: value,
      };
      onChange(newBusinessHours);
    }
  };

  const copyToAllDays = (sourceDay: keyof BusinessHours) => {
    const sourceHours = businessHours[sourceDay];
    const newBusinessHours = { ...businessHours };

    daysOfWeek.forEach(({ key }) => {
      if (key !== sourceDay) {
        newBusinessHours[key] = { ...sourceHours };
      }
    });

    onChange(newBusinessHours);
  };

  const formatTimeDisplay = (time: string) => {
    const timeOption = timeOptions.find((option) => option.value === time);
    return timeOption ? timeOption.label : time;
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map(({ key, label }) => {
        const dayHours = businessHours[key];
        const isClosed = dayHours?.closed || false;

        return (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-20">
                <Label className="font-medium">{label}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={!isClosed} onCheckedChange={(checked) => handleDayToggle(key, !checked)} />
                <Label className="text-sm text-gray-600">{isClosed ? "Cerrado" : "Abierto"}</Label>
              </div>

              {!isClosed && (
                <div className="flex items-center space-x-2">
                  <div>
                    <Label className="text-xs text-gray-500">Apertura</Label>
                    <Select
                      value={dayHours?.open || "09:00"}
                      onValueChange={(value) => handleTimeChange(key, "open", value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue>{formatTimeDisplay(dayHours?.open || "09:00")}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-gray-400">-</span>
                  <div>
                    <Label className="text-xs text-gray-500">Cierre</Label>
                    <Select
                      value={dayHours?.close || "18:00"}
                      onValueChange={(value) => handleTimeChange(key, "close", value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue>{formatTimeDisplay(dayHours?.close || "18:00")}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {!isClosed && (
              <Button size="sm" variant="outline" onClick={() => copyToAllDays(key)} className="ml-2 text-xs">
                Copiar a todos
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
} 