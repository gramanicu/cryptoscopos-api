# Cryptoscopos API

The backend component of the Cryptoscopos Project.

## Alerts

The alerts are triggered only once and then they can be resetted (by setting the __triggered__ property to false). The "trigger" string has a format similar to:
`{subject} {condition (>=/<=/+/-)} {amount (value/percent)} [in the last {period in ms}]?`.

Some examples:

- "x account's profit reaches a value of 20000". - `account_profit {account_id} = 20000`
- "ethereum increased by 20% in the last 5 days". - `coin_value {coin_id} + 20% last {5*24*60*60*1000}`

In the case of accounts, only absoluted values can be used (reaches/= a specific value).
All parts of the trigger string are separated by space.

- subject - `account_value/account_profit {account_id}`, `coin_value {coin_id}`
- condition - `>=`, `<=`, `+`, `-`
- amount - `{value}`, `{percent}%` - value and percent must be numbers (can be floating point numbers). Percent amounts are used for comparisons (+/-). If you want to compare values, use `>= or <=`.
- (used only in case of percent amounts) - `last {period in ms}`

© 2022 Grama Nicolae
