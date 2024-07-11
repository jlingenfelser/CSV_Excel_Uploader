export interface GridCellProps {
    data: any;
    onDragStart: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
  }
  
  export interface GridProps {
    data: any[][];
  }
  
  export interface DragAndDropProps {
    setData: (data: any[][]) => void;
  }
  