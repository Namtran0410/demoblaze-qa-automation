import { expect, Page } from '@playwright/test';

// 01.base.page.ts
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // Runs an action that opens a browser alert, accepts the alert and returns its message
  async acceptDialog(action: () => Promise<void>, expectedMessage?: string): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog')
    const actionPromise = action()
    const dialog = await dialogPromise
    const message = dialog.message()
    // Accept before checking: a failed check with the alert still open would leave the click hanging until timeout
    await dialog.accept()
    await actionPromise
    if(expectedMessage) {
      expect(message).toContain(expectedMessage)
    }
    return message
  }
  
  async reload(){
    await this.page.reload()
  }
}
