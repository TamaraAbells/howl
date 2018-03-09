import React from 'react';
import { connect } from 'react-redux';
import { merge } from 'lodash';

import {
  selectArticleChunks,
  selectArticleChunksforEdit
} from '../../reducers/selectors.js';
import {
  fetchArticle,
  updateArticle
} from '../../actions/article_actions';
import {
  receiveChunk,
  deleteChunk,
  createChunk
} from '../../actions/chunk_actions';

import UserHeader from '../user_header';
import ArticleTitleEditor from './article_title_editor';
import ArticleEditBody from './article_edit_body';

class ArticleEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {saveTimer: null};
  }

  componentDidMount(){
    this.props.fetchArticle(this.props.articleId);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.articleId !== nextProps.articleId){
      this.props.fetchArticle(nextProps.articleId);
    }
  }

  saveHandler(){
    clearTimeout(this.state.saveTimer);
    this.setState({
      saveTimer: window.setTimeout(() => {
        this.props.updateArticle(this.packagedArticle());
        console.log("articlesaved");
      }, 5000)
    });
  }

  packagedArticle() {
    const packagedArticle = merge({}, this.props.article);
    packagedArticle.chunks_attributes = [];
    this.props.article.chunks.forEach((chunkId) => {
      packagedArticle.chunks_attributes.push(this.props.chunks[chunkId]);
    });
    delete packagedArticle.chunks;
    return packagedArticle;
  }

  render(){
    if (this.props.article.chunks.length === 0 || !this.props.author.length === 0) {
      return <div></div>;
    }
    return (
      <div className="article_show" onInput={this.saveHandler.bind(this)}>
        <div id="article_title">{this.props.article.title}</div>
        <ArticleEditBody
          chunks={this.props.chunks}
          article={this.props.article}
          author={this.props.author}
          receiveChunk={this.props.receiveChunk}
          deleteChunk={this.props.deleteChunk}
          createChunk={this.props.createChunk}
          />
      </div>
    );
  }

}

const msp = (state, ownProps) => {
  const articleId = ownProps.match.params.articleId;
  const article = state.ents.articles[articleId] || {chunks: []};
  const author = state.ents.users[article.author_id] || {};
  return {
    articleId: articleId,
    article: article,
    chunks: selectArticleChunksforEdit(state, article),
    author: author,
  };
};

const mdp = (dispatch) => {
  return {
    fetchArticle: (id) => dispatch(fetchArticle(id)),
    receiveChunk: (chunk) => dispatch(receiveChunk(chunk)),
    deleteChunk: (chunk) => dispatch(deleteChunk(chunk)),
    createChunk: (chunk, ord) => dispatch(createChunk(chunk, ord)),
    updateArticle: (packagedArticle) => dispatch(updateArticle(packagedArticle))
  };
};

export default connect(msp, mdp)(ArticleEdit);


// NOTE: Hidding RETURN should generate a new empty chunk below current
// chunk (not splitting content).  Pressing BACKSPACE in an empty chunk
// should delete the chunk
// NOTE: and return the cursor to the end of the previous chunk.