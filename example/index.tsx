/* tslint:disable jsx-no-lambda */
import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import YouTube from 'react-youtube';
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
                title: 'Canvaz',
                description: `
                This is an example of Canvaz in action. 
                Go ahead and change content around. 
                You can also edit heading and this description by double click!
                `,
              },
              children: [
                { type: 'Heading', children: 'Some sample heading' },
                { type: 'Text', children: 'Sample paragraph in this article' },
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

const StyledApp = styled(App)`
  -webkit-font-smoothing: antialiased;
  font-family: sans-serif;

  input {
    margin: 0;
  }

  article {
    margin: 60px auto;
    max-width: 700px;
  }

  hr {
    border: none;
    height: 1px;
    background-color: #ddd;
  }

  header {
    h1 {
      font-size: 50px;
      font-weight: bold;
      margin: 0;
    }

    p {
      font-size: 20px;
      line-height: 1.5;
      color: #999;
    }
  }

  main {
    h2 {
      font-weight: bold;
      padding: 10px;
    }

    p {
      font-size: 20px;
      padding: 10px;
    }

    .video {
      text-align: center;
    }

    .layout {
      margin: 30px 0;
      display: flex;

      .column {
        flex: 1;

        &:first-of-type {
          margin-right: 10px;
        }

        &:last-of-type {
          margin-left: 10px;
        }
      }
    }
  }
`;

/**
 * Step 3:
 *
 * Render it!
 */
render(<StyledApp />, document.querySelector('[data-approot]'));
