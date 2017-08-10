import spacing from 'material-ui/styles/spacing';
import { grey50 } from 'material-ui/styles/colors';

export default {
  paper: {
    margin: spacing.desktopGutter,
    padding: spacing.desktopGutter,
  },
  container: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    minHeight: '100%',
    backgroundColor: grey50,
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    zIndex: 101,
  },
  tabs: {
    marginLeft: -24,
    marginRight: -24,
  },
  appBar: {
    flex: 'none',
    display: 'block',
    flexWrap: 'wrap',
    zIndex: 100,
    height: 64,
  },
  fields: {
    text: {
      width: "100%"
    },
  },
}
