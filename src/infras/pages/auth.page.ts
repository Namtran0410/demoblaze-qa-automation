import { BasePage } from "@infras/pages/base.page"

export class AuthPage extends BasePage {
    // Log in modal
    get loginModal() {
        return this.page.getByRole("dialog", { name: "Log in" })
    }
    get loginTitle() {
        return this.loginModal.getByRole("heading", { name: "Log in" })
    }
    // Labels have no role, so they are found by text
    get loginUsernameLabel() {
        return this.loginModal.getByText("Username:", { exact: true })
    }
    get loginPasswordLabel() {
        return this.loginModal.getByText("Password:", { exact: true })
    }
    // The inputs have no accessible name (their labels point to wrong ids), so pick them by order
    get loginUsernameInput() {
        return this.loginModal.getByRole("textbox").nth(0)
    }
    get loginPasswordInput() {
        return this.loginModal.getByRole("textbox").nth(1)
    }
    // Both the header X and the footer button are named "Close"
    get loginCloseX() {
        return this.loginModal.getByRole("button", { name: "Close" }).first()
    }
    get loginCloseButton() {
        return this.loginModal.getByRole("button", { name: "Close" }).last()
    }
    get loginButton() {
        return this.loginModal.getByRole("button", { name: "Log in" })
    }

    // Sign up modal
    get signUpModal() {
        return this.page.getByRole("dialog", { name: "Sign up" })
    }
    get signUpTitle() {
        return this.signUpModal.getByRole("heading", { name: "Sign up" })
    }
    get signUpUsernameLabel() {
        return this.signUpModal.getByText("Username:", { exact: true })
    }
    get signUpPasswordLabel() {
        return this.signUpModal.getByText("Password:", { exact: true })
    }
    get signUpUsernameInput() {
        return this.signUpModal.getByRole("textbox", { name: "Username:" })
    }
    get signUpPasswordInput() {
        return this.signUpModal.getByRole("textbox", { name: "Password:" })
    }
    get signUpCloseX() {
        return this.signUpModal.getByRole("button", { name: "Close" }).first()
    }
    get signUpCloseButton() {
        return this.signUpModal.getByRole("button", { name: "Close" }).last()
    }
    get signUpButton() {
        return this.signUpModal.getByRole("button", { name: "Sign up" })
    }
}

export default AuthPage
