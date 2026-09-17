import TableOfContents from "../components/TableOfContens";
import ProjectHeader from "../components/ProjectHeader";
import Page from "../components/Page";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getProjectDocuments, getDocument, createDocument, updateDocument, getProjectMembers } from "../api/projects.js";

export default function ProjectPage() {
    const [currentProjectId, setCurrentProjectId] = useState(sessionStorage.getItem('currentProjectId'));
    const [currentProject, setCurrentProject] = useState(JSON.parse(sessionStorage.getItem('currentProject')));
    const [documents, setDocuments] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [content, setContent] = useState('');
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    const [editormode, setEditormode] = useState(false);

    const currentUserIsOwner = members.some((member) => (
        member.user_id === currentUser?.id && member.role === 'owner'
    ));

    const currentUserHasEditPermission = members.some((member) => (
        member.user_id === currentUser?.id && (member.role === 'owner' || member.role === 'editor')
    ));

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            navigate('/login');
        }
        if (!sessionStorage.getItem('currentProjectId')) {
            navigate('/projects');
        }

        if (!sessionStorage.getItem('currentProject')) {
            navigate('/projects');
        }

        setCurrentProjectId(sessionStorage.getItem('currentProjectId'));
        setCurrentProject(JSON.parse(sessionStorage.getItem('currentProject')));
    }, []);

    useEffect(() => {
        async function getTitles(projectId) {
            try {
                const result = await getProjectDocuments(projectId);
                const projectDocuments = Array.isArray(result) ? result : [];

                if (projectDocuments.length === 0) {
                    console.log('No documents found for the project.');
                    setDocuments([]);
                    return;
                }

                const sortedDocuments = [...projectDocuments].sort(
                    (a, b) => a.order_index - b.order_index
                );
                setDocuments(sortedDocuments);
            } catch (error) {
                console.error('Error fetching project documents:', error);
                setDocuments([]);
            }
        }

        if (currentProjectId) {
            getTitles(currentProjectId);
        } else {
            setDocuments([]);
        }
    }, [currentProjectId]);

    useEffect(() => {
        async function loadMembers(projectId) {
            try {
                const result = await getProjectMembers(projectId);
                setMembers(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('Error fetching project members:', error);
                setMembers([]);
            }
        }

        if (currentProjectId) {
            loadMembers(currentProjectId);
        } else {
            setMembers([]);
        }
    }, [currentProjectId]);

    const handleDocumentClick = async (documentId) => {
        setSelectedDocumentId(documentId);
        const content = await getDocument(currentProjectId, documentId);
        setContent(content);
        console.log('Document content:', content);
    };

    const hanldeCreateDocument = async (order_index) => {
        const newDocument = await createDocument(currentProjectId, order_index);
        if (newDocument) {
            setDocuments([...documents, newDocument]);
        }
        setSelectedDocumentId(newDocument.document_id);
    };

    const handleDocumentUpdate = (updatedDocument) => {
        updateDocument(updatedDocument.project_id, updatedDocument.document_id, updatedDocument.title, updatedDocument.content);
        const updatedDocuments = documents.map((doc) =>
            doc.document_id === updatedDocument.document_id ? updatedDocument : doc
        );
        setDocuments(updatedDocuments);
    }

    const handleToggleEditor = () => {
        console.log('Toggling editor mode. Current state:', editormode);
        setEditormode(!editormode);
    };

    return (
        <div>
            <ProjectHeader
                project={currentProject}
                currentUser={currentUser}
                currentUserIsOwner={currentUserIsOwner}
                members={members}
                setMembers={setMembers}
            />
            <div style={{ display: 'flex' }}>
                <TableOfContents documentsInfo={documents} onDocumentClick={handleDocumentClick} onCreateDocument={hanldeCreateDocument} />
                <Page
                    selectedDocumentId={selectedDocumentId}
                    content={content}
                    onContentUpdate={handleDocumentUpdate}
                    currentUser={currentUser}
                    currentUserHasEditPermission={currentUserHasEditPermission}
                    editormode={editormode}
                    onToggleEditor={handleToggleEditor}
                />
            </div>
        </div>
    );
}