import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ModalOverlay from './modal_overlay';
import Header from './header';
import ArticleShow from './article/article_show';
import ArticleEdit from './article/article_edit';
import ArticleNew from './article/article_new';

const App = () => {
  return (
    <main>
      <ModalOverlay />
      <Header />
      <Switch>
        <Route path="/articles/new" component={ArticleNew} />
        <Route path="/articles/:articleId/edit" component={ArticleEdit} />
        <Route path="/articles/:articleId" component={ArticleShow} />
      </Switch>
    </main>
  );
};

export default App;
