import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

export default function Page(props) {
    console.log('Page props:', props);
    const [title, setTitle] = useState(props.content?.title ?? '');
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: props.content.content || {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{
                        type: 'text',
                        text: 'write here...'
                    }]
                },
            ],
        },
        editable: props.editormode
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(props.editormode);
        }
    }, [editor, props.editormode]);

    useEffect(() => {
        setTitle(props.content?.title ?? '');
    }, [props.content]);

    useEffect(() => {
        if (editor && props.content?.content) {
            editor.commands.setContent(props.content.content, false);
        }
    }, [editor, props.content?.document_id, props.content?.content]);

    const handleContentUpdate = () => {
        if (editor) {
            const jsonContent = editor.getJSON();
            const document ={...props.content, content: jsonContent, title: title}; 
            console.log('Updated content:', document);
            props.onContentUpdate(document);
        }
    };

    return (
        <div>
            {props.selectedDocumentId ? <div>
            {!props.editormode && props.currentUserHasEditPermission && <button onClick={() => props.onToggleEditor()}>Edit</button>}
            {props.editormode && <div>
                <button onClick={props.onToggleEditor}>View</button>
                <button onClick={() => handleContentUpdate()}>Save</button>
            </div>}
            {!props.editormode && <div>
                <h2>{title}</h2>
                <EditorContent editor={editor} />
            </div>}
            {props.editormode && <div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                <button onClick={() => handleContentUpdate()}>Save</button>
                <div>
                    <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
                    <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear Marks</button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
                </div>
                <EditorContent editor={editor} />
            </div>}
            </div>
            : <p>No Document Selected</p>}
        </div>
    );
}