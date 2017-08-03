/* tslint:disable jsx-no-lambda */
import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import styles from './styles';
import withCanvaz, {
  RehydrationProvider,
  CanvazContainer,
  TextEditable,
} from '../src';

/*
 * Step 1:
 *
 * Define editor components. They are used
 * both for final rendering and while editing
 * content
 */
const Heading = withCanvaz({
  label: 'Heading',
})(({ id, children }) =>
  <TextEditable id={id}>
    <h2>
      {children}
    </h2>
  </TextEditable>
);

const Text = withCanvaz({
  label: 'Text',
})(({ id, children }: any) =>
  <TextEditable id={id}>
    <p>
      {children}
    </p>
  </TextEditable>
);

const Video = withCanvaz({
  label: 'YouTube Video',
  void: true,
})(({ videoId }) =>
  <div className="video">
    <YouTube videoId={videoId} />
  </div>
);

const Column = withCanvaz({
  label: 'Column',
  accept: [Heading, Text, Video],
})(({ children }) =>
  <div className="column">
    {children}
  </div>
);

const Layout = withCanvaz({
  label: 'Layout',
  accept: [Column],
})(({ children }) =>
  <div className="layout">
    {children}
  </div>
);

const Article = withCanvaz({
  label: 'Article',
  accept: [Heading, Text, Video, Layout],
})(({ id, title, description, children }) =>
  <article>
    <header>
      <TextEditable id={id} prop="title">
        <h1>
          {title}
        </h1>
      </TextEditable>
      <TextEditable id={id} prop="description">
        <p>
          {description}
        </p>
      </TextEditable>
    </header>
    <hr />
    <main>
      {children}
    </main>
  </article>
);

/**
 * Step 2:
 *
 * Create root editor component with some initial
 * data tree (e.g. JSON from server) and
 * provide set of components which required
 * to deserialize editor tree.
 */
class App extends React.Component<any> {
  render() {
    return (
      <div className={this.props.className}>
        <RehydrationProvider
          components={{ Article, Heading, Text, Video, Layout, Column }}
        >
          <CanvazContainer
            onChange={data => console.log(data)}
            edit={true}
            data={{
              type: 'Article',
              props: {
                title: 'Beautiful content starts with beautiful editor',
                description: [
                  'Everyone used to visual text editors.',
                  'They exists for a long time, but we need to move forward.',
                  'It should be easy and accessible for everyone to craft',
                  'content without special knowledge, with just right tool.',
                ].join(' '),
              },
              children: [
                { type: 'Heading', children: 'Switching to modular' },
                {
                  type: 'Text',
                  children: [
                    'Even though text-manipulation is intuitive,',
                    'it is limited. User interfaces are built with',
                    'component-based architecture nowadays, so why not adopt',
                    'it for content we make?',
                  ].join(' '),
                },
                {
                  type: 'Text',
                  children: [
                    'Go ahead and play around with this content.',
                    'You can edit any text with double click,',
                    'remove block by Delete or Backspace and drag-and-drop',
                    'components. Rollback your changes by Ctrl + Z or Cmd + Z.',
                  ].join(' '),
                },
                {
                  type: 'Heading',
                  children: 'Below is stuff for testing',
                },
                {
                  type: 'Layout',
                  children: [
                    {
                      type: 'Column',
                      children: [{ type: 'Text', children: 'Left Side' }],
                    },
                    {
                      type: 'Column',
                      children: [{ type: 'Text', children: 'Right Side' }],
                    },
                  ],
                },
                { type: 'Video', props: { videoId: 'YE7VzlLtp-4' } },
              ],
            }}
          />
        </RehydrationProvider>
      </div>
    );
  }
}

const StyledApp = styled(App)`${styles}`;

/**
 * Step 3:
 *
 * Render it!
 */
render(<StyledApp />, document.querySelector('[data-approot]'));
