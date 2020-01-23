import { Menu, MenuItem } from '@material-ui/core';
import { renderCSS, renderTheme } from '@superdispatch/testutils';
import React from 'react';

it('checks default props', () => {
  const { props } = renderTheme();

  expect(props.MuiMenu).toMatchInlineSnapshot(`
    Object {
      anchorOrigin: Object {
        horizontal: left,
        vertical: bottom,
      },
      getContentAnchorEl: null,
      keepMounted: true,
      transformOrigin: Object {
        horizontal: left,
        vertical: top,
      },
    }
  `);
  expect(props.MuiMenuItem).toMatchInlineSnapshot(`undefined`);
});

it('checks component css', () => {
  expect(
    renderCSS(
      <Menu open={true} anchorEl={document.body}>
        <MenuItem />
      </Menu>,
      [
        'MuiMenu',
        'MuiMenuItem',
        // TODO: Move to `Popover` component styles.
        'MuiPopover',
      ],
    ),
  ).toMatchInlineSnapshot(`
.MuiMenu-paper {
  max-height: calc(100% - 96px);
  -webkit-overflow-scrolling: touch;
}

.MuiMenu-list {
  outline: 0;
}

.MuiMenuItem-root {
  width: auto;
  overflow: hidden;
  font-size: 16px;
  box-sizing: border-box;
  min-height: 48px;
  font-family: SF Pro Text, -apple-system, BlinkMacSystemFont, 'San Francisco',
    'Roboto', 'Segoe UI', 'Helvetica Neue', 'Ubuntu', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 24px;
  padding-top: 8px;
  white-space: nowrap;
  padding-bottom: 8px;
}

@media (min-width: 600px) {
  .MuiMenuItem-root {
    font-size: 14px;
    min-height: auto;
    line-height: 20px;
  }
}

.MuiMenuItem-dense {
  font-size: 0.875rem;
  min-height: auto;
  font-family: SF Pro Text, -apple-system, BlinkMacSystemFont, 'San Francisco',
    'Roboto', 'Segoe UI', 'Helvetica Neue', 'Ubuntu', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.43;
}

.MuiPopover-paper {
  outline: 0;
  position: absolute;
  max-width: calc(100% - 32px);
  min-width: 16px;
  max-height: calc(100% - 32px);
  min-height: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
`);
});