interface CanvazNode {
  type: string;
  props: {
    [key: string]: any;
    key?: string;
    children?: string | CanvazNode[];
  };
}

interface CanvazConfig {
  label?: string;
  accept?: React.ComponentType<any>[];
  controllable?: boolean;
}
