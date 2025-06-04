"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Typography from "@tiptap/extension-typography";
import { useEffect, useState, forwardRef } from "react";
import { Button, Select, Space, Input, Modal, Tooltip } from "antd";
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, OrderedListOutlined, UnorderedListOutlined, RedoOutlined, UndoOutlined, LinkOutlined, PictureOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from "@ant-design/icons";


interface TipTapEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    isReadonly?: boolean;
}


const TipTapEditor = forwardRef<HTMLDivElement, TipTapEditorProps>(({ value = "", onChange, isReadonly }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            BulletList,
            OrderedList,
            ListItem,
            Typography,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                spellcheck: 'false',
            },
        },
        injectCSS: false,
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!isMounted || !editor) return null;

    return (
        <div ref={ref} className="border rounded-md p-2">
            {/* Toolbar */}
            <Space className="mb-2">
                <Button type={editor.isActive('bold') ? 'primary' : 'default'}
                    icon={<BoldOutlined />} onClick={() => editor.chain().focus().toggleBold().run()} />
                <Button type={editor.isActive('italic') ? 'primary' : 'default'}
                    icon={<ItalicOutlined />} onClick={() => editor.chain().focus().toggleItalic().run()} />
                <Button type={editor.isActive('underline') ? 'primary' : 'default'}
                    icon={<UnderlineOutlined />} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                <Button
                    icon={<UnorderedListOutlined />}
                    type={editor.isActive('bulletList') ? 'primary' : 'default'}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />

                <Button
                    icon={<OrderedListOutlined />}
                    type={editor.isActive('orderedList') ? 'primary' : 'default'}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
                <Select
                    defaultValue="black"
                    style={{ width: 120 }}
                    onChange={(color) => editor.chain().focus().setColor(color).run()}
                >
                    <Select.Option value="black">Black</Select.Option>
                    <Select.Option value="red">Red</Select.Option>
                    <Select.Option value="blue">Blue</Select.Option>
                    <Select.Option value="green">Green</Select.Option>
                </Select>
                <Space>
                    <Tooltip title="Căn trái">
                        <Button
                            icon={<AlignLeftOutlined />}
                            type={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        />
                    </Tooltip>

                    <Tooltip title="Căn giữa">
                        <Button
                            icon={<AlignCenterOutlined />}
                            type={editor.isActive({ textAlign: "center" }) ? "primary" : "default"}
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        />
                    </Tooltip>

                    <Tooltip title="Căn phải">
                        <Button
                            icon={<AlignRightOutlined />}
                            type={editor.isActive({ textAlign: "right" }) ? "primary" : "default"}
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        />
                    </Tooltip>


                </Space>
                <Button icon={<UndoOutlined />} onClick={() => editor.chain().focus().undo().run()} />
                <Button icon={<RedoOutlined />} onClick={() => editor.chain().focus().redo().run()} />
            </Space>

            {/* Editor Content */}
            <div className="tiptap-editor-wrapper">
                <EditorContent editor={editor} className="border p-2 min-h-[150px] rounded-md" />
                <style>
                    {`
        .tiptap-editor-wrapper .ProseMirror,
        .tiptap-editor-wrapper .ProseMirror * {
          all: revert;
          box-sizing: border-box;
        }
      `}
                </style>
            </div>
        </div>
    );
});

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;
