"use client";
import React, { useRef, useState, useEffect } from "react";
import { Tabs, TabsProps } from "antd";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface CustomTabsProps extends Omit<TabsProps, "items"> {
  tabItems?: {
    label: React.ReactNode;
    children?: React.ReactNode;
    key: string;
    closable?: boolean;
  }[];
  onTabAdd?: () => void;
  onTabRemove?: (key: string) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ 
  tabItems = [], 
  onTabAdd,
  onTabRemove,
  ...rest 
}) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [items, setItems] = useState(tabItems);
  const newTabIndex = useRef(0);

  useEffect(() => {
    setItems(tabItems);
    if (tabItems.length > 0 && !tabItems.some(item => item.key === activeKey)) {
      setActiveKey(tabItems[0].key);
    }
  }, [tabItems, activeKey]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    onTabAdd?.();
  };

  const remove = (targetKey: TargetKey) => {
    const key = typeof targetKey === 'string' ? targetKey : '';
    onTabRemove?.(key);
  };

  const onEdit = (
    targetKey: TargetKey,
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