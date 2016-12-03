import React from 'react';
import withSpectro from '../../src';
import Heading from './Heading';
import Paragraph from './Paragraph';
import List from './List';
import TweetEmbed from './TweetEmbed';
import Layout from './Layout';
import './Article.css';

type Props = {
    title: string,
    children: any
};

const Article = ({ title, children }: Props) => (
    <article className="Article">
        <h1>{title}</h1>
        <div>{children}</div>
    </article>
);

export default withSpectro({
    label: 'Article',
    accepts: [ Heading, Paragraph, List, TweetEmbed, Layout ]
})(Article);
