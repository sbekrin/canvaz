/* eslint-disable indent */
export default {
  type: 'Article',
  props: {
    title: 'Spectro Editor',
    children: [
      {
        type: 'Heading',
        props: {
          children: 'Switching to modular'
        }
      },
      {
        type: 'Paragraph',
        props: {
          lead: true,
          children: 'Forget everything you know about WYSIWYG editors. Spectro provides modular, visual way of manipulating content with clean, structured output.'
        }
      },
      {
        type: 'Paragraph',
        props: {
          children: 'Classic text-based editing feels initiative and simple, until you need to embed rich components (like photo slider or YouTube video). Never trust WYSIWYG output with empty elements, pasted inline styling from Word and so on.'
        }
      },
      {
        type: 'TweetEmbed',
        props: {
          tweetId: '662176400003211265'
        }
      },
      {
        type: 'Layout',
        props: {
          children: [
            {
              type: 'LayoutColumn',
              props: {
                children: [
                  {
                    type: 'Heading',
                    props: {
                      level: 3,
                      children: 'How to embed'
                    }
                  },
                  {
                    type: 'List',
                    props: {
                      type: 'ordered',
                      children: [
                        {
                          type: 'ListItem',
                          props: {
                            children: 'Install `spectro-editor` module'
                          }
                        },
                        {
                          type: 'ListItem',
                          props: {
                            children: 'Define components and wrap them with `withSpectro(MyComponent)` (or use `@withSpectro` decorator)'
                          }
                        },
                        {
                          type: 'ListItem',
                          props: {
                            children: 'Render it like regular component'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              type: 'LayoutColumn',
              props: {
                children: [
                  {
                    type: 'Heading',
                    props: {
                      level: 3,
                      children: 'How to store'
                    }
                  },
                  {
                    type: 'Paragraph',
                    props: {
                      children: 'It\'s required to store data in JSON. It may look strange at first, but storing JSON benefits a lot comparing to HTML markup (e.g. you can render content natively, without web view) Mongo is great for that, Postgres also has good JSON support.'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};
