import {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
  MRT_TableOptions
} from 'mantine-react-table';
import { ReactNode, RefObject } from 'react';

export type OnCreatingRowSave<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['onCreatingRowSave']
>;

export type RenderRowActions<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['renderRowActions']
>;

export type RenderTopToolbarCustomActions<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['renderTopToolbarCustomActions']
>;

type MRT_Fields<T extends MRT_RowData> = {
  cell: MRT_Cell<T>;
  column: MRT_Column<T>;
  table: MRT_TableInstance<T>;
  row: MRT_Row<T>;
  renderedCellValue: ReactNode | number | string;
  renderedColumnIndex?: number;
  renderedRowIndex?: number;
  rowRef?: RefObject<HTMLTableRowElement>;
};

export type IMRT_Edit<T extends MRT_RowData> = Pick<
  MRT_Fields<T>,
  'cell' | 'column' | 'row' | 'table'
>;

export type IMRT_Cell<T extends MRT_RowData> = Pick<
  MRT_Fields<T>,
  | 'cell'
  | 'column'
  | 'row'
  | 'table'
  | 'renderedCellValue'
  | 'renderedColumnIndex'
  | 'renderedRowIndex'
  | 'rowRef'
>;
