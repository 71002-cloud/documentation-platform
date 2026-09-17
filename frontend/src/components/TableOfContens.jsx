export default function TableOfContents(props) {
    const mappedDocuments = props.documentsInfo.map((document) => (
        <li key={document.document_id} onClick={() => props.onDocumentClick(document.document_id)}>
            {document.title}
        </li>
    ));

    return (
        <div>
            <h2>Table of Contents</h2>
            <ul>
                {mappedDocuments}
                <p onClick={() => props.onCreateDocument(props.documentsInfo.length === 0 ? 0 :props.documentsInfo.length)}>+ new document</p>
            </ul>
        </div>
    );
}