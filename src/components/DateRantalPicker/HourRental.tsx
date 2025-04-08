// CustomRangePicker.tsx
"use client";
import { DatePicker, GetProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;


interface CustomRangePickerProps {
  onChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDate: RangePickerProps["disabledDate"] = (
  current,
  selectedDates
) => {
  const today = dayjs().startOf("day");

  if (!selectedDates || !selectedDates.from) {
    return current && current.isBefore(today, "day");
  }

  const selectedDate = selectedDates.from;
  return current && !current.isSame(selectedDate, "day");
};

const disabledRangeTime = (date: Dayjs | null, type: "start" | "end") => {
  const today = dayjs().startOf("day");
  const currentHour = dayjs().hour();

  if (!date) {
    return {
      disabledHours: () =>
        range(0, 24).filter((hour) => hour < 8 || hour >= 21),
    };
  }

  if (date.isSame(today, "day")) {
    return {
      disabledHours: () =>
        range(0, 24).filter(
          (hour) => hour < 8 || hour < currentHour || hour >= 21
        ),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === currentHour) {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            if (i <= dayjs().minute()) {
              minutes.push(i);
            }
          }
          return minutes;
        }
        return [];
      },
      disabledSeconds: () => [],
    };
  } else {
    return {
      disabledHours: () =>
        range(0, 24).filter((hour) => hour < 8 || hour >= 21),
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
};

const CustomRangePicker: React.FC<CustomRangePickerProps> = ({ onChange }) => {
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedDates(dates);
    onChange(dates);
  };

  return (
    <RangePicker
      disabledDate={disabledDate}
      disabledTime={disabledRangeTime}
      showTime={{
        format: "HH",
        defaultValue: [dayjs("08:00", "HH"), dayjs("22:00", "HH")],
      }}
      minuteStep={10}
      format="YYYY-MM-DD HH:mm"
      onChange={handleDateChange}
    />
  );
};

export default CustomRangePicker;
