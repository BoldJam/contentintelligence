'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { useEffect } from 'react';
import {
    Bold, Italic, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, Minus,
} from 'lucide-react';
import { useProduct } from '@/lib/productContext';

interface TiptapEditorProps {
    content: string;
    onChange: (markdown: string) => void;
    editable: boolean;
}

export default function TiptapEditor({ content, onChange, editable }: TiptapEditorProps) {
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
        ],
        content,
        contentType: 'markdown',
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getMarkdown());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    useEffect(() => {
        if (editor && content !== editor.getMarkdown()) {
            editor.commands.setContent(content, { emitUpdate: false, contentType: 'markdown' });
        }
    }, [editor, content]);

    if (!editor) return null;

    const ToolbarButton = ({
        onClick,
        isActive,
        children,
        title,
    }: {
        onClick: () => void;
        isActive: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                isActive
                    ? (isFundBuzz ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-blue-400')
                    : (isFundBuzz ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700' : 'text-gray-400 hover:bg-white/10 hover:text-white')
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            {editable && (
                <div className={`flex items-center gap-0.5 px-2 py-1.5 border-b ${
                    isFundBuzz ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'
                }`}>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>

                    <div className={`w-px h-5 mx-1 ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </ToolbarButton>

                    <div className={`w-px h-5 mx-1 ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Ordered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>

                    <div className={`w-px h-5 mx-1 ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Blockquote"
                    >
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        isActive={false}
                        title="Horizontal Rule"
                    >
                        <Minus className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                <EditorContent
                    editor={editor}
                    className={`h-full tiptap-editor ${isFundBuzz ? 'tiptap-light' : 'tiptap-dark'}`}
                />
            </div>
        </div>
    );
}
