interface CanvazNode {
  type: string;
  props?: {
    [key: string]: any;
    key?: string;
  };
  children?: string | number | CanvazNode[];
}

interface CanvazConfig {
  label?: string;
  accept?: { [key: string]: React.ComponentType<any> };
  void?: boolean;
}
