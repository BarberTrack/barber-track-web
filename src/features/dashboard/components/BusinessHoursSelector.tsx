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
import type { BusinessHours, BusinessHourDay } from "../types/business.type";

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

export const BusinessHoursSelector = ({ businessHours, onChange }: BusinessHoursSelectorProps) => {
  const handleDayToggle = (day: keyof BusinessHours, isClosed: boolean) => {
    const newBusinessHours = { ...businessHours };

    if (isClosed) {
      newBusinessHours[day] = { closed: true } as BusinessHourDay;
    } else {
      newBusinessHours[day] = {
        open: "09:00",
        close: "18:00",
      } as BusinessHourDay;
    }

    onChange(newBusinessHours);
  };

  const handleTimeChange = (day: keyof BusinessHours, timeType: "open" | "close", value: string) => {
    const newBusinessHours = { ...businessHours };
    const currentDay = newBusinessHours[day];

    if (!("closed" in currentDay)) {
      newBusinessHours[day] = {
        ...currentDay,
        [timeType]: value,
      } as BusinessHourDay;
      onChange(newBusinessHours);
    }
  };

  const copyToAllDays = (sourceDay: keyof BusinessHours) => {
    const sourceHours = businessHours[sourceDay];
    const newBusinessHours = { ...businessHours };

    daysOfWeek.forEach(({ key }) => {
      if (key !== sourceDay) {
        newBusinessHours[key] = { ...sourceHours } as BusinessHourDay;
      }
    });

    onChange(newBusinessHours);
  };

  const formatTimeDisplay = (time: string) => {
    const timeOption = timeOptions.find((option) => option.value === time);
    return timeOption ? timeOption.label : time;
  };

  const getDayHours = (dayHours: BusinessHourDay) => {
    if ("closed" in dayHours) {
      return { open: "09:00", close: "18:00", isClosed: true };
    }
    return { open: dayHours.open, close: dayHours.close, isClosed: false };
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map(({ key, label }) => {
        const { open, close, isClosed } = getDayHours(businessHours[key]);

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
                      value={open}
                      onValueChange={(value) => handleTimeChange(key, "open", value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue>{formatTimeDisplay(open)}</SelectValue>
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
                      value={close}
                      onValueChange={(value) => handleTimeChange(key, "close", value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue>{formatTimeDisplay(close)}</SelectValue>
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
}; 