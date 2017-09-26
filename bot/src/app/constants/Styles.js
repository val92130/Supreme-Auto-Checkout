import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey50 } from 'material-ui/styles/colors';
import { spacing, typography } from 'material-ui/styles';

const styles = {
  paper: {
    margin: spacing.desktopGutter,
    padding: spacing.desktopGutter / 2,
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
    flex: 1,
    marginLeft: 16,
  },
  tab: {
    height: 64,
  },
  appBar: {
    height: 64,
  },
  logo: {
    fontSize: 16,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: 'rgb(72, 72, 72)',
    marginBottom: 8,
    height: 64,
    textAlign: 'center',
  },
  fields: {
    text: {
      width: '100%',
    },
  },
  colors: {
    main: 'rgb(72, 72, 72)',
    drawer: 'rgb(250, 250, 250)',
    tabs: 'rgb(137, 189, 191)',
  },
  theme: {
    palette: {
      primary1Color: 'rgb(72, 72, 72)',
      primary2Color: 'rgb(72, 72, 72)',
    },
    drawer: {
      color: 'rgb(250, 250, 250)',
    },
  },
};

export function getTheme() {
  return getMuiTheme(styles.theme);
}

export default styles;
