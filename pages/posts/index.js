import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import withRedux from "next-redux-wrapper";

import { makeStore } from '~/store'

import Layout from '~/layouts/main'
import Post from './sub/post'

import { getPosts, getInitialPosts } from './store.js'

class Posts extends Component {
    static getInitialProps ({store, isServer, pathname, query}) {

        const posts = getInitialPosts()
        store.dispatch(posts);

        return posts.resolution.then((response) => {
            store.dispatch({
                type: 'posts/SET_ALL',
                posts: response.posts
            });
        })
    }

    render() {
        let loadingNode = null
        if (this.props.loading) {
            loadingNode = (
                <div className="posts__loading">...loading</div>
            )
        }

        let postsNode = null
        if (this.props.posts) {
            postsNode = this.props.posts.map((post, i) => {
                return (
                    <Post {...post} key={i}/>
                )
            })
        }

        let errorNode = null
        if (this.props.error) {
            return (
                <div className="posts__error">Error: {this.props.error}</div>
            )
        }

        return (
            <Layout>
                <section>
                    <h1>WP posts</h1>
                    <div>
                        {loadingNode}
                        {errorNode}
                        {postsNode}
                    </div>
                </section>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    loading: state.posts.loading,
    error: state.posts.error
})

// const mapDispatchToProps = dispatch => bindActionCreators({
//     getPosts
// }, dispatch)

export default withRedux(makeStore, mapStateToProps)(Posts)

