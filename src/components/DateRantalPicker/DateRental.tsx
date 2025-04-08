// CustomDatePicker.tsx
"use client";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface CustomDatePickerProps {
  onChange: (date: Dayjs | null) => void;
}

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDate = (current: Dayjs) => {
  const today = dayjs().startOf("day");
  return current && current.isBefore(today, "day");
};

const disabledDateTime = (selectedDate?: dayjs.Dayjs) => {
  const today = dayjs();
  const currentHour = today.hour();

  return {
    disabledHours: () => {
      let hours = range(0, 24).filter((hour) => hour < 8 || hour >= 21);

      if (selectedDate && selectedDate.isSame(today, "day")) {
        hours = [...new Set([...hours, ...range(8, currentHour + 1)])];
      }

      return hours;
    },
    disabledMinutes: () => {
      if (
        selectedDate &&
        selectedDate.isSame(today, "day") &&
        today.hour() === 8
      ) {
        return range(0, today.minute());
      }
      return [];
    },
    disabledSeconds: () => {
      if (
        selectedDate &&
        selectedDate.isSame(today, "day") &&
        today.hour() === 8 &&
        today.minute() === 0
      ) {
        return range(0, today.second());
      }
      return [];
    },
  };
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <DatePicker
      format="YYYY-MM-DD HH"
      disabledDate={disabledDate}
      disabledTime={(value) => disabledDateTime(value || undefined)} // ✅ Dùng value thay vì state
      showTime={{ format: "HH" }}
      minuteStep={10}
      onChange={handleDateChange}
    />
  );
};

export default CustomDatePicker;
