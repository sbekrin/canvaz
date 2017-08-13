import {
  unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer,
  unmountComponentAtNode,
} from 'react-dom';

export default class Portal {
  node: HTMLDivElement | null = null;
  instance: React.Component<any>;

  constructor(instance: React.Component<any>) {
    this.instance = instance;
    this.mount();
  }

  mount() {
    const node = document.createElement('div');
    node.setAttribute('data-canvaz', 'true');
    document.body.appendChild(node);
    this.node = node;
  }

  render(element: React.ReactElement<any>) {
    if (!this.node) {
      throw new Error('Canvaz: mount Portal before rendering to it');
    }

    renderSubtreeIntoContainer(this.instance, element, this.node);
  }

  unmount() {
    unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
    this.node = null;
  }
}
