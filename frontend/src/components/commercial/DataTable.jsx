export default function DataTable({ columns, data, onEdit, onDelete }) {
    return (
        <div className="commercial-table-wrap">
            <table className="commercial-table">
                <thead>
                <tr>
                    {columns.map((col) => <th key={col.key}>{col.label}</th>)}
                    {(onEdit || onDelete) && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.id || row.idCommercial || row.idContrat || row.idGrille || row.idClient}>
                        {columns.map((col) => (
                            <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td>
                                {onEdit && (
                                    <button className="commercial-btn-icon commercial-btn-edit" onClick={() => onEdit(row)}>
                                        Modifier
                                    </button>
                                )}
                                {onDelete && (
                                    <button className="commercial-btn-icon commercial-btn-delete" onClick={() => onDelete(row)}>
                                        Supprimer
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}