import { MRT_RowData, MRT_TableOptions } from 'mantine-react-table';

export type OnCreatingRowSave<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['onCreatingRowSave']
>;

export type RenderRowActions<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['renderRowActions']
>;
export type RenderTopToolbarCustomActions<T extends MRT_RowData> = NonNullable<
  MRT_TableOptions<T>['renderTopToolbarCustomActions']
>;
