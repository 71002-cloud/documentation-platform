export default function TableOfContents(props) {
    const documententTitles = props.documententTitles || [];
    const displayTitles = documententTitles.map((title, index) => (
        <li key={index}>{title}</li>
    ));

    return (
        <div>
            <h2>Table of Contents</h2>
            <ul>
                {displayTitles}
            </ul>
        </div>
    );
}