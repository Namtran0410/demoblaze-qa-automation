import { Page } from '@playwright/test';

// 01.base.page.ts
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // Runs an action that opens a browser alert, accepts the alert and returns its message
  async acceptDialog(action: () => Promise<void>): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog')
    const actionPromise = action()
    const dialog = await dialogPromise
    const message = dialog.message()
    await dialog.accept()
    await actionPromise
    return message
  }
  async reload(){
    await this.page.reload()
  }
}
