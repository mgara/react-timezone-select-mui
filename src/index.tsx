import * as React from 'react'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import spacetime from 'spacetime'
import soft from 'timezone-soft'
import allTimezones from './timezone-list.js'
import type {
  Props,
  ITimezone,
  ITimezoneOption,
  ILabelStyle,
} from './types/timezone'
import MenuItem from '@mui/material/MenuItem'
import { Chip, ListItemIcon, ListItemText, TextField } from '@mui/material'

export { allTimezones }
export type { ITimezone, ITimezoneOption, Props, ILabelStyle }

const TimezoneSelect = ({
  value,
  onBlur,
  onChange,
  labelStyle = 'original',
  optionStyle = 'original',
  timezones,
  label,
  helperText,
  variant,
  ...props
}: Props) => {
  if (!timezones) timezones = allTimezones
  const getOptions = React.useMemo(() => {
    return Object.entries(timezones)
      .reduce<ITimezoneOption[]>((selectOptions, zone) => {
        const now = spacetime.now(zone[0])
        const tz = now.timezone()
        const tzStrings = soft(zone[0])

        let label = ''
        let render = ''
        let abbr = now.isDST()
          ? // @ts-expect-error
            tzStrings[0].daylight?.abbr
          : // @ts-expect-error
            tzStrings[0].standard?.abbr
        let altName = now.isDST()
          ? tzStrings[0].daylight?.name
          : tzStrings[0].standard?.name

        const min = tz.current.offset * 60
        const hr =
          `${(min / 60) ^ 0}:` + (min % 60 === 0 ? '00' : Math.abs(min % 60))
        const prefix = `${zone[1]}`
        const GMTDiff = `${hr.includes('-') ? hr : `+${hr}`}`

        switch (optionStyle) {
          case 'original':
            label = prefix
            break
          case 'altName':
            label = `${prefix} ${altName?.length ? `(${altName})` : ''}`
            break
          case 'abbrev':
            label = `${prefix} ${abbr?.length < 5 ? `(${abbr})` : ''}`
            break
          default:
            label = `${prefix}`
        }

        switch (labelStyle) {
          case 'original':
            render = prefix
            break
          case 'altName':
            render = `${prefix} ${altName?.length ? `(${altName})` : ''}`
            break
          case 'abbrev':
            render = `${prefix} ${abbr?.length < 5 ? `(${abbr})` : ''}`
            break
          case 'shortAltName':
            render = `${altName?.length ? `${altName}` : `${prefix}`}`
            break
          case 'shortAbbrev':
            render = `${abbr?.length ? `${abbr}` : `${prefix}`}`
            break
          default:
            render = `${prefix}`
        }

        selectOptions.push({
          value: tz.name,
          label,
          render,
          offset: tz.current.offset,
          abbrev: abbr,
          altName,
          GMTDiff,
        })

        return selectOptions
      }, [])
      .sort((a: ITimezoneOption, b: ITimezoneOption) => a.offset - b.offset)
  }, [labelStyle, timezones])

  const handleChange = (event: SelectChangeEvent) => {
    const tz: ITimezoneOption = event.target.value as unknown as ITimezoneOption
    onChange && onChange(tz)
  }

  const findFuzzyTz = (zone: string): ITimezoneOption => {
    let currentTime = spacetime.now('GMT')
    try {
      currentTime = spacetime.now(zone)
    } catch (err) {
      return
    }
    return getOptions
      .filter(
        (tz: ITimezoneOption) =>
          tz.offset === currentTime.timezone().current.offset
      )
      .map((tz: ITimezoneOption) => {
        let score = 0
        if (
          currentTime.timezones[tz.value.toLowerCase()] &&
          !!currentTime.timezones[tz.value.toLowerCase()].dst ===
            currentTime.timezone().hasDst
        ) {
          if (
            tz.value
              .toLowerCase()
              .indexOf(
                currentTime.tz.substring(currentTime.tz.indexOf('/') + 1)
              ) !== -1
          ) {
            score += 8
          }
          if (
            tz.label
              .toLowerCase()
              .indexOf(
                currentTime.tz.substring(currentTime.tz.indexOf('/') + 1)
              ) !== -1
          ) {
            score += 4
          }
          if (
            tz.value
              .toLowerCase()
              .indexOf(currentTime.tz.substring(0, currentTime.tz.indexOf('/')))
          ) {
            score += 2
          }
          score += 1
        } else if (tz.value === 'GMT') {
          score += 1
        }
        return { tz, score }
      })
      .sort((a, b) => b.score - a.score)
      .map(({ tz }) => tz)[0]
  }

  const parseTimezone = (zone: ITimezone) => {
    if (zone === null) return
    if (typeof zone === 'object' && zone.value && zone.label)
      return getOptions.find(tz => tz.value === zone.value)
    if (typeof zone === 'string') {
      return (
        getOptions.find(tz => tz.value === zone) ||
        (zone.indexOf('/') !== -1 && findFuzzyTz(zone))
      )
    } else if (zone.value && !zone.label) {
      return getOptions.find(tz => tz.value === zone.value)
    }
  }

  return (
    <FormControl variant={variant}>
      {!!label && (
        <InputLabel id="timezone-select-label-mui">{label}</InputLabel>
      )}
      <Select
        labelId="timezone-select-label-mui"
        id="select-tz-mui-id"
        value={parseTimezone(value)}
        onChange={handleChange}
        renderValue={value => <>{value.render}</>}
        {...props}
      >
        {getOptions.map((tz, idx) => (
          //@ts-ignore
          <MenuItem key={idx} value={tz}>
            <ListItemIcon>
              <Chip
                size="small"
                label={`GMT${tz.GMTDiff}`}
                style={{ marginRight: 2 }}
              />
            </ListItemIcon>
            <ListItemText primary={tz.label} />
          </MenuItem>
        ))}
      </Select>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default TimezoneSelect
