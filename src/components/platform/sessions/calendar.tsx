import { Session } from "@/lib/types";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { daysOfWeek, formatDateString, months } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CalendarComponent({
  currentMonth,
  onMonthChange,
  onDateClick,
  allSessions,
}: {
  currentMonth: Date;
  onMonthChange: (direction: number) => void;
  onDateClick: (day: number) => void;
  allSessions: Session[];
}) {
  const getDaysInMonth = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = Array(startingDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentMonth]);

  const isDateInPast = (day: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return checkDate < today;
  };

  const hasSessionOnDate = (day: number): boolean => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateString = formatDateString(date);
    return allSessions.some((session) => session.date === dateString);
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border col-span-1 lg:col-span-2">
      <div className="mb-4">
        <h3 className="font-medium text-sm">BOOK MEETING</h3>
        <p className="text-xs text-textSubtitle">
          You can control availability by blocking any day
        </p>
      </div>

      <div className="flex items-center justify-center bg-[#F6F8FA] border border-[#00000033] w-fit mx-auto rounded-lg bg- mb-4">
        <Button variant="ghost" size="icon" onClick={() => onMonthChange(-1)}>
          <ChevronLeft className="w-4 h-4 text-textSubtitle" />
        </Button>
        <h4 className="font-medium text-textSubtitle text-xs">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <Button variant="ghost" size="icon" onClick={() => onMonthChange(1)}>
          <ChevronRight className="w-4 h-4 text-textSubtitle" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 px-8">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-center p-2 bg-bgWhiteGray rounded-full"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-8">
        {days.map((day, index) => {
          if (day === null) return <div key={index} className="h-8" />;

          const isPast = isDateInPast(day);
          const hasSession = hasSessionOnDate(day);
          const isToday =
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();

          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onDateClick(day)}
              disabled={isPast}
              className={`h-8 w-8 p-0 rounded-full font-medium mx-auto relative
                ${isPast ? "text-textSubtitle" : "text-black"}
                ${
                  hasSession
                    ? "bg-primaryBlue/10 text-primaryBlue hover:bg-primaryBlue/20"
                    : ""
                }
                ${isToday ? "ring-2 ring-blue-300" : ""}
              `}
            >
              {day}
              {hasSession && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-primaryBlue/80 rounded-full transform translate-x-1/2 translate-y-1/2"></span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
