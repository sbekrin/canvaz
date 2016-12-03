/* @flow */
import React, { Component } from 'react';
import withSpectro from '../../src';
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
        window.twttr.widgets.createTweet(this.props.tweetId, this._node).then(() => {
            this.setState({ ready: true });
        });
    }

    props: Props;

    _node: HTMLElement;

    _keepRef = (node) => {
        this._node = node;
    };

    render () {
        return (
            <p
                ref={this._keepRef}
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
    void: true
})(TweetEmbed);
