import React, { useMemo, useState } from 'react';
import spacetime from 'spacetime';
import TimezoneSelect, { allTimezones } from '../../dist/esm/index.js';
import type { ITimezone, ILabelStyle } from '../../dist/esm/dist/index';

const Timezone = () => {
  const [selectedTimezone, setSelectedTimezone] =
    React.useState<ITimezone>('Europe/Rome');
  const [labelStyle, setLabelStyle] = React.useState<ILabelStyle>('original');

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelStyle(event.target.value as ILabelStyle);
  };

  const [datetime, setDatetime] = useState(spacetime.now());

  useMemo(() => {
    const tzValue =
      typeof selectedTimezone === 'string'
        ? selectedTimezone
        : selectedTimezone.value;
    setDatetime(datetime.goto(tzValue));
  }, [selectedTimezone]);

  return (
    <div className="wrapper">
      <div className="header">
        <h2>react-timezone-select</h2>
        <p>
          <a
            href="https://ndo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="author"
          >
            ndom91
          </a>
        </p>
      </div>
      <div className="select-wrapper">
        <TimezoneSelect
          value={selectedTimezone}
          onChange={setSelectedTimezone}
          labelStyle={labelStyle}
          onBlur={() => console.log('Blur!')}
          timezones={{
            ...allTimezones,
            'America/Lima': 'Pittsburgh',
            'Europe/Berlin': 'Frankfurt',
          }}
          helperText="Defaults to the browser's TZ"
          label="Timezone"
          variant="standard"
        />
      </div>
      <div className="label-style-select" onChange={handleLabelChange}>
        <span>Label Style:</span>
        <label htmlFor="original">
          <input
            type="radio"
            id="original"
            name="labelStyle"
            value={'ori}ginal'}
            defaultChecked={labelStyle === 'original'}
          />
          original
        </label>
        <label htmlFor="altName">
          <input
            type="radio"
            id="altName"
            name="labelStyle"
            value={'altName'}
          />
          altName
        </label>
        <label htmlFor="abbrev">
          <input type="radio" id="abbrev" name="labelStyle" value={'abbrev'} />
          abbrev
        </label>
        <label htmlFor="abbrev">
          <input
            type="radio"
            id="abbrev"
            name="labelStyle"
            value={'shortAltName'}
          />
          shortAltName
        </label>
        <label htmlFor="abbrev">
          <input
            type="radio"
            id="abbrev"
            name="labelStyle"
            value={'shortAbbrev'}
          />
          shortAbbrev
        </label>
      </div>
      <div className="code">
        <div>
          Current Date / Time in{' '}
          {typeof selectedTimezone === 'string'
            ? selectedTimezone.split('/')[1]
            : selectedTimezone.value.split('/')[1]}
          : <pre>{datetime.unixFmt('dd.MM.YY HH:mm:ss')}</pre>
        </div>
        <pre>{JSON.stringify(selectedTimezone, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Timezone;
