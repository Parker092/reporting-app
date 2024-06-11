import { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';

function TableComponent({ data }) {
  // Genera columnas dinámicamente a partir de las claves del primer objeto de datos, si existe
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.map(key => ({
      Header: key,
      accessor: key
    }));
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
  } = useTable({ columns, data }, useGlobalFilter);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
  };

  return (
    <div>
      <input
        value={state.globalFilter || ""}
        onChange={handleFilterChange}
        placeholder="Buscar en la tabla..."
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
