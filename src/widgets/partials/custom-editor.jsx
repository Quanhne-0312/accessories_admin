import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ color: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
    ],
};

const formats = [
    'header',
    'bold',
    'color',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'align',
    'indent',
    'link',
    'image',
];
export function CustomEditor({ value, onChange }) {
    const ref = useRef(null);

    // Disable spellcheck as component is mounted
    useEffect(() => {
        ref.current.editor.root.setAttribute('spellcheck', 'false');
        ref.current.focus();
    }, []);

    return (
        <div>
            <Quill ref={ref} theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
        </div>
    );
}

CustomEditor.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
};

export default CustomEditor;
