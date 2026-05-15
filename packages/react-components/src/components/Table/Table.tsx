import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export type TableCellFormat = 'numeric';

type BaseTableCell = {
  /**
   * Cell content rendered inside the table.
   */
  content: React.ReactNode;
  /**
   * Optional numeric alignment modifier.
   */
  format?: TableCellFormat;
  /**
   * Optional colspan passed to the rendered cell.
   */
  colSpan?: number;
  /**
   * Optional rowspan passed to the rendered cell.
   */
  rowSpan?: number;
};

export type TableHeadCell = BaseTableCell;

export interface TableCell extends BaseTableCell {
  /**
   * Optional label used for the stacked mobile presentation in responsive tables.
   * If omitted, string content from the matching `head` cell is used when possible.
   */
  header?: string;
}

export interface TableProps
  extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'children' | 'ref'> {
  /**
   * Visible caption shown above the table and announced as the table title.
   */
  caption?: React.ReactNode;
  /**
   * Optional header row content for the table.
   */
  head?: TableHeadCell[];
  /**
   * Required row data for the table body.
   */
  rows: TableCell[][];
  /**
   * When true, the first cell in each non-responsive body row is rendered as a row header.
   */
  firstCellIsHeader?: boolean;
  /**
   * When true, the table uses the stacked multi-column mobile layout from the toolkit.
   */
  responsive?: boolean;
  /**
   * Additional toolkit-style classes for the table element.
   */
  classes?: string;
  /**
   * Ref forwarding for the underlying table element.
   */
  ref?: React.Ref<HTMLTableElement>;
}

const getResponsiveHeader = (
  cell: TableCell,
  headCell?: TableHeadCell,
) => {
  if (cell.header) {
    return cell.header;
  }

  if (
    typeof headCell?.content === 'string' ||
    typeof headCell?.content === 'number'
  ) {
    return String(headCell.content);
  }

  return '';
};

const getCellClassName = (format?: TableCellFormat) =>
  joinClasses('ofh-table__cell', format && `ofh-table__cell--${format}`);

const getHeaderClassName = (format?: TableCellFormat) =>
  joinClasses('ofh-table__header', format && `ofh-table__header--${format}`);

export const Table = ({
  caption,
  head,
  rows,
  firstCellIsHeader = false,
  responsive = false,
  classes = '',
  className = '',
  ref,
  ...props
}: TableProps) => {
  return (
    <table
      {...props}
      ref={ref}
      role={responsive ? 'table' : undefined}
      className={joinClasses(
        responsive ? 'ofh-table-responsive' : 'ofh-table',
        classes,
        className,
      )}
    >
      {caption !== undefined && caption !== null ? (
        <caption className="ofh-table__caption">{caption}</caption>
      ) : null}
      {head?.length ? (
        <thead
          className="ofh-table__head"
          role={responsive ? 'rowgroup' : undefined}
        >
          <tr
            className="ofh-table__row"
            role={responsive ? 'row' : undefined}
          >
            {head.map((cell, index) => (
              <th
                key={`head-${index}`}
                role={responsive ? 'columnheader' : undefined}
                className={getHeaderClassName(cell.format)}
                scope="col"
                colSpan={cell.colSpan}
                rowSpan={cell.rowSpan}
              >
                {cell.content}
              </th>
            ))}
          </tr>
        </thead>
      ) : null}
      <tbody className="ofh-table__body">
        {rows.map((row, rowIndex) => (
          <tr
            key={`row-${rowIndex}`}
            className="ofh-table__row"
            role={responsive ? 'row' : undefined}
          >
            {responsive
              ? row.map((cell, cellIndex) => (
                  <td
                    key={`row-${rowIndex}-cell-${cellIndex}`}
                    role="cell"
                    className={getCellClassName(cell.format)}
                    colSpan={cell.colSpan}
                    rowSpan={cell.rowSpan}
                  >
                    <span className="ofh-table-responsive__heading">
                      {getResponsiveHeader(cell, head?.[cellIndex])}
                    </span>
                    <span className="ofh-table-responsive__content">
                      {cell.content}
                    </span>
                  </td>
                ))
              : row.map((cell, cellIndex) => {
                  if (cellIndex === 0 && firstCellIsHeader) {
                    return (
                      <th
                        key={`row-${rowIndex}-cell-${cellIndex}`}
                        className={getHeaderClassName(cell.format)}
                        scope="row"
                        colSpan={cell.colSpan}
                        rowSpan={cell.rowSpan}
                      >
                        {cell.content}
                      </th>
                    );
                  }

                  return (
                    <td
                      key={`row-${rowIndex}-cell-${cellIndex}`}
                      className={getCellClassName(cell.format)}
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                    >
                      {cell.content}
                    </td>
                  );
                })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.displayName = 'Table';
