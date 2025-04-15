"use client";
import POSComponent from "@/src/components/POS/POSComponent";
import CustomTabs from "@/src/components/Tabs/CustomTabs";

export default function POSPage() {
  return (
    <div>
      <CustomTabs
        tabItems={[
          {
            label: "Hóa đơn 1",
            children: <POSComponent />,
            key: "1",
          },
        ]}
      />
    </div>
  );
}
