/* @flow */
import React, { Component } from 'react';
import withSpectro, { SpectroTextbox } from '../../src';
import './TweetEmbed.css';

type Props = {
    tweetId: string
};

type State = {
    ready: boolean
};

class TweetEmbed extends Component {
    constructor (props, context) {
        super(props, context);
        this.state = { ready: false };
    }

    state: State;

    componentDidMount () {
        this.createWidget();
    }

    componentDidUpdate (prevProps) {
        if (this.props.tweetId !== prevProps.tweetId) {
            this.createWidget();
        }
    }

    createWidget () {
        if (!window.twttr) {
            return;
        }

        this.node.innerHTML = '';

        window.twttr.widgets.createTweet(this.props.tweetId, this.node).then(() => {
            this.setState({ ready: true });
        });
    }

    keepRef = (node) => {
        this.node = node;
    };

    props: Props;

    node: HTMLElement;

    render () {
        return (
            <p
                ref={this.keepRef}
                className={[
                    'TwitterEmbed',
                    this.state.ready && 'TwitterEmbed--ready'
                ].join(' ')}
            />
        );
    }
}

export default withSpectro({
    label: 'Tweet Embed',
    void: true,
    props: {
        tweetId: <SpectroTextbox label="Tweet ID" required />
    }
})(TweetEmbed);
