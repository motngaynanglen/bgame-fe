"use client";
import React, { useRef, useState } from "react";
import { Tabs, TabsProps } from "antd";
import POSComponent from "../POS/POSComponent";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface CustomTabsProps extends Omit<TabsProps, "items"> {
  tabItems: {
    label: React.ReactNode;
    children: React.ReactNode;
    key: string;
    closable?: boolean;
  }[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabItems, ...rest }) => {
  const [activeKey, setActiveKey] = useState(tabItems[0].key);
  const [items, setItems] = useState(tabItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: `Hóa đơn ${newTabIndex.current + 1}`,
      children: <POSComponent />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
      {...rest}
    />
  );
};

export default CustomTabs;
