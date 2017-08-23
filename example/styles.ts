import { css } from 'styled-components';

export default css`
  -webkit-font-smoothing: antialiased;
  font-family: sans-serif;

  input {
    margin: 0;
  }

  article {
    margin: 3rem auto;
    max-width: 700px;
  }

  hr {
    border: none;
    height: 3px;
    margin: 2rem 0;
    background-color: #ddd;
  }

  header {
    margin: 1em;

    h1 {
      font-size: 3.5em;
      font-weight: bold;
      margin: 0 0 0.5em 0;
    }

    p {
      font-size: 1.35rem;
      line-height: 1.5;
      font-style: italic;
      color: #666;
      margin: 0 0 1rem 0;
    }
  }

  main {
    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 2rem 1rem 1rem 1rem;
    }

    p {
      font-size: 1.2rem;
      line-height: 1.5;
      margin: 1rem;
    }

    ol, ul {
      list-style-position: inside;
      margin: 1rem;
      padding: 0;

      li {
        padding: 0.5rem;
        line-height: 1.25;
      }
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
