import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import ViewOne from '../view-one';
import messages from './messages';
import styles from './main-view.mod.css';

const MainView = (props) => {
  const intl = useIntl();

  return (
    <Spacings.Inset scale="m">
      <Spacings.Stack scale="m">
        <Text.Headline as="h1" intlMessage={messages.title} />
        <div className={styles['nav-header']}></div>
        <Switch>
          <Route path={`${props.match.path}`} component={ViewOne} />
        </Switch>
      </Spacings.Stack>
    </Spacings.Inset>
  );
};
MainView.displayName = 'MainView';
MainView.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default MainView;
