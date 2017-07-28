/* tslint:disable jsx-no-lambda */
import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import {
  CanvazProvider,
  CanvazContainer,
  withCanvaz,
  TextEditable,
  PropEditable,
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
})(({ children }) =>
  <TextEditable>
    <h2>
      {children}
    </h2>
  </TextEditable>
);

const Text = withCanvaz({
  label: 'Text',
})(({ children }) =>
  <TextEditable>
    <p>
      {children}
    </p>
  </TextEditable>
);

const Article = withCanvaz({
  label: 'Article',
  accept: [Heading, Text],
})(({ title, description, children, canvazKey }: any) =>
  <article>
    <header>
      <TextEditable canvazKey={canvazKey} prop="title">
        <h1>
          {title}
        </h1>
      </TextEditable>
      <TextEditable canvazKey={canvazKey} prop="description">
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
  state = {
    canvazEnabled: true,
  };

  renderToggle() {
    return (
      <label>
        Edit{' '}
        <input
          type="checkbox"
          onChange={event =>
            this.setState({ canvazEnabled: event.target.checked })}
          checked={this.state.canvazEnabled}
        />
      </label>
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderToggle()}
        <CanvazProvider components={{ Article, Heading, Text }}>
          <CanvazContainer
            editable={this.state.canvazEnabled}
            data={{
              type: 'Article',
              props: {
                title: 'Canvaz',
                description: `
                This is an example of Canvaz in action. 
                Go ahead and change content around. 
                You can also edit heading and this description by double click!
              `,
                children: [
                  {
                    type: 'Heading',
                    props: {
                      children: 'Some sample heading',
                    },
                  },
                  {
                    type: 'Text',
                    props: {
                      children: 'Sample paragraph in this article',
                    },
                  },
                ],
              },
            }}
          />
        </CanvazProvider>
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
  }
`;

/**
 * Step 3:
 *
 * Render it!
 */
render(<StyledApp />, document.querySelector('[data-approot]'));
