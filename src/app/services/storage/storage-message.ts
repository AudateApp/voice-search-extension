export interface StorageMessage {
  type: 'save' | 'read' | 'read_all';
  key: string | null;
  value?: any;
}
