import { Theme } from "./theme.js";

class UserSetting {
  accountId: number;
  theme: Theme;

  constructor(accountId: number, theme: Theme) {
    this.accountId = accountId;
    this.theme = theme;
  }
}
