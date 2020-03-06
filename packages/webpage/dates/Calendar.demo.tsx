import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from '@material-ui/core';
import {
  Calendar,
  CalendarProps,
  CalendarQuickSelection,
  CalendarQuickSelectionItem,
  DateUtils,
  useDateUtils,
} from '@superdispatch/dates';
import { GridStack } from '@superdispatch/ui';
import { startCase } from 'lodash';
import React, { useMemo, useState } from 'react';

type Color = 'off' | keyof NonNullable<CalendarProps['highlightedDays']>;

const colors: Color[] = [
  'off',
  'blue',
  'green',
  'purple',
  'red',
  'teal',
  'yellow',
];

export default function CalendarDemo() {
  const dateUtils = useDateUtils();
  const [color, setColor] = useState<Color>('off');
  const [disabled, setDisabled] = useState(false);
  const [hasFooter, setHasFooter] = useState(false);
  const [hasQuickSelection, setHasQuickSelection] = useState(false);
  const today = useMemo(() => dateUtils.startOf(Date.now(), 'day'), [
    dateUtils,
  ]);

  const quickSelectionDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, idx) =>
        dateUtils.plus(today, { day: idx * 2 }),
      ),
    [today, dateUtils],
  );

  return (
    <GridStack spacing={2}>
      <FormControl>
        <FormLabel>State</FormLabel>
        <FormGroup row={true}>
          <FormControlLabel
            label="Disabled"
            control={<Switch />}
            checked={disabled}
            onChange={(_, checked) => setDisabled(checked)}
          />

          <FormControlLabel
            label="With Footer"
            control={<Switch />}
            checked={hasFooter}
            onChange={(_, checked) => setHasFooter(checked)}
          />

          <FormControlLabel
            label="With Quick Selection"
            control={<Switch />}
            checked={hasQuickSelection}
            onChange={(_, checked) => setHasQuickSelection(checked)}
          />
        </FormGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Highlight Color</FormLabel>
        <RadioGroup
          row={true}
          name="color"
          value={color}
          onChange={(_, value) => setColor(value as Color)}
        >
          {colors.map(x => (
            <FormControlLabel
              key={x}
              value={x}
              control={<Radio />}
              label={startCase(x)}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Paper elevation={8} style={{ display: 'inline-block' }}>
        <Calendar
          fromMonth={!disabled ? undefined : today}
          toMonth={!disabled ? undefined : today}
          disabledDays={
            !disabled ? undefined : date => date.getTime() < Date.now()
          }
          footer={
            hasFooter && (
              <Typography color="textSecondary">Footer helper text</Typography>
            )
          }
          highlightedDays={
            color === 'off'
              ? {}
              : {
                  [color]: (date: Date, utils: DateUtils) =>
                    utils.toObject(date).day % 2 === 0,
                }
          }
          quickSelection={
            hasQuickSelection && (
              <CalendarQuickSelection>
                {quickSelectionDays.map((day, idx) => (
                  <CalendarQuickSelectionItem key={idx}>
                    {dateUtils.format(day, 'date')}
                  </CalendarQuickSelectionItem>
                ))}
              </CalendarQuickSelection>
            )
          }
        />
      </Paper>
    </GridStack>
  );
}