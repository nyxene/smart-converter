import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Counter, FILL_VALUE, Toolbar } from '../../components';
import { useDebounce } from '../../hooks/useDebounce';
import { usePostField } from '../../components/PostField/';

const PublisherStyled = styled.div`
`;

const CounterWrapper = styled.div`
    text-align: right;
`;

const Publisher = (): JSX.Element => {
    const {
        postField,
        post, setPost,
        disabledPost, setDisabledPost,
        clearPost,
        copyToClipboard
    } = usePostField();
    const debouncedPostLength = useDebounce<number>(post.length, 200);
    const [isConverted, setIsConverted] = useState<boolean>(false);
    const [covers, setCovers] = useState<string[]>([]);

    const toolbarActions = [];

    if (!isConverted) {
        toolbarActions.push(
            <Button
                type="button"
                disabled={disabledPost || !post}
                onClick={onConvertPost}
            >
                Convert
            </Button>
        );
    }

    if (isConverted && post.length) {
        toolbarActions.push(
            <Button
                type="button"
                onClick={onCopyPost}
            >
                Copy
            </Button>
        );
    }

    toolbarActions.push(
        <Button
            type="reset"
            disabled={!post}
            onClick={onResetAll}
        >
            Reset All
        </Button>
    );

    const toolbarItems = [
        ...toolbarActions,
        <CounterWrapper>
            <Counter length={debouncedPostLength} />
        </CounterWrapper>
    ];

    return (
        <PublisherStyled>
            {postField}
            <Toolbar
                fill={FILL_VALUE.last}
                items={toolbarItems}
            />
            {covers.map((dataUrl: string, index: number) => (
                <img
                    key={index}
                    srcSet={dataUrl}
                    alt={`Post cover ${index + 1}`}
                />
            ))}
        </PublisherStyled>
    );


    function onConvertPost(): void {
        const p = post.substring(0, 20);
        setIsConverted(true);
        setPost(p);
        return;

        if (!post.length) {
            return;
        }

        setIsConverted(false);

        fetch('http://localhost:3000/api/v1/converter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: post,
                options: {
                    textColor: '#514253',
                    bgColor: '#f4eae8'
                }
            })
        })
            .then(result => {
                try {
                    if (result.status >= 400) {
                        return result.json().then((err: { errors: string }) => {
                            throw new Error(err.errors);
                        });
                    }
                    return result.json();
                } catch (e) {
                    throw new Error(e);
                }
            })
            .then(result => {
                setIsConverted(true);
                setDisabledPost(true);
                setPost(result.post);
                result.covers && setCovers(result.covers);
            })
            .catch(e => {
                setDisabledPost(false);
                new Error(e);
            });
    }

    function onResetAll(): void {
        clearPost();
        setIsConverted(false);
    }

    function onCopyPost(): void {
        copyToClipboard();
    }
};

export default Publisher;
