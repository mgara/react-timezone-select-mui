import type { Props as ReactSelectProps } from 'react-select'

export type ICustomTimezone = {
  [key: string]: string
}

export type ILabelStyle =
  | 'original'
  | 'altName'
  | 'abbrev'
  | 'shortAltName'
  | 'shortAbbrev'
export type IOptionStyle = 'original' | 'altName' | 'abbrev'

export interface ITimezoneOption {
  value: string
  label: string
  abbrev?: string
  altName?: string
  offset?: number
  GMTDiff?: string
  render?: string
}

export type ITimezone = ITimezoneOption | string

export interface Props extends Omit<ReactSelectProps, 'onChange'> {
  value: ITimezone
  labelStyle?: ILabelStyle
  optionStyle?: IOptionStyle
  onChange?: (timezone: ITimezoneOption) => void
  timezones?: ICustomTimezone
}
